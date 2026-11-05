'use client'
import {useEffect,useMemo,useState} from 'react'
import {curySeries,authorCatalog} from './authorCatalog'
import type {BookEntry} from './BookCatalog'
import styles from './books.module.css'

type Answer='read'|'unread'
const normal=(s:string)=>s.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
export default function AuthorLibrary({books}:{books:BookEntry[]}){
 const [active,setActive]=useState('cury')
 const [answers,setAnswers]=useState<Record<string,Answer>>({})
 const [ready,setReady]=useState(false)
 const [q,setQ]=useState('')
 const [copied,setCopied]=useState(false)
 const readTitles=useMemo(()=>new Set(books.map(b=>normal(b.title))),[books])
 useEffect(()=>{try{const raw=localStorage.getItem('diego-author-read-state-v1');if(raw){const parsed=JSON.parse(raw);if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))setAnswers(parsed)}}catch{}setReady(true)},[])
 useEffect(()=>{if(ready){try{localStorage.setItem('diego-author-read-state-v1',JSON.stringify(answers))}catch{}}},[answers,ready])
 const authors=authorCatalog
 const catalog=authors.find(a=>a.id===active)||authors[0]
 const items=useMemo(()=>{
  const titles=catalog.id==='cury'?[...curySeries,...catalog.titles]:catalog.titles
  return titles.map((title,i)=>{
   const key=catalog.id+':'+normal(title)
   const already=books.some(b=>normal(b.author).includes(normal(catalog.name))&&(normal(b.title)===normal(title)||normal(b.title).startsWith(normal(title)+'-')))
   return {key,title,series:catalog.id==='cury'&&i<curySeries.length,order:i+1,already}
  })
 },[catalog,books])
 const value=(x:{key:string;already:boolean})=>answers[x.key]||(x.already?'read':undefined)
 const yes=items.filter(x=>value(x)==='read')
 const no=items.filter(x=>value(x)==='unread')
 const pending=items.filter(x=>!value(x))
 const filtered=items.filter(x=>normal(x.title).includes(normal(q)))
 const choose=(key:string,answer:Answer)=>{setAnswers(prev=>({...prev,[key]:answer}));setCopied(false)}
 const copy=async()=>{
  const body=['Minha seleção de livros — '+catalog.name,'', 'JÁ LI:',...yes.map(x=>'- '+x.title),'','NÃO LI:',...no.map(x=>'- '+x.title),'','AINDA NÃO CONFIRMEI:',...pending.map(x=>'- '+x.title),'','Atualize minha biblioteca com estas escolhas.'].join('\n')
  try{await navigator.clipboard.writeText(body);setCopied(true)}catch{setCopied(false)}
 }
 const render=(x:typeof items[number])=><div className={styles.authorItem} key={x.key}>
   <div><strong>{x.series&&<span className={styles.authorVolume}>{x.order}</span>}{x.title}</strong><small>{x.already?'Já identificado nas minhas fotos':'Leitura a confirmar'}</small></div>
   <div className={styles.authorCheck} role="group" aria-label={'Estado da leitura: '+x.title}>
     <button type="button" aria-pressed={value(x)==='read'} className={value(x)==='read'?styles.authorYes:''} onClick={()=>choose(x.key,'read')}>✓ Já li</button>
     <button type="button" aria-pressed={value(x)==='unread'} className={value(x)==='unread'?styles.authorNo:''} onClick={()=>choose(x.key,'unread')}>Não li</button>
   </div>
 </div>
 return <section className={styles.authorLibrary} id="colecoes">
  <p className={styles.eyebrow}>MINHAS COLEÇÕES · CONTROLE DE LEITURAS</p>
  <h2>Augusto Cury e Paulo Vieira</h2>
  <p className={styles.authorIntro}>Organizo aqui títulos de autores que acompanho. Os livros já registrados na estante aparecem marcados como lidos; os demais ficam para minha confirmação. As coleções não entram na contagem da biblioteca sem leitura confirmada.</p>
  <div className={styles.authorTabRow} role="tablist" aria-label="Escolher autor">
   {authors.map(a=><button type="button" key={a.id} role="tab" aria-selected={active===a.id} onClick={()=>{setActive(a.id);setQ('');setCopied(false)}}>{a.name}</button>)}
  </div>
  <div className={styles.authorStats}><span><b>{yes.length}</b> já li</span><span><b>{no.length}</b> não li</span><span><b>{pending.length}</b> a conferir</span></div>
  <div className={styles.authorProgress} aria-label={yes.length+' leituras confirmadas de '+items.length}><div style={{width:items.length?yes.length*100/items.length+'%':'0%'}}/></div>
  <p className={styles.authorNote}>{catalog.id==='cury'?'A série Análise da Inteligência de Cristo contém 5 volumes na sequência oficial.':'Lista de títulos de Paulo Vieira (autor de O Poder da Ação), com referências bibliográficas verificadas.'}</p>
  {catalog.id==='cury'&&<p className={styles.authorCollectionOffer}>
    <span><strong>Box Análise da Inteligência de Cristo</strong><small>Conjunto dos cinco volumes · compra independente da confirmação da leitura</small></span>
    <a href="https://meli.la/1BW8wRa" target="_blank" rel="sponsored nofollow noopener noreferrer" onClick={()=>{const w=window as Window&{dataLayer?:Array<Record<string,string>>};w.dataLayer||=[];w.dataLayer.push({event:'diego_book_affiliate_click',book_id:'box-analise-inteligencia-de-cristo',partner:'mercado_livre'})}}>Ver box no Mercado Livre ↗</a>
   </p>}
  <input className={styles.authorSearch} aria-label={'Buscar títulos de '+catalog.name} type="search" placeholder="Buscar livro pelo título..." value={q} onChange={e=>setQ(e.target.value)}/>
  {catalog.id==='cury'&&<><h3 className={styles.authorGroupLabel}>Análise da Inteligência de Cristo · 5 volumes</h3><div className={styles.authorGrid}>{filtered.filter(x=>x.series).map(render)}</div><h3 className={styles.authorGroupLabel}>Outros títulos para conferir</h3></>}
  <div className={styles.authorGrid}>{filtered.filter(x=>!x.series).map(render)}</div>
  {filtered.length===0&&<p className={styles.authorNote}>Nenhum livro encontrado com essa busca.</p>}
  <div className={styles.authorSelect}>
   <strong>{yes.length} livros marcados como lidos nesta lista</strong>
   <p>As escolhas são salvas apenas neste dispositivo, sem criar resenhas ou alterar o catálogo automaticamente. Para atualizar a biblioteca pública, copie sua seleção e envie na conversa.</p>
   <button type="button" onClick={copy}>{copied?'✓ Lista copiada':'Copiar minha seleção'}</button>
   <a href={catalog.publisher} target="_blank" rel="noopener noreferrer">Ver fonte bibliográfica ↗</a>
  </div>
 </section>
}
