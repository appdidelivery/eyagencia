import {buildApproach,publicSite,prospectBlocked,type Audit,type Brand} from "./prospecting.ts";
import {blank,type Row} from "./crm-model.ts";
import {leadScore,channelPolicy} from "./sdr-qualification.ts";

export type Candidate={name:string;site:string;discovery:string;brand:Brand};
export type VerifiedCandidate=Candidate&{email:string;source:string;presence?:import("./prospecting.ts").Finding[]};
export function hostOf(value:string){try{return new URL(publicSite(value)).hostname.toLowerCase().replace(/^www\./,"");}catch{return "";}}
export function normalizeBusiness(value:string){return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();}
export function isPublicIPv4(ip:string){
 const p=ip.split(".").map(Number);if(p.length!==4||p.some(n=>!Number.isInteger(n)||n<0||n>255)||!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip))return false;
 const [a,b,c]=p;
 return !(a===0||a===10||a===127||a>=224||a===100&&b>=64&&b<=127||a===169&&b===254||a===172&&b>=16&&b<=31||a===192&&(b===0||b===168||b===88&&c===99)||a===198&&(b===18||b===19||b===51&&c===100)||a===203&&b===0&&c===113);
}
export function candidatesFromOsm(data:unknown,brand:Brand):Candidate[]{
 const elements=(data as {elements?:unknown[]})?.elements;if(!Array.isArray(elements))return [];
 const result:Candidate[]=[];const seen=new Set<string>();
 for(const item of elements.slice(0,100)){
  const x=item as {id?:unknown;type?:unknown;tags?:Record<string,unknown>};const t=x.tags||{};
  const name=typeof t.name==="string"?t.name.replace(/[\x00-\x1f\x7f]/g," ").trim():"";
  const raw=t.website||t["contact:website"];if(name.length<3||name.length>180||typeof raw!=="string"||!["node","way","relation"].includes(String(x.type))||typeof x.id!=="number"||!Number.isSafeInteger(x.id)||x.id<=0)continue;
  try{const site=publicSite(raw),host=hostOf(site);if(!host||site.length>150||seen.has(host)||["eyagencia.com.br","velodelivery.com.br","instagram.com","facebook.com","linktr.ee","wa.me","ifood.com.br","google.com","google.com.br"].some(d=>host===d||host.endsWith("."+d)))continue;
   seen.add(host);result.push({name,site,discovery:"https://www.openstreetmap.org/"+x.type+"/"+x.id,brand});}catch{}
 }
 return result;
}
const role=/^(contato|comercial|vendas|atendimento|reservas|pedidos|loja|marketing|info|contact|sales|hello|suporte)$/i;
export function officialEmails(html:string,site:string){
 const host=hostOf(site);if(!host)return [];
 // Only explicit mailto links on official HTML; do not infer an address.
 const clean=html.replace(/<!--[\s\S]*?-->/g,"").replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,"");
 const out=new Set<string>();
 for(const m of clean.matchAll(/href\s*=\s*(["'])mailto:([^"'?\s<>]+)(?:\?[^"']*)?\1/gi)){
  let e:string;try{e=decodeURIComponent(m[2]).toLowerCase();}catch{continue;}
  const parts=e.split("@");if(parts.length!==2||e.length>180||!role.test(parts[0])||parts[1]!==host)continue;
  out.add(e);
 }
 return [...out];
}
export function businessMentioned(html:string,name:string){
 const clean=html.replace(/<!--[\s\S]*?-->/g,"").replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,"").replace(/<[^>]*>/g," ").replace(/&(?:amp|nbsp|quot);/gi," ");
 const needle=normalizeBusiness(name);return needle.length>=3&&(" "+normalizeBusiness(clean)+" ").includes(" "+needle+" ");
}
export function sameBusiness(rows:Row[],c:Candidate,email=""){
 const host=hostOf(c.site),name=normalizeBusiness(c.name);
 return rows.some(r=>(r.kind==="client"||r.kind==="prospect")&&(
  normalizeBusiness(r.title)===name||Boolean(host&&(hostOf(r.url)===host||(r.email||"").toLowerCase().split("@")[1]===host))||Boolean(email&&(r.email||"").toLowerCase()===email.toLowerCase())
 ))||Boolean(email&&prospectBlocked(rows,email));
}
export function prospectDraft(c:VerifiedCandidate,audit:Audit,now:string,id:string):Row|null{
 if(!audit.findings.length||hostOf(audit.url)!==hostOf(c.site)||hostOf(c.source)!==hostOf(c.site)||c.source.length>150||!role.test(c.email.split("@")[0]||"")||c.email.split("@")[1]!==hostOf(c.site))return null;
 const score=leadScore(audit.findings,true);if(score<60)return null;
 const draft=buildApproach(c.brand,c.name,audit.findings.slice(0,3));
 const notes=["SDR · Lead Score "+score+"/100 · qualificação comercial automática (não autoriza envio)",draft.report,"Medição mobile: performance "+(audit.scores.performance??"n/d")+"; SEO "+(audit.scores.seo??"n/d")+"; acessibilidade "+(audit.scores.accessibility??"n/d"),"Descoberta: "+c.discovery+" · © contribuidores OpenStreetMap (https://www.openstreetmap.org/copyright)","Fonte pública do e-mail: "+c.source,"REMETENTE PLANEJADO (envio bloqueado): "+draft.sender,"ASSUNTO: "+draft.subject,draft.body,"FOLLOW-UP (rascunho; não programado): "+draft.followup,"Elegibilidade de canais: "+Object.entries(channelPolicy()).map(([k,v])=>k+": "+v).join("; ")].join("\n\n");
 if(notes.length>5000)return null;
 return {...blank("prospect"),id,title:c.name,company:c.brand,email:c.email,url:c.site,source:c.source,notes,priority:score>=80?"alta":"normal",owner:"SDR automático",status:"aprovado",nextAction:"Revisar pertinência, base legal, oposição e evidências antes de autorizar qualquer envio.",createdAt:now,updatedAt:now,createdBy:"agent:prospect",updatedBy:"agent:prospect"};
}
