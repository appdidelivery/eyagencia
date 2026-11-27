export const MAIL_PAGE_SIZE=20;
export const MAIL_BODY_LIMIT=256*1024;
export function mailReadRequest(value:unknown){
 if(!value||typeof value!=="object")return null;
 const v=value as Record<string,unknown>;
 if(v.account!=="contato"&&v.account!=="financeiro")return null;
 const account=v.account;
 if(v.action==="list"&&typeof v.page==="number"&&Number.isInteger(v.page)&&v.page>=0&&v.page<=5000)return {account,action:"list" as const,page:v.page};
 if(v.action==="read"&&typeof v.uid==="number"&&Number.isInteger(v.uid)&&v.uid>0&&v.uid<=4294967295&&typeof v.uidValidity==="string"&&/^\d{1,20}$/.test(v.uidValidity))return {account,action:"read" as const,uid:v.uid,uidValidity:v.uidValidity};
 return null;
}
export function mailSequenceRange(total:number,page:number){
 const end=total-page*MAIL_PAGE_SIZE;
 return end>0?Math.max(1,end-MAIL_PAGE_SIZE+1)+":"+end:null;
}
type Part={type?:string;part?:string;disposition?:string;childNodes?:Part[];size?:number};
export function mailTextPart(root?:Part){
 const parts:{part:string;kind:"plain"|"html";size?:number}[]=[];
 function visit(node:Part,top=false){
  const type=node.type?.toLowerCase();
  if(node.disposition?.toLowerCase()==="attachment"||type==="message/rfc822")return;
  if(type==="text/plain"||type==="text/html")parts.push({part:node.part||(top?"1":""),kind:type==="text/plain"?"plain":"html",size:node.size});
  for(const child of node.childNodes||[])visit(child);
 }
 if(root)visit(root,true);
 return parts.find(p=>p.part&&p.kind==="plain")||parts.find(p=>p.part&&p.kind==="html")||null;
}
// Approximate text extraction only; never render the source as HTML or fetch resources.
export function mailHtmlText(html:string){
 return html.replace(/<!--[\s\S]*?-->/g,"").replace(/<(script|style|head|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,"").replace(/<(?:br\b[^>]*|\/(?:p|div|tr|li|h[1-6])\s*)>/gi,"\n").replace(/<[^>]*>/g,"").replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,(_,entity:string)=>{
 const e=entity.toLowerCase();
 if(e[0]==="#"){const n=e[1]==="x"?parseInt(e.slice(2),16):parseInt(e.slice(1),10);return n>0&&n<=0x10ffff&&!(n>=0xd800&&n<=0xdfff)?String.fromCodePoint(n):"�";}
 return ({amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "} as Record<string,string>)[e]||"";
 }).replace(/[ \t]+\n/g,"\n").replace(/\n{3,}/g,"\n\n").trim();
}
