import {NextResponse} from "next/server";
import {getCrmUser} from "@/app/lib/crm-google-session";
import {readSnapshot} from "@/app/lib/crm-blob";
import {RESEARCH_PATH,type ResearchLead} from "@/app/lib/sdr-qualification";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const json=(x:unknown,status=200)=>NextResponse.json(x,{status,headers:{"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow","X-Content-Type-Options":"nosniff"}});
export async function GET(){
 if(!await getCrmUser())return json({error:"Acesso restrito."},401);
 const token=process.env.BLOB_READ_WRITE_TOKEN,storeId=token?.split("_")[3];
 if(!token||!storeId||!/^[A-Za-z0-9]+$/.test(storeId))return json({error:"Armazenamento indisponível."},503);
 try{const stored=await readSnapshot<ResearchLead>(RESEARCH_PATH,{token,storeId});return json({rows:stored?.rows||[]});}catch{return json({error:"Pesquisa indisponível."},503);}
}
