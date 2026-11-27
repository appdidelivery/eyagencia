import type {Finding,Brand,Audit} from "./prospecting.ts";
export type ResearchLead={name:string;brand:Brand;source:string;site:string;reason:string;score:number;observedAt:string};
export const RESEARCH_PATH="ey-crm/prospect-agent/research-v1.json";
export function channelPolicy(){return {email:"bloqueado até autorização e base legal",whatsapp:"bloqueado até permissão e API oficial",instagram:"bloqueado até interação elegível",messenger:"bloqueado até interação elegível"} as const;}
export function leadScore(findings:Finding[],verified:boolean){
 if(!findings.length)return 0;
 const direct=findings.some(f=>["Cardápio em PDF","Canal de pedidos WhatsApp","Link de marketplace","Vitrine em marketplace"].includes(f.title));
 const need=direct?35:20;
 return Math.min(100,need+25+(findings.length>1?10:5)+15+(verified?10:0));
}
export function presenceFindings(html:string,site:string,brand:Brand,at:string):Finding[]{
 const clean=html.replace(/<!--[\s\S]*?-->/g,"").replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,"");
 const links:{url:URL;label:string}[]=[];
 for(const m of clean.matchAll(/<a\b[^>]*href\s*=\s*(["'])([^"'<>]+)\1[^>]*>([\s\S]*?)<\/a>/gi)){
  try{const url=new URL(m[2].replace(/&amp;/g,"&"),site);if(url.protocol!=="https:"||url.username||url.password)continue;links.push({url,label:m[3].replace(/<[^>]*>/g," ").trim()});}catch{}
 }
 const is=(u:URL,d:string)=>u.hostname===d||u.hostname.endsWith("."+d);
 const menu=/card[aá]pio|menu/i,order=/pedir|pedido|encomenda|comprar|order/i;
 const result:Finding[]=[];
 const add=(title:string,detail:string)=>result.push({title,detail,url:site,observedAt:at});
 if(brand==="VELO"){
  if(links.some(l=>/\.pdf$/i.test(l.url.pathname)&&menu.test(l.label+" "+l.url.pathname)))add("Cardápio em PDF","A página oficial consultada contém um link de cardápio em PDF. Avaliar uma versão interativa com pedidos integrados.");
  if(links.some(l=>(is(l.url,"wa.me")||is(l.url,"whatsapp.com"))&&order.test(l.label)))add("Canal de pedidos WhatsApp","A página oficial contém um link de pedido via WhatsApp. Avaliar a automação do fluxo; não foi verificado se há outros canais.");
  if(links.some(l=>is(l.url,"ifood.com.br")&&order.test(l.label)))add("Link de marketplace","A página oficial apresenta um link de pedido no iFood. Avaliar um canal próprio complementar, sem presumir dependência exclusiva.");
 }else if(links.some(l=>["mercadolivre.com.br","shopee.com.br","amazon.com.br"].some(d=>is(l.url,d))&&/comprar|loja|produto|oferta/i.test(l.label)))add("Vitrine em marketplace","A página oficial direciona compradores a um marketplace. Avaliar uma loja própria complementar, sem presumir que ela não exista.");
 return result;
}
export function noSiteResearch(data:unknown,brand:Brand,at:string):ResearchLead[]{
 const elements=(data as {elements?:unknown[]})?.elements;if(!Array.isArray(elements))return [];
 const result:ResearchLead[]=[];const seen=new Set<string>();
 for(const raw of elements.slice(0,150)){
  if(!raw||typeof raw!=="object")continue;
  const x=raw as {type?:unknown;id?:unknown;tags?:Record<string,unknown>};const t=x.tags||{};
  if(t.website||t["contact:website"]||!["node","way","relation"].includes(String(x.type))||typeof x.id!=="number"||!Number.isSafeInteger(x.id)||x.id<=0)continue;
  const name=typeof t.name==="string"?t.name.replace(/[\x00-\x1f\x7f]/g," ").trim():"";
  if(name.length<3||name.length>180)continue;
  const k=name.toLowerCase();if(seen.has(k))continue;seen.add(k);
  result.push({name,brand,source:"https://www.openstreetmap.org/"+x.type+"/"+x.id,site:"",reason:brand==="VELO"?"Cadastro público sem site informado; pesquisar cardápio e canal próprio de pedidos.":"Cadastro público sem site informado; pesquisar presença digital e eventual e-commerce.",score:45,observedAt:at});
 }
 return result;
}
