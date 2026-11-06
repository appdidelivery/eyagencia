'use client'
import {useEffect,useMemo,useState} from 'react'
import {useClient} from 'sanity'
type Row={_id:string;courseId:string;courseTitle:string;contactAlias:string;registeredAt:string;marketingOptIn:boolean;notificationStatus:string}
const courseLabels:Record<string,string>={fundamentos:'IA do zero',negocios:'IA para negócios',renda:'IA para gerar renda'}
export default function AcademiaInsightsTool(){
 const client=useClient({apiVersion:'2026-07-01'})
 const [rows,setRows]=useState<Row[]>([])
 const [range,setRange]=useState(30)
 const [refresh,setRefresh]=useState(0)
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState('')
 useEffect(()=>{
  let alive=true;setLoading(true);setError('')
  const since=new Date(Date.now()-range*86400000).toISOString()
  client.fetch<Row[]>('*[_type=="academyCompletion" && registeredAt >= $since] | order(registeredAt desc)[0...5000]{_id,courseId,courseTitle,contactAlias,registeredAt,marketingOptIn,notificationStatus}',{since})
   .then(items=>{if(alive){setRows(items);setLoading(false)}})
   .catch(e=>{if(alive){setError(e instanceof Error?e.message:'Erro ao consultar conclusões');setLoading(false)}})
  return()=>{alive=false}
 },[client,range,refresh])
 const totals=useMemo(()=>Object.keys(courseLabels).map(id=>({id,title:courseLabels[id],count:rows.filter(r=>r.courseId===id).length})),[rows])
 const awaiting=rows.filter(r=>r.notificationStatus!=='recebida_confirmada').length
 return <main style={{padding:24,maxWidth:1120,margin:'0 auto',fontFamily:'system-ui,sans-serif'}}>
  <h1 style={{fontSize:27,marginBottom:8}}>Academia · Alunos e conclusões</h1>
  <p style={{color:'#777',fontSize:13,lineHeight:1.6}}>Registros autodeclarados das cinco missões de cada trilha. O nome completo e o telefone ficam criptografados. A identificação integral chega à agência somente quando o aluno confirma o envio da mensagem pelo WhatsApp.</p>
  <div style={{display:'flex',gap:12,alignItems:'center',margin:'18px 0',flexWrap:'wrap'}}>
   <label>Período: <select value={range} onChange={e=>setRange(Number(e.target.value))}><option value={7}>7 dias</option><option value={30}>30 dias</option><option value={90}>90 dias</option><option value={365}>1 ano</option></select></label>
   <button onClick={()=>setRefresh(n=>n+1)} style={{border:'1px solid #aaa',background:'transparent',borderRadius:8,padding:'8px 13px'}}>Atualizar</button>
  </div>
  {loading?<p>Carregando...</p>:error?<p role="alert" style={{color:'#a00'}}>{error}</p>:<>
   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:24}}>
    {[
     {n:rows.length,t:'Conclusões registradas'},
     {n:awaiting,t:'Avisos aguardando conferência'},
     ...totals.map(x=>({n:x.count,t:x.title}))
    ].map(x=><div key={x.t} style={{border:'1px solid #ddd',borderRadius:12,padding:18}}><strong style={{display:'block',fontSize:28}}>{x.n}</strong><small>{x.t}</small></div>)}
   </div>
   <h2 style={{fontSize:21}}>Registros recentes</h2>
   <div style={{overflowX:'auto'}}><table style={{borderCollapse:'collapse',width:'100%',fontSize:13}}>
    <thead><tr>{['Data','Curso','Identificação parcial','WhatsApp','Marketing'].map(t=><th key={t} style={{textAlign:'left',padding:12,borderBottom:'1px solid #ddd'}}>{t}</th>)}</tr></thead>
    <tbody>{rows.length?rows.map(r=><tr key={r._id} style={{borderBottom:'1px solid #e7e7e7'}}>
     <td style={{padding:12,whiteSpace:'nowrap'}}>{new Date(r.registeredAt).toLocaleString('pt-BR')}</td>
     <td style={{padding:12}}>{r.courseTitle}</td>
     <td style={{padding:12}}>{r.contactAlias}</td>
     <td style={{padding:12}}>{r.notificationStatus==='recebida_confirmada'?'Conferido':'Aguardando envio do aluno'}</td>
     <td style={{padding:12}}>{r.marketingOptIn?'Autorizado':'Não autorizado'}</td>
    </tr>):<tr><td colSpan={5} style={{padding:14}}>Nenhum registro neste período.</td></tr>}</tbody>
   </table></div>
   <p style={{fontSize:12,color:'#777',marginTop:22,lineHeight:1.7}}>A plataforma não certifica a autoria das entregas e não sabe se o botão do WhatsApp foi efetivamente enviado. Abra o registro na lista “Academia · Conclusões” para marcar “Mensagem recebida / conferida” depois de verificar o WhatsApp da agência. Sem aceite de marketing, não use os contatos para campanhas.</p>
  </>}
 </main>
}
