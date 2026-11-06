'use client'
import {useEffect,useState} from 'react'
import TrackedLink from '../TrackedLink'
import styles from './page.module.css'

const group='https://chat.whatsapp.com/G22xoJnYVLRLQj3KjB6CTX?s=cl&p=a&iam=2'
const instagram='https://www.instagram.com/coletadealimentos/'
function status(){
 const current=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())
 if(current==='2026-11-06')return{label:'É AMANHÃ · SÁBADO, 07 NOV 2026',message:'A coleta acontece amanhã. Consulte no grupo os pontos e horários da região.'}
 if(current<'2026-11-07')return{label:'PRÓXIMO SÁBADO · 07 NOV 2026',message:'A coleta acontece em 7 de novembro de 2026. Participe da organização.'}
 if(current==='2026-11-07')return{label:'É HOJE · 07 NOV 2026',message:'Hoje é o Dia Nacional da Coleta! Consulte no grupo os pontos e horários da região.'}
 return{label:'EDIÇÃO 2026 · 07 NOV',message:'A edição de 2026 aconteceu em 7 de novembro. Acompanhe a organização para conhecer a próxima mobilização.'}
}
export default function ActionLinks({kind}:{kind:'hero'|'footer'}){
 const [dateState,setDateState]=useState<{label:string;message:string}|null>(null)
 useEffect(()=>{setDateState(status())},[])
 return <div className={styles.actions}>
  <p className={styles.eventStatus}><span aria-hidden="true">●</span> {dateState?.label||'SÁBADO · 07 NOV 2026'}</p>
  <p className={styles.dateHelp}>{dateState?.message||'Evento anual em 7 de novembro de 2026.'}</p>
  <div className={styles.actionButtons}>
   <TrackedLink href={group} linkId="coleta_grupo" position={kind==='hero'?1:3} className={styles.primary} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">✳</span> Entrar no grupo de voluntários <span aria-hidden="true">↗</span></TrackedLink>
   <TrackedLink href={instagram} linkId="coleta_instagram" position={kind==='hero'?2:4} className={styles.secondary} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">◎</span> Instagram oficial <span aria-hidden="true">↗</span></TrackedLink>
  </div>
 </div>
}
