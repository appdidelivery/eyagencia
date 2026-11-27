import {NextResponse} from "next/server";
import {randomUUID} from "node:crypto";
import {readSnapshot,writeSnapshot,CrmError} from "@/app/lib/crm-blob";
import type {Row} from "@/app/lib/crm-model";
import type {Brand} from "@/app/lib/prospecting";
import {sameBusiness,prospectDraft} from "@/app/lib/prospect-agent-model";
import {discover,verifyCandidate,auditCandidate} from "@/app/lib/prospect-agent-network";
import {RESEARCH_PATH,type ResearchLead} from "@/app/lib/sdr-qualification";
import {normalizeBusiness} from "@/app/lib/prospect-agent-model";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export const maxDuration=180;
const path="ey-crm/records-v1.json";
const json=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow"}});
function config(){
 const token=process.env.BLOB_READ_WRITE_TOKEN,storeId=token?.split("_")[3];
 if(!token||!storeId||!/^[A-Za-z0-9]+$/.test(storeId))throw Error("storage_unavailable");
 return {token,storeId};
}
type Config=ReturnType<typeof config>;
async function snapshot(cfg:Config){
 const main=await readSnapshot<Row>(path,cfg);if(!main)throw Error("crm_not_initialized");
 const archive=await readSnapshot<Row>("ey-crm/contract-import-v1.json",cfg);
 let legacy:Row[]=[];
 if(!archive&&process.env.EY_CRM_CONTRACT_IMPORT_V1){const x=JSON.parse(process.env.EY_CRM_CONTRACT_IMPORT_V1);if(!Array.isArray(x))throw Error("archive_invalid");legacy=x;}
 return {...main,all:[...main.rows,...(archive?.rows||legacy)]};
}
export async function GET(request:Request){
 if(!process.env.CRON_SECRET||request.headers.get("authorization")!=="Bearer "+process.env.CRON_SECRET)return json({error:"Unauthorized"},401);
 if(process.env.VERCEL_ENV!=="production")return json({skipped:"not_production"});
 if(process.env.EY_PROSPECT_AGENT_DISABLED==="1")return json({skipped:"disabled"});
 const key=process.env.EY_PAGESPEED_API_KEY;if(!key)return json({error:"pagespeed_key_missing"},503);
 const date=new Date().toISOString().slice(0,10);
 const lockPath="ey-crm/prospect-agent/runs/"+date+".json";
 try{
  const cfg=config(),initial=await snapshot(cfg);
  // Claim one run per UTC day. No retry after uncertain writes or a partial run.
  // Store no email bodies or credentials in the ledger.
  if(await readSnapshot(lockPath,cfg))return json({skipped:"already_claimed",date});
  try{await writeSnapshot([{date,state:"claimed"}],cfg,lockPath);}catch(e){if(e instanceof CrmError&&e.status===409)return json({skipped:"already_claimed",date});throw e;}
  const brands:Brand[]=["EYAGENCIA","VELO"];
  const results=await Promise.all(brands.map(async brand=>{
   let discovered=0,verified=0,audited=0;let research:ResearchLead[]=[];
   try{
    const all=await discover(brand);
    const eligible=all.sites.filter(c=>!sameBusiness(initial.all,c));
    const candidates=all.research.filter(c=>!sameBusiness(initial.all,{name:c.name,site:"",discovery:c.source,brand}));
    const startResearch=candidates.length?(Math.floor(Date.now()/86400000)*4)%candidates.length:0;
    research=[...candidates.slice(startResearch),...candidates.slice(0,startResearch)].slice(0,4);
    discovered=eligible.length;
    const day=Math.floor(Date.now()/86400000);
    const start=eligible.length?(day*4)%eligible.length:0;
    const batch=[...eligible.slice(start),...eligible.slice(0,start)].slice(0,4);
    // At most four official sites checked per brand, one PageSpeed call per brand.
    const contacts=await Promise.all(batch.map(verifyCandidate));
    for(let i=0;i<batch.length;i++){if(contacts[i]===null)research.push({name:batch[i].name,brand,source:batch[i].discovery,site:batch[i].site,reason:"Site listado; identidade ou e-mail funcional ainda não confirmado. Não autoriza abordagem.",score:45,observedAt:new Date().toISOString()});}
    const valid=contacts.filter(c=>c!==null&&!sameBusiness(initial.all,c,c.email));
    verified=valid.length;
    const c=valid[0];if(!c)return {brand,discovered,verified,audited,reason:"no_verified_contact",row:null,research};
    audited=1;let audit;try{audit=await auditCandidate(c,key);}catch(e){if(!c.presence?.length)throw e;audit={url:c.site,at:new Date().toISOString(),scores:{performance:null,seo:null,accessibility:null},findings:[]};}
    audit.findings=[...(c.presence||[]),...audit.findings];
    const row=prospectDraft(c,audit,new Date().toISOString(),randomUUID());
    return {brand,discovered,verified,audited,reason:row?"qualified":"no_actionable_findings",row,research};
   }catch(e){const reason=e instanceof Error&&["discovery_unavailable","discovery_size","pagespeed_quota","pagespeed_unavailable"].includes(e.message)?e.message:"source_or_audit_unavailable";return {brand,discovered,verified,audited,reason,row:null,research};}
  }));
  let added=0;const current=await snapshot(cfg),next=[...current.rows],dedup=[...current.all];const savedIds:string[]=[];
  for(const r of results){
   const row=r.row;if(!row)continue;
   if(sameBusiness(dedup,{name:row.title,site:row.url,brand:r.brand,discovery:""},row.email)){r.reason="duplicate_or_blocked";continue;}
   next.push(row);dedup.push(row);savedIds.push(row.id);
  }
  if(savedIds.length){
   await writeSnapshot(next,cfg,path,current.version);
   const stored=await readSnapshot<Row>(path,cfg);
   if(!stored||!savedIds.every(id=>stored.rows.some(r=>r.id===id&&r.status==="aprovado"&&r.createdBy==="agent:prospect")))throw Error("write_not_verified");
   added=savedIds.length;
  }
  const previous=await readSnapshot<ResearchLead>(RESEARCH_PATH,cfg);const queue=(previous?.rows||[]).filter(c=>!sameBusiness(dedup,{name:c.name,site:c.site,discovery:c.source,brand:c.brand}));
  const known=new Set(queue.map(c=>normalizeBusiness(c.name)));let researched=0;
  for(const c of results.flatMap(r=>r.research)){const k=normalizeBusiness(c.name);if(known.has(k)||sameBusiness(dedup,{name:c.name,site:c.site,discovery:c.source,brand:c.brand}))continue;known.add(k);queue.unshift(c);researched++;}
  if(researched||queue.length!==(previous?.rows.length||0)){await writeSnapshot(queue.slice(0,200),cfg,RESEARCH_PATH,previous?.version);const saved=await readSnapshot<ResearchLead>(RESEARCH_PATH,cfg);if(!saved||saved.rows.length!==Math.min(queue.length,200))throw Error("write_not_verified");}
  const summary={date,added,researched,results:results.map(({row,research,...rest})=>({...rest,research:research.length})),sent:0};
  const ledger=await readSnapshot(lockPath,cfg);if(ledger)await writeSnapshot([{...summary,state:"completed"}],cfg,lockPath,ledger.version);
  console.info("[prospect-agent]",summary);return json(summary);
 }catch(e){const code=e instanceof CrmError?"storage_conflict_or_unavailable":e instanceof Error&&["crm_not_initialized","archive_invalid","storage_unavailable","write_not_verified"].includes(e.message)?e.message:"run_failed";console.warn("[prospect-agent]",{date,code});return json({error:code,date,sent:0},503);}
}
