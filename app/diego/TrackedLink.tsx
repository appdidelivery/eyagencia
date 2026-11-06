'use client'
import type {ReactNode} from 'react'

type TrackedLinkProps={
 href:string;linkId:string;position:number;children:ReactNode;
 className?:string;target?:string;rel?:string
}
export default function TrackedLink({href,linkId,position,children,className,target,rel}:TrackedLinkProps){
 function recordClick(){
  const source=new URLSearchParams(window.location.search)
  const referrerHost=(()=>{try{return document.referrer?new URL(document.referrer).hostname:''}catch{return ''}})()
  const payload={kind:'bio',linkId,position,source:source.get('utm_source')||'',medium:source.get('utm_medium')||'',campaign:source.get('utm_campaign')||'',referrerHost}
  try{
   const w=window as Window&{dataLayer?:Array<Record<string,string|number>>}
   w.dataLayer ||= []
   w.dataLayer.push({event:'diego_bio_link_click',link_id:linkId,link_position:position,link_destination:href,utm_source:payload.source})
   const body=JSON.stringify(payload)
   if(navigator.sendBeacon){navigator.sendBeacon('/api/diego/click',new Blob([body],{type:'application/json'}))}
   else{void fetch('/api/diego/click',{method:'POST',headers:{'content-type':'application/json'},body,keepalive:true})}
  }catch{/* falha de medição não bloqueia o link */}
 }
 return <a href={href} className={className} target={target} rel={rel} onClick={recordClick}>{children}</a>
}
