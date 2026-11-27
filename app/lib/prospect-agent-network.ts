import {request} from "node:https";
import {Resolver} from "node:dns/promises";
import {checkServerIdentity} from "node:tls";
import {publicSite,interpretAudit,type Brand} from "./prospecting";
import {isPublicIPv4,hostOf,candidatesFromOsm,officialEmails,businessMentioned,type Candidate,type VerifiedCandidate} from "./prospect-agent-model";

import {noSiteResearch,presenceFindings} from "./sdr-qualification";
const USER_AGENT="EYAGENCIA-ProspectAgent/1.0 (+https://eyagencia.com.br/)";
const MAX_HTML=512*1024;
const bbox="-27.80,-48.80,-27.35,-48.35";
export async function discover(brand:Brand){
 const selector=brand==="VELO"?'["amenity"~"^(restaurant|fast_food|cafe)$"]':'["shop"~"^(clothes|furniture|beauty|hairdresser|bakery|gift|optician|florist|sports)$"]';
 const query='[out:json][timeout:15];nwr'+selector+'["name"][~"^(website|contact:website)$"~"^https://"]('+bbox+');out tags 60;nwr'+selector+'["name"][!website][!"contact:website"]('+bbox+');out tags 60;';
 const res=await fetch("https://overpass-api.de/api/interpreter?"+new URLSearchParams({data:query}),{headers:{"User-Agent":USER_AGENT},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(18000)});
 if(!res.ok)throw Error("discovery_unavailable");
 const raw=await res.text();if(raw.length>2_000_000)throw Error("discovery_size");
 const data=JSON.parse(raw);return {sites:candidatesFromOsm(data,brand),research:noSiteResearch(data,brand,new Date().toISOString())};
}
// Resolve and pin a public IPv4 address, keep TLS hostname verification.
// Never follow redirects, attach cookies, forward credentials or fetch images.
async function fetchPage(value:string){
 const url=new URL(publicSite(value));const resolver=new Resolver({timeout:2500,tries:1});
 const addresses=await resolver.resolve4(url.hostname);
 if(!addresses.length||addresses.some(a=>!isPublicIPv4(a)))throw Error("unsafe_dns");
 return new Promise<{status:number;body:string;type:string}>((resolve,reject)=>{
  const req=request({hostname:addresses[0],port:443,servername:url.hostname,method:"GET",path:url.pathname,headers:{Host:url.hostname,"User-Agent":USER_AGENT,Accept:"text/html,text/plain","Accept-Encoding":"identity"},agent:false,rejectUnauthorized:true,checkServerIdentity:(_host,cert)=>checkServerIdentity(url.hostname,cert)},res=>{
   const status=res.statusCode||0;const type=String(res.headers["content-type"]||"");const chunks:Buffer[]=[];let size=0;
   if(status!==200){res.destroy();resolve({status,body:"",type});return;}
   if(!/^(text\/html|text\/plain|application\/xhtml\+xml)(?:;|$)/i.test(type)||res.headers["content-encoding"]&&res.headers["content-encoding"]!=="identity"){res.destroy();reject(Error("unsupported_content"));return;}
   res.on("data",(chunk:Buffer)=>{size+=chunk.length;if(size>MAX_HTML){req.destroy(Error("page_size"));return;}chunks.push(chunk);});
   res.on("error",reject);
   res.on("end",()=>resolve({status,body:Buffer.concat(chunks).toString("utf8"),type}));
  });
  const timer=setTimeout(()=>req.destroy(Error("page_timeout")),6500);req.on("close",()=>clearTimeout(timer));req.on("error",reject);req.end();
 });
}
function robotsAllows(robots:string,path:string){
 // Deliberately conservative: respect any matching Disallow, even for other groups.
 // Wildcards/regex-like paths are skipped rather than interpreted permissively.
 for(const line of robots.split(/\r?\n/)){
  const m=line.split("#")[0].match(/^\s*disallow\s*:\s*(\S+)/i);if(!m)continue;
  if(m[1].includes("*")||m[1].includes("$")||path.startsWith(m[1]))return false;
 }
 return true;
}
function contactLinks(html:string,site:string){
 const origin=new URL(site).origin;const links=new Set<string>();
 for(const m of html.matchAll(/href\s*=\s*(["'])([^"'<>]+)\1/gi)){
  try{const url=new URL(m[2],site);if(url.origin!==origin||!/(?:^|\/)(?:contato|contact|fale-conosco|atendimento|sobre|quem-somos)(?:\/|\.html?$|$)/i.test(url.pathname))continue;
   url.hash="";url.search="";const value=publicSite(url.href);if(value.length<=150&&value!==site)links.add(value);
  }catch{}
 }
 return [...links].slice(0,1);
}
export async function verifyCandidate(c:Candidate):Promise<VerifiedCandidate|null>{
 try{
  const u=new URL(c.site);
  const robots=await fetchPage(u.origin+"/robots.txt");
  if(robots.status!==200&&robots.status!==404&&robots.status!==410)return null;
  if(!robotsAllows(robots.body,u.pathname))return null;
  const page=await fetchPage(c.site);
  if(page.status!==200||!businessMentioned(page.body,c.name))return null;
  const presence=presenceFindings(page.body,c.site,c.brand,new Date().toISOString());
  const first=officialEmails(page.body,c.site)[0];
  if(first)return {...c,email:first,source:c.site,presence};
  for(const source of contactLinks(page.body,c.site)){
   if(!robotsAllows(robots.body,new URL(source).pathname)||hostOf(source)!==hostOf(c.site))continue;
   const contact=await fetchPage(source);
   if(contact.status!==200)continue;
   const email=officialEmails(contact.body,c.site)[0];
   if(email)return {...c,email,source,presence};
  }
 }catch{}
 return null;
}
export async function auditCandidate(c:VerifiedCandidate,key:string){
 const params=new URLSearchParams({url:publicSite(c.site),strategy:"mobile",key});
 for(const category of ["performance","seo","accessibility"])params.append("category",category);
 const r=await fetch("https://www.googleapis.com/pagespeedonline/v5/runPagespeed?"+params,{cache:"no-store",redirect:"error",signal:AbortSignal.timeout(50000)});
 if(!r.ok)throw Error(r.status===429?"pagespeed_quota":"pagespeed_unavailable");
 const data=await r.json();const final=data?.lighthouseResult?.finalDisplayedUrl||data?.lighthouseResult?.finalUrl;
 if(typeof final!=="string"||hostOf(final)!==hostOf(c.site))throw Error("pagespeed_unavailable");
 return interpretAudit(data,c.site,new Date().toISOString());
}
