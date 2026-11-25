import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getCrmUser, validCrmOrigin } from "@/app/lib/crm-google-session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const statuses = {
 client:["lead","negociação","ativo","inativo","a conferir"],
 contract:["minuta","aguardando assinatura","assinado","encerrado","a conferir"],
 monthly:["prevista","cobrada","cancelada"],
 payment:["pendente","recebido","cancelado"],
 delivery:["pendente","em andamento","concluída"],
 document:["minuta","validado","arquivado","a conferir"],
} as const;
type Kind = keyof typeof statuses;
type RecordData = {id:string;kind:Kind;title:string;clientId:string;unit:string;status:string;amountCents:number;date:string;notes:string;url:string;updatedAt?:string;updatedBy?:string};
class CrmError extends Error { constructor(message:string,public status:number){super(message);} }
const headers={"Cache-Control":"private, no-store, max-age=0","X-Content-Type-Options":"nosniff","X-Robots-Tag":"noindex, nofollow","Referrer-Policy":"no-referrer"};
function json(data:unknown,status=200){return NextResponse.json(data,{status,headers});}
function errorResponse(err:unknown){return err instanceof CrmError?json({error:err.message},err.status):json({error:"CRM temporariamente indisponível. Nenhum dado foi confirmado como salvo."},503);}

async function authorize(request:Request):Promise<string>{
 const user=await getCrmUser();
 if(!user)throw new CrmError("Entre com sua conta Google.",401);
 if(request.method==="POST"&&!validCrmOrigin(request))throw new CrmError("Origem da solicitação inválida.",403);
 return user.sub;
}

const pathname="ey-crm/records-v1.json";
function blobConfig(){
 const token=process.env.BLOB_READ_WRITE_TOKEN;
 const storeId=token?.split("_")[3];
 if(!token||!storeId||!/^[A-Za-z0-9]+$/.test(storeId))throw new CrmError("Armazenamento privado não configurado.",503);
 return {token,storeId};
}
async function readBlob(path=pathname):Promise<{rows:RecordData[];version:string}|null>{
 const {token,storeId}=blobConfig();
 const r=await fetch("https://"+storeId+".private.blob.vercel-storage.com/"+path+"?cache=0",{
  headers:{Authorization:"Bearer "+token},cache:"no-store",redirect:"error",signal:AbortSignal.timeout(10000)
 });
 if(r.status===404)return null;
 if(!r.ok)throw new CrmError("Não foi possível consultar o armazenamento privado.",503);
 const version=r.headers.get("etag");if(!version)throw new CrmError("Versão dos registros indisponível.",503);
 const rows=await r.json();if(!Array.isArray(rows)||rows.length>10000)throw new CrmError("Base de registros inválida.",503);
 return {rows,version};
}
async function writeBlob(rows:RecordData[],version?:string,path=pathname){
 const {token,storeId}=blobConfig();const body=JSON.stringify(rows);
 if(Buffer.byteLength(body)>3500000)throw new CrmError("Limite de armazenamento desta versão atingido.",413);
 const h:Record<string,string>={Authorization:"Bearer "+token,"x-vercel-blob-store-id":storeId,"x-api-version":"13","x-vercel-blob-access":"private","x-content-type":"application/json","x-add-random-suffix":"0","x-allow-overwrite":version?"1":"0","x-cache-control-max-age":"60","Content-Type":"application/json"};
 if(version){if(version.startsWith("W/"))throw new CrmError("Versão fraca do armazenamento; gravação protegida.",409);h["x-if-match"]=version.startsWith('"')?version:'"'+version+'"';}
 h["x-api-blob-request-id"]=randomUUID();h["x-api-blob-request-attempt"]="0";h["x-content-length"]=String(Buffer.byteLength(body));
 const r=await fetch("https://vercel.com/api/blob/?"+new URLSearchParams({pathname:path}),{method:"PUT",headers:h,body,cache:"no-store",redirect:"error",signal:AbortSignal.timeout(10000)});
 if(!r.ok){
  let code="unknown";try{const result=await r.json();const candidate=result?.error?.code??result?.code;if(typeof candidate==="string"&&/^[a-zA-Z0-9_-]{1,80}$/.test(candidate))code=candidate;}catch{}
  console.warn("[crm-blob-write]",{status:r.status,code,conditional:Boolean(version),archive:path!==pathname});
  if(r.status===409||r.status===412)throw new CrmError("Outra gravação alterou a base. Atualize o painel.",409);
  throw new CrmError("Armazenamento recusou a gravação ("+r.status+"). Nenhum dado anterior foi substituído.",503);
 }
}
const archivePath="ey-crm/contract-import-v1.json";
type Snapshot={rows:RecordData[];version:string;notice?:string};
function mergeRows(original:RecordData[],imported:RecordData[]){
 const rows=[...original];
 for(const item of imported){
  if(rows.some(r=>r.id===item.id||(item.url&&r.url===item.url)))continue;
  if(item.kind!=="client"&&!rows.some(r=>r.id===item.clientId&&r.kind==="client"))continue;
  rows.push(item);
 }
 return rows;
}
// Keep the existing editable snapshot untouched. Import is an independent,
// create-only private archive and cannot block a successful authenticated read.
async function withArchive(current:Snapshot):Promise<Snapshot>{
 let imported:RecordData[]=[];
 const raw=process.env.EY_CRM_CONTRACT_IMPORT_V1;
 try{
  if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed))imported=parsed;}
 }catch{console.warn("[crm-archive] invalid configuration");}
 let notice:string|undefined;
 try{
  const stored=await readBlob(archivePath);
  if(stored)imported=stored.rows;
  else if(imported.length){
   try{await writeBlob(imported,undefined,archivePath);}
   catch{const raced=await readBlob(archivePath);if(raced)imported=raced.rows;else throw Error("archive not stored");}
   const verified=await readBlob(archivePath);if(!verified)throw Error("archive not verified");imported=verified.rows;
  }
 }catch{notice="A biblioteca de contratos está disponível pela configuração privada; a cópia no armazenamento ainda não foi confirmada.";console.warn("[crm-archive] persistence not confirmed");}
 return {rows:mergeRows(current.rows,imported),version:current.version,notice};
}
async function load():Promise<Snapshot>{
 const existing=await readBlob();if(existing)return withArchive(existing);
 const initial=process.env.EY_CRM_INITIAL_DATA;
 if(!initial)throw new CrmError("Importação inicial não configurada.",503);
 const rows=JSON.parse(initial);if(!Array.isArray(rows)||!rows.length)throw new CrmError("Importação inicial inválida.",503);
 try{await writeBlob(rows);}catch(err){const raced=await readBlob();if(raced)return withArchive(raced);throw err;}
 const saved=await readBlob();if(!saved)throw new CrmError("Não foi possível confirmar a importação inicial.",503);return withArchive(saved);
}
function validate(input:unknown,rows:RecordData[]):Omit<RecordData,"id">{
 if(!input||typeof input!=="object")throw new CrmError("Registro inválido.",400);
 const v=input as Record<string,unknown>;
 const string=(key:string,max:number)=>{const x=v[key];if(typeof x!=="string"||x.length>max)throw new CrmError("Campo inválido: "+key,400);return x.trim();};
 const kind=string("kind",20) as Kind;
 if(!Object.prototype.hasOwnProperty.call(statuses,kind))throw new CrmError("Tipo inválido.",400);
 const title=string("title",180),clientId=string("clientId",100),unit=string("unit",150),status=string("status",50),date=string("date",10),notes=string("notes",5000),url=string("url",1000);
 if(!title||!(statuses[kind] as readonly string[]).includes(status)|| (kind==="client"?clientId!=="":!rows.some(r=>r.id===clientId&&r.kind==="client")))throw new CrmError("Revise o título, cliente e status.",400);
 if(date&&!/^\d{4}-\d{2}-\d{2}$/.test(date))throw new CrmError("Data inválida.",400);
 if(url){try{if(new URL(url).protocol!=="https:")throw Error();}catch{throw new CrmError("Use um link HTTPS.",400);}}
 const amountCents=v.amountCents;
 if(typeof amountCents!=="number"||!Number.isSafeInteger(amountCents)||amountCents<0||amountCents>10000000000)throw new CrmError("Valor inválido.",400);
 return {kind,title,clientId,unit,status,date,notes,url,amountCents};
}
export async function GET(request:Request){
 try{await authorize(request);return json(await load());}catch(err){return errorResponse(err);}
}
export async function POST(request:Request){
 try{
  const uid=await authorize(request);
  if(!request.headers.get("content-type")?.startsWith("application/json"))throw new CrmError("Formato inválido.",415);
  const raw=await request.text();if(raw.length>20000)throw new CrmError("Registro muito extenso.",413);
  let payload;try{payload=JSON.parse(raw);}catch{throw new CrmError("JSON inválido.",400);}
  const current=await load();
  if(payload.version!==current.version)throw new CrmError("Outra alteração ocorreu. Recarregue o painel antes de salvar.",409);
  const item=validate(payload.item,current.rows);
  const id=payload.id===null?randomUUID():payload.id;
  if(typeof id!=="string"||id.length>100)throw new CrmError("Identificador inválido.",400);
  const index=current.rows.findIndex(r=>r.id===id);
  if(payload.id!==null&&(index===-1||current.rows[index].kind!==item.kind))throw new CrmError("Registro não encontrado ou tipo alterado.",404);
  const record={...item,id,updatedAt:new Date().toISOString(),updatedBy:uid};
  const rows=[...current.rows];if(index>=0)rows[index]=record;else rows.push(record);
  await writeBlob(rows,current.version);
  const saved=await readBlob();if(!saved)throw new CrmError("Não foi possível confirmar a gravação.",503);return json(await withArchive(saved));
 }catch(err){return errorResponse(err);}
}
