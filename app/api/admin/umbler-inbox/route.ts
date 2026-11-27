import {NextResponse} from "next/server";
import {getCrmUser,validCrmOrigin} from "@/app/lib/crm-google-session";
import {umblerConfig,UmblerConfigError,safeMailFailure} from "@/app/lib/umbler-config";
import {MAIL_PAGE_SIZE,MAIL_BODY_LIMIT,mailReadRequest,mailSequenceRange,mailTextPart,mailHtmlText} from "@/app/lib/mail-read";
import {ImapFlow} from "imapflow";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export const maxDuration=60;
const json=(x:unknown,status=200)=>NextResponse.json(x,{status,headers:{"Cache-Control":"private, no-store, max-age=0","X-Robots-Tag":"noindex, nofollow","X-Content-Type-Options":"nosniff"}});
function summary(m:{uid:number;envelope?:{subject?:string;from?:{name?:string;address?:string}[];date?:Date};internalDate?:Date|string;flags?:Set<string>}){
 const date=new Date(m.envelope?.date||m.internalDate||0);
 return {uid:m.uid,subject:(m.envelope?.subject||"(Sem assunto)").slice(0,1000),from:(m.envelope?.from||[]).slice(0,10).map(a=>[a.name,a.address].filter(Boolean).join(" · ")).join(", ").slice(0,1000),date:Number.isNaN(date.getTime())?null:date.toISOString(),seen:m.flags?.has("\\Seen")===true};
}
export async function POST(request:Request){
 if(!await getCrmUser())return json({error:"Entre com sua conta Google."},401);
 if(!validCrmOrigin(request))return json({error:"Origem inválida."},403);
 if(!request.headers.get("content-type")?.startsWith("application/json"))return json({error:"Formato inválido."},415);
 let input;
 try{const raw=await request.text();if(raw.length>512)throw Error();input=mailReadRequest(JSON.parse(raw));}catch{return json({error:"Solicitação inválida."},400);}
 if(!input)return json({error:"Solicitação inválida."},400);
 let c:ReturnType<typeof umblerConfig>;
 try{c=umblerConfig(input.account,{UMBLER_CONTATO_PASSWORD:process.env.UMBLER_CONTATO_PASSWORD,UMBLER_FINANCEIRO_PASSWORD:process.env.UMBLER_FINANCEIRO_PASSWORD});}
 catch(e){return json({error:e instanceof UmblerConfigError?"Credencial não disponível no ambiente.":"Configuração indisponível."},503);}
 const imap=new ImapFlow({host:c.imapHost,port:c.imapPort,secure:true,auth:{user:c.user,pass:c.pass},logger:false,connectionTimeout:10000,greetingTimeout:10000,socketTimeout:12000,tls:{rejectUnauthorized:true,minVersion:"TLSv1.2"},disableAutoIdle:true});
 imap.on("error",()=>{});
 const timer=setTimeout(()=>imap.close(),40000);
 try{
  await imap.connect();
  const box=await imap.mailboxOpen("INBOX",{readOnly:true});
  const uidValidity=String(box.uidValidity);
  if(input.action==="list"){
   const range=mailSequenceRange(box.exists,input.page);
   const messages=range?await imap.fetchAll(range,{uid:true,envelope:true,internalDate:true,flags:true}):[];
   return json({account:input.account,uidValidity,page:input.page,total:box.exists,hasMore:box.exists>(input.page+1)*MAIL_PAGE_SIZE,messages:messages.map(summary).sort((a,b)=>b.uid-a.uid),readOnly:true});
  }
  if(uidValidity!==input.uidValidity)return json({error:"A caixa mudou. Atualize a lista antes de abrir a mensagem."},409);
  const message=await imap.fetchOne(input.uid,{uid:true,envelope:true,internalDate:true,flags:true,bodyStructure:true},{uid:true});
  if(!message)return json({error:"Mensagem não localizada. Atualize a lista."},404);
  const part=mailTextPart(message.bodyStructure);
  if(!part)return json({message:summary(message),body:null,format:null,truncated:false,readOnly:true});
  const result=await imap.download(input.uid,part.part,{uid:true,maxBytes:MAIL_BODY_LIMIT+1});
  if(!result.content)return json({error:"Conteúdo indisponível."},502);
  const chunks:Buffer[]=[];let length=0;
  for await(const chunk of result.content){
   const bytes=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk);
   if(length<MAIL_BODY_LIMIT+1){const keep=bytes.subarray(0,MAIL_BODY_LIMIT+1-length);chunks.push(keep);length+=keep.length;}
  }
  const body=Buffer.concat(chunks).subarray(0,MAIL_BODY_LIMIT).toString("utf8");
  return json({message:summary(message),body:part.kind==="html"?mailHtmlText(body):body,format:part.kind,truncated:length>MAIL_BODY_LIMIT||(typeof part.size==="number"&&part.size>MAIL_BODY_LIMIT),readOnly:true});
 }catch(e){return json({error:safeMailFailure(e)},502);}
 finally{clearTimeout(timer);imap.close();}
}
