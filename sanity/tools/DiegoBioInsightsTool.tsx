'use client'
import {useEffect,useMemo,useState} from 'react'
import {useClient} from 'sanity'
type Row={kind?:string;linkId?:string;partner?:string;source?:string;medium?:string;referrerHost?:string;clickedAt?:string}
const labels:Record<string,string>={
 eyagencia:'EyAgencia',velo_delivery:'Velo Delivery',livros:'Livros que eu li',playlist:'YouTube Music',
 coleta_projeto:'Dia Nacional da Coleta · projeto',coleta_voluntarios:'Coleta · grupo voluntários',coleta_grupo:'Coleta · grupo (landing)',coleta_instagram:'Coleta · Instagram oficial',academia_ia:'Academia IA na Prática',
 projetos:'Projetos e cases',trajetoria:'Minha trajetória',ia_ecommerce:'IA aplicada',artigos:'Artigos',
 contato:'Contato profissional',instagram:'Instagram'
}
export default function DiegoBioInsightsTool(){
 const client=useClient({apiVersion:'2026-07-01'})
 const [range,setRange]=useState(30)
 const [items,setItems]=useState<Row[]>([])
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState('')
 const [refresh,setRefresh]=useState(0)
 useEffect(()=>{
  let active=true;setLoading(true);setError('')
  const since=new Date(Date.now()-range*86400000).toISOString()
  client.fetch<Row[]>('*[_type=="diegoBioClick" && clickedAt >= $since] | order(clickedAt desc)[0...10000]{kind,linkId,partner,source,medium,referrerHost,clickedAt}',{since})
   .then(rows=>{if(active){setItems(rows);setLoading(false)}})
   .catch(e=>{if(active){setError(e instanceof Error?e.message:'Falha ao consultar cliques');setLoading(false)}})
  return ()=>{active=false}
 },[client,range,refresh])
 const bio=useMemo(()=>items.filter(r=>r.kind==='bio'),[items])
 const affiliate=useMemo(()=>items.filter(r=>r.kind==='affiliate'),[items])
 const aggregate=(rows:Row[],key:(r:Row)=>string)=>{
  const counts=new Map<string,number>()
  for(const r of rows){const k=key(r)||'Direto / não informado';counts.set(k,(counts.get(k)||0)+1)}
  return [...counts].sort((a,b)=>b[1]-a[1])
 }
 const byLink=aggregate(bio,r=>labels[r.linkId||'']||r.linkId||'Não identificado')
 const byBook=aggregate(affiliate,r=>(r.linkId||'Livro')+' · '+(r.partner||'mercado_livre'))
 const bySource=aggregate(items,r=>r.source||r.referrerHost||'Direto / não informado')
 const table=(rows:[string,number][],empty:string)=><div style={{overflowX:'auto'}}><table style={{borderCollapse:'collapse',width:'100%',fontSize:14}}><thead><tr><th style={{padding:'11px',textAlign:'left'}}>Destino</th><th style={{padding:'11px',textAlign:'right'}}>Cliques</th></tr></thead><tbody>{rows.length?rows.map(([label,n])=><tr key={label} style={{borderTop:'1px solid #ddd'}}><td style={{padding:11}}>{label}</td><td style={{padding:11,textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{n}</td></tr>):<tr><td colSpan={2} style={{padding:12}}>{empty}</td></tr>}</tbody></table></div>
 return <main style={{padding:24,maxWidth:940,margin:'0 auto',fontFamily:'system-ui, sans-serif'}}>
  <h1 style={{fontSize:26,marginBottom:6}}>Bio do Diego · Métricas de cliques</h1>
  <p style={{color:'#777',fontSize:13}}>Dados de cliques coletados a partir da implantação. Não são vendas confirmadas nem visitantes únicos.</p>
  <div style={{display:'flex',gap:10,alignItems:'center',margin:'18px 0',flexWrap:'wrap'}}><label>Período <select value={range} onChange={e=>setRange(Number(e.target.value))}><option value={7}>Últimos 7 dias</option><option value={30}>Últimos 30 dias</option><option value={90}>Últimos 90 dias</option></select></label><button onClick={()=>setRefresh(v=>v+1)} style={{padding:'8px 16px',border:'1px solid #aaa',borderRadius:8,cursor:'pointer'}}>Atualizar</button></div>
  {loading?<p>Consultando dados...</p>:error?<p role="alert" style={{color:'#a32'}}>Não foi possível carregar os dados: {error}</p>:<>
   <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:12,marginBottom:25}}>{[['Cliques na bio',bio.length],['Cliques para compra',affiliate.length],['Total de ações',items.length]].map(([title,value])=><div key={String(title)} style={{padding:16,border:'1px solid #ddd',borderRadius:12}}><strong style={{display:'block',fontSize:28}}>{value}</strong><small>{title}</small></div>)}</div>
   <h2>Onde clicaram na bio</h2>{table(byLink,'Nenhum clique registrado ainda neste período.')}
   <h2 style={{marginTop:25}}>Cliques nos botões de compra dos livros</h2>{table(byBook,'Ainda não há cliques de compra registrados.')}
   <h2 style={{marginTop:25}}>Origem do tráfego (quando disponível)</h2>{table(bySource,'Aguardando cliques com origem identificável.')}
   <p style={{marginTop:30,fontSize:13,color:'#777'}}>Esta tabela registra saídas para parceiros, não pedidos nem faturamento. Vendas e comissões efetivas devem ser conciliadas com os relatórios dos programas de afiliados Mercado Livre, Amazon e Shopee. Dados anteriores ao início da coleta não podem ser recuperados por esta ferramenta.</p>
  </>}
 </main>
}
