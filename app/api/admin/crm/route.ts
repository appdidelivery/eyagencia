import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { modules, clientOptional, validDate, validPeriod, canGenerate, companyOf, type Kind, type Row, type Item, type Company } from "@/app/lib/crm-model";
import { getCrmUser, validCrmOrigin } from "@/app/lib/crm-google-session";
import { CrmError, readSnapshot, strongVersion } from "@/app/lib/crm-blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RecordData=Row;
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
 return readSnapshot<RecordData>(path,blobConfig());
}
async function writeBlob(rows:RecordData[],version?:string,path=pathname){
 const {token,storeId}=blobConfig();const body=JSON.stringify(rows);
 if(Buffer.byteLength(body)>3500000)throw new CrmError("Limite de armazenamento desta versão atingido.",413);
 const h:Record<string,string>={Authorization:"Bearer "+token,"x-vercel-blob-store-id":storeId,"x-api-version":"13","x-vercel-blob-access":"private","x-content-type":"application/json","x-add-random-suffix":"0","x-allow-overwrite":version?"1":"0","x-cache-control-max-age":"60","Content-Type":"application/json"};
 if(version){const match=strongVersion(version);if(!match)throw new CrmError("Versão segura do armazenamento indisponível.",503);h["x-if-match"]=match;}
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
function validate(input:unknown,rows:RecordData[],existing?:Row):Item{
 if(!input||typeof input!=="object")throw new CrmError("Registro inválido.",400);
 const v=input as Record<string,unknown>;
 const string=(key:string,max:number,optional=false)=>{const x=v[key];if(x===undefined&&optional)return "";if(typeof x!=="string"||x.length>max)throw new CrmError("Campo inválido: "+key,400);return x.trim();};
 const kind=string("kind",20) as Kind;
 if(!Object.prototype.hasOwnProperty.call(modules,kind))throw new CrmError("Tipo inválido.",400);
 const title=string("title",180),clientId=string("clientId",100),unit=string("unit",150),status=string("status",50),date=string("date",10),notes=string("notes",5000),url=string("url",1000);
 if(!title||!(modules[kind].statuses as readonly string[]).includes(status)|| (kind==="client"?clientId!=="":clientId?!rows.some(r=>r.id===clientId&&r.kind==="client"):!clientOptional.has(kind)))throw new CrmError("Revise o título, cliente e status.",400);
 const company=string("company",20,true) as Company;
 if(!["","EYAGENCIA","VELO"].includes(company))throw new CrmError("Empresa inválida.",400);
 const period=string("period",7,true),paidDate=string("paidDate",10,true),startDate=string("startDate",10,true),endDate=string("endDate",10,true);
 for(const d of [date,paidDate,startDate,endDate])if(d&&!validDate(d))throw new CrmError("Data inválida.",400);
 if(period&&!validPeriod(period))throw new CrmError("Competência inválida.",400);
 if(startDate&&endDate&&endDate<startDate)throw new CrmError("Fim anterior ao início.",400);
 if(url){try{const u=new URL(url);if(u.protocol!=="https:"||u.username||u.password)throw Error()}catch{throw new CrmError("Use um link HTTPS sem credenciais.",400)}}
 const amountCents=v.amountCents;
 if(typeof amountCents!=="number"||!Number.isSafeInteger(amountCents)||amountCents<0||amountCents>10000000000)throw new CrmError("Valor inválido.",400);
 const recurring=v.recurring===true;
 const priority=string("priority",20,true)||"normal";
 if(!["baixa","normal","alta","urgente"].includes(priority))throw new CrmError("Prioridade inválida.",400);
 const email=string("email",180,true),phone=string("phone",50,true),owner=string("owner",150,true),service=string("service",250,true),source=string("source",150,true),nextAction=string("nextAction",500,true),time=string("time",5,true),referenceId=string("referenceId",100,true);
 if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new CrmError("E-mail inválido.",400);
 if(time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))throw new CrmError("Horário inválido.",400);
 if(["monthly","expense","payment"].includes(kind)&&!period)throw new CrmError("Informe a competência do lançamento; não confunda histórico com previsão.",400);
 if((kind==="payment"&&status==="recebido"||kind==="expense"&&status==="paga")&&!paidDate)throw new CrmError("Informe a data efetiva da movimentação confirmada.",400);
 if(kind==="contract"&&recurring&&(!startDate||amountCents<=0))throw new CrmError("Contrato recorrente exige valor mensal e início de vigência.",400);
 if(referenceId){
  const ref=rows.find(r=>r.id===referenceId);
  if(!ref||!((kind==="monthly"&&ref.kind==="contract")||(kind==="payment"&&ref.kind==="monthly")||(kind==="expense"&&ref.kind==="expense"))||ref.clientId!==clientId||ref.id===existing?.id)throw new CrmError("Vínculo financeiro inválido.",400);
  const refCompany=companyOf(ref,rows), effectiveCompany=company||rows.find(r=>r.kind==="client"&&r.id===clientId)?.company||"";
  if(refCompany!==effectiveCompany)throw new CrmError("Empresas do vínculo não coincidem. Classifique os registros de origem primeiro.",400);
  if(kind==="monthly"||kind==="expense"){
   if(rows.some(r=>r.id!==existing?.id&&r.kind===kind&&r.period===period&&r.referenceId===referenceId))throw new CrmError("Já existe lançamento dessa recorrência para a competência.",409);
   if(!existing&&!canGenerate(rows,ref,period))throw new CrmError("Recorrência não disponível nessa competência.",409);
  }
  if(kind==="payment"&&ref.status==="cancelada")throw new CrmError("Mensalidade cancelada.",400);
  if(kind==="payment"&&status==="recebido"&&sumReceived(rows,referenceId,existing?.id)+amountCents>ref.amountCents)throw new CrmError("Recebimento excede o saldo do lançamento. Revise os valores.",400);
 }
 if(existing&&rows.some(r=>r.referenceId===existing.id)&&(existing.clientId!==clientId||companyOf(existing,rows)!==(company||rows.find(r=>r.kind==="client"&&r.id===clientId)?.company||"")))throw new CrmError("Registro possui vínculos; revise a empresa e o cliente antes de alterar.",400);
 if(kind==="monthly"&&existing&&sumReceived(rows,existing.id)>amountCents)throw new CrmError("Valor menor que os recebimentos vinculados.",400);
 if(kind==="monthly"&&existing&&status==="cancelada"&&rows.some(r=>r.kind==="payment"&&r.referenceId===existing.id&&r.status==="recebido"))throw new CrmError("Revise recebimentos vinculados antes de cancelar.",400);
 return {kind,title,clientId,unit,status,date,notes,url,amountCents,company,period,paidDate,startDate,endDate,recurring,referenceId,owner,priority,email,phone,service,source,nextAction,time};
}
function sumReceived(rows:Row[],id:string,exclude?:string){return rows.filter(r=>r.kind==="payment"&&r.referenceId===id&&r.id!==exclude&&r.status==="recebido").reduce((n,r)=>n+r.amountCents,0)}
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
  const id=payload.id===null?randomUUID():payload.id;
  if(typeof id!=="string"||id.length>100)throw new CrmError("Identificador inválido.",400);
  const index=current.rows.findIndex(r=>r.id===id);
  const existing=index>=0?current.rows[index]:undefined;
  const item=validate(payload.item,current.rows,existing);
  if(payload.id!==null&&(index===-1||current.rows[index].kind!==item.kind))throw new CrmError("Registro não encontrado ou tipo alterado.",404);
  const now=new Date().toISOString();
  const record={...existing,...item,id,createdAt:existing?.createdAt||now,createdBy:existing?.createdBy||uid,updatedAt:now,updatedBy:uid};
  const rows=[...current.rows];if(index>=0)rows[index]=record;else rows.push(record);
  await writeBlob(rows,current.version);
  const saved=await readBlob();if(!saved)throw new CrmError("Não foi possível confirmar a gravação.",503);
  const confirmed=saved.rows.find(r=>r.id===id);
  if(!confirmed||confirmed.updatedAt!==now||confirmed.updatedBy!==uid||Object.entries(item).some(([key,value])=>confirmed[key as keyof Row]!==value))throw new CrmError("Não foi possível confirmar a alteração. Atualize o painel antes de tentar novamente.",409);
  return json(await withArchive(saved));
 }catch(err){return errorResponse(err);}
}
