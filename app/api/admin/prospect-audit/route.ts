import {NextResponse} from "next/server";
import {getCrmUser,validCrmOrigin} from "@/app/lib/crm-google-session";
import {publicSite,interpretAudit} from "@/app/lib/prospecting";
export const dynamic="force-dynamic";
export const runtime="nodejs";
export const maxDuration=60;
const headers={"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow"};
const json=(data:unknown,status=200)=>NextResponse.json(data,{status,headers});
export async function POST(request:Request){
 if(!await getCrmUser())return json({error:"Acesso restrito."},401);
 if(!validCrmOrigin(request))return json({error:"Origem inválida."},403);
 if(!request.headers.get("content-type")?.startsWith("application/json"))return json({error:"Formato inválido."},415);
 let url:string;
 try{const raw=await request.text();if(raw.length>1500)throw Error();const body=JSON.parse(raw);url=publicSite(body.url);}catch{return json({error:"Informe uma página HTTPS pública, sem parâmetros."},400);}
 const params=new URLSearchParams({url,strategy:"mobile"});for(const category of ["performance","seo","accessibility"])params.append("category",category);
 const key=process.env.EY_PAGESPEED_API_KEY;if(key)params.set("key",key);
 try{
  const r=await fetch("https://www.googleapis.com/pagespeedonline/v5/runPagespeed?"+params,{cache:"no-store",redirect:"error",signal:AbortSignal.timeout(50000)});
  if(!r.ok)return json({error:r.status===429?"Limite do PageSpeed atingido. Configure uma chave dedicada ou tente novamente mais tarde.":"PageSpeed indisponível para esta página. Nenhum resultado foi inventado."},503);
  return json(interpretAudit(await r.json(),url,new Date().toISOString()));
 }catch{return json({error:"Não foi possível confirmar a auditoria. Registre apenas evidências verificadas manualmente."},503);}
}
