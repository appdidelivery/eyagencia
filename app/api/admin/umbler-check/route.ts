import {NextResponse} from "next/server";
import {getCrmUser,validCrmOrigin} from "@/app/lib/crm-google-session";
import {mailAccount,umblerConfig,MAIL_ACCOUNTS} from "@/app/lib/umbler-config";
import {ImapFlow} from "imapflow";
import nodemailer from "nodemailer";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export const maxDuration=60;
const json=(x:unknown,status=200)=>NextResponse.json(x,{status,headers:{"Cache-Control":"private, no-store, max-age=0","X-Robots-Tag":"noindex, nofollow","X-Content-Type-Options":"nosniff"}});
type Config=ReturnType<typeof umblerConfig>;
async function verifyImap(c:Config){
 const imap=new ImapFlow({host:c.imapHost,port:c.imapPort,secure:true,auth:{user:c.user,pass:c.pass},logger:false,connectionTimeout:10000,greetingTimeout:10000,socketTimeout:12000,tls:{rejectUnauthorized:true,minVersion:"TLSv1.2"},disableAutoIdle:true});
 imap.on("error",()=>{});
 const timer=setTimeout(()=>imap.close(),24000);
 try{await imap.connect();const mailbox=await imap.mailboxOpen("INBOX",{readOnly:true});return {ok:true,messageCount:mailbox.exists};}catch{return {ok:false};}finally{clearTimeout(timer);imap.close();}
}
async function verifySmtp(c:Config){
 const transport=nodemailer.createTransport({host:c.smtpHost,port:c.smtpPort,secure:false,requireTLS:true,auth:{user:c.user,pass:c.pass},tls:{rejectUnauthorized:true,minVersion:"TLSv1.2"},connectionTimeout:10000,greetingTimeout:8000,socketTimeout:12000,logger:false,debug:false});
 let timer:ReturnType<typeof setTimeout>|undefined;
 try{const ok=await Promise.race([transport.verify(),new Promise<boolean>(resolve=>{timer=setTimeout(()=>resolve(false),24000)})]);return {ok:ok===true};}catch{return {ok:false};}finally{if(timer)clearTimeout(timer);transport.close();}
}
export async function POST(request:Request){
 if(!await getCrmUser())return json({error:"Entre com sua conta Google."},401);
 if(!validCrmOrigin(request))return json({error:"Origem inválida."},403);
 if(!request.headers.get("content-type")?.startsWith("application/json"))return json({error:"Formato inválido."},415);
 let account:unknown;
 try{const raw=await request.text();if(raw.length>128)throw Error();account=JSON.parse(raw).account;}catch{return json({error:"Solicitação inválida."},400);}
 if(!mailAccount(account))return json({error:"Conta inválida."},400);
 let c:Config;try{c=umblerConfig(account,process.env);}catch{return json({error:"Credenciais ou parâmetros Umbler não configurados neste ambiente."},503);}
 const [imap,smtp]=await Promise.all([verifyImap(c),verifySmtp(c)]);
 return json({account:MAIL_ACCOUNTS[account],imap,smtp,checkedAt:new Date().toISOString(),sent:false});
}
