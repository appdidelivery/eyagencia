'use client'
import {useEffect,useState} from 'react'
import {useClient} from 'sanity'
import {photographedBooks} from '../../app/diego/livros/seedBooks'

type Existing={_id:string;slug?:string}
const styles={
 panel:{maxWidth:820,margin:'32px auto',padding:28,borderRadius:18,background:'#163927',color:'#edfff2',fontFamily:'system-ui',lineHeight:1.65} as const,
 btn:{background:'#91edb2',color:'#10381f',border:'1px solid #baffd4',borderBottom:'4px solid #348653',borderRadius:13,minHeight:50,padding:'12px 22px',fontWeight:800,cursor:'pointer'} as const
}
export default function BookImportTool(){
 const client=useClient({apiVersion:'2026-07-01'})
 const [count,setCount]=useState<number|null>(null)
 const [busy,setBusy]=useState(false)
 const [status,setStatus]=useState('Conferindo documentos no Sanity...')
 useEffect(()=>{
  let active=true
  client.fetch<number>('count(*[_type=="diegoBook"])')
   .then(n=>{if(active){setCount(n);setStatus('Pronto para sincronizar.')}})
   .catch(e=>{if(active)setStatus('Erro ao consultar o CMS: '+String(e?.message||e))})
  return ()=>{active=false}
 },[client])
 const importBooks=async()=>{
  if(busy)return
  setBusy(true)
  try{
   setStatus('Consultando a biblioteca existente...')
   const existing=await client.fetch<Existing[]>('*[_type=="diegoBook"]{"_id":_id,"slug":slug.current}')
   const known=new Set(existing.map(x=>x.slug).filter(Boolean))
   const pending=photographedBooks.filter(b=>b.slug&&!known.has(b.slug))
   if(!pending.length){setCount(existing.length);setStatus('Todos os livros estão cadastrados; nenhuma duplicação criada.');return}
   for(let i=0;i<pending.length;i+=8){
    const batch=pending.slice(i,i+8)
    let tx=client.transaction()
    for(const b of batch){
     const slug=String(b.slug)
     tx=tx.createIfNotExists({
      _id:'diego-book-'+slug,_type:'diegoBook',
      title:b.title,slug:{_type:'slug',current:slug},author:b.author,
      about:b.about,review:b.review,
      ...(b.lessons?{lessons:b.lessons}:{}),
      ...(b.recommendFor?{recommendFor:b.recommendFor}:{}),
      ...(b.category?{category:b.category}:{}),
      ...(b.imageUrl?.startsWith('https://')?{coverUrl:b.imageUrl}:{}),
      ...(b.rating?{rating:b.rating}:{}),
      ...(b.readYear?{readYear:b.readYear}:{}),
      ...(b.affiliateUrl?{affiliateUrl:b.affiliateUrl}:{}),
      sortOrder:b.seedOrder||i+1,readConfirmed:true,published:true
     })
    }
    await tx.commit({visibility:'sync'})
    setStatus('Importados '+Math.min(i+8,pending.length)+' de '+pending.length+' registros.')
   }
   const n=await client.fetch<number>('count(*[_type=="diegoBook"])')
   setCount(n)
   setStatus('Importação concluída. Abra Structure → Diego Lemes · Livros que li para inserir seus links do Mercado Livre.')
  }catch(e){
   setStatus('Falha: '+String((e as Error)?.message||e)+'. Você pode repetir a importação sem duplicar registros.')
  }finally{setBusy(false)}
 }
 return <main style={{background:'#091e13',minHeight:'100%',padding:16}}>
  <section style={styles.panel}>
   <small style={{color:'#90f3b4',letterSpacing:2,fontWeight:800}}>DIEGO LEMES · MEU CATÁLOGO</small>
   <h1 style={{fontSize:32,margin:'14px 0'}}>Sincronizar livros com o CMS</h1>
   <p>A biblioteca pública possui <strong>{photographedBooks.length} livros</strong>, mas seus registros originais ainda precisam ser importados para edição no Sanity.</p>
   <p><strong>Documentos no CMS: {count===null?'verificando…':count}</strong></p>
   <button type="button" disabled={busy} style={styles.btn} onClick={importBooks}>{busy?'Sincronizando…':'Importar livros sem duplicações'}</button>
   <p role="status" aria-live="polite" style={{marginTop:20,color:'#d1f6dc'}}>{status}</p>
   <p style={{fontSize:13,color:'#c3dccc'}}>O processo preserva títulos, resenhas, capas e registros já existentes. Não substitui edições feitas no CMS.</p>
   <hr style={{borderColor:'#447657',margin:'26px 0'}}/>
   <h2 style={{fontSize:20}}>Cadastrar seus links de afiliado</h2>
   <ol style={{fontSize:14,paddingLeft:24}}>
    <li>Após a importação, abra a aba <strong>Structure</strong>.</li>
    <li>Selecione <strong>Diego Lemes · Livros que li</strong> e escolha um título.</li>
    <li>Preencha <strong>Link afiliado Mercado Livre</strong> com a URL do ML.</li>
    <li>Clique em <strong>Publish / Publicar</strong> para disponibilizar o botão de compra.</li>
   </ol>
   <a href="/diego/livros" target="_blank" rel="noopener noreferrer" style={{color:'#95f4b7'}}>Conferir biblioteca pública ↗</a>
  </section>
 </main>
}
