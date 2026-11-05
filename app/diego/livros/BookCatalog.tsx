'use client'
import {useMemo,useState} from 'react'
import styles from './books.module.css'
import AuthorLibrary from './AuthorLibrary'

export type BookEntry={id:string;slug?:string|null;title:string;author:string;category?:string|null;about:string;review:string;lessons?:string|null;recommendFor?:string|null;rating?:number|null;readYear?:number|null;affiliateUrl?:string|null;imageUrl?:string|null;imageAlt?:string|null;reviewDraft?:boolean;seedOrder?:number}
const highlight='https://www.instagram.com/stories/highlights/17898572725107429/'
const validBuy=(raw?:string|null)=>{
 if(!raw)return null
 try{const u=new URL(raw),h=u.hostname.toLowerCase()
  return u.protocol==='https:'&&['mercadolivre.com.br','mercadolivre.com','mercado.li','meli.la'].some(d=>h===d||h.endsWith('.'+d))?u.href:null
 }catch{return null}
}
function Book({book}:{book:BookEntry}){
 const [expanded,setExpanded]=useState(false)
 const [imageFailed,setImageFailed]=useState(false)
 const buy=validBuy(book.affiliateUrl)
 const rating=book.rating&&Number.isInteger(book.rating)&&book.rating>0&&book.rating<=5?book.rating:0
 const track=()=>{const w=window as Window&{dataLayer?:Array<Record<string,string>>};w.dataLayer ||= [];w.dataLayer.push({event:'diego_book_affiliate_click',book_id:book.slug||book.id,partner:'mercado_livre'})}
 return <article className={styles.book} id={book.slug||book.id}>
  <div className={styles.bookTop}>
   <div className={styles.cover}>{book.imageUrl&&!imageFailed?<img src={book.imageUrl} alt={book.imageAlt||'Capa de '+book.title} loading="lazy" decoding="async" onError={()=>setImageFailed(true)}/>:<div className={styles.typographicCover}><small>{book.author}</small><strong>{book.title}</strong><span aria-hidden="true">▤</span></div>}</div>
   <div className={styles.info}>
    <small>{book.category||'Outras leituras'}</small>
    <h3>{book.title}</h3>
    <p>{book.author}{book.readYear?' · Leitura de '+book.readYear:''}</p>
    {rating>0&&<p className={styles.stars} aria-label={'Minha avaliação: '+rating+' de 5'}>{'★'.repeat(rating)}{'☆'.repeat(5-rating)} <small>{rating}/5</small></p>}
    <p className={styles.preview}>{book.about}</p>
   </div>
  </div>
  <div className={styles.actions}>
   <button type="button" aria-expanded={expanded} aria-controls={'review-'+book.id} onClick={()=>setExpanded(v=>!v)}>{expanded?'Fechar resenha −':'Ler minha resenha +'}</button>
   {buy?<a href={buy} rel="sponsored nofollow noopener noreferrer" target="_blank" onClick={track}>Comprar no Mercado Livre ↗</a>:<span className={styles.pending}>Compra em breve</span>}
  </div>
  {expanded&&<div className={styles.review} id={'review-'+book.id}>
    <div><h4>Sobre o que é</h4><p>{book.about}</p></div>
    <div className={styles.opinion}><h4>O que eu achei da leitura</h4><p>{book.review}</p></div>
    {book.lessons&&<div><h4>O que levei comigo</h4><p>{book.lessons}</p></div>}
    {book.recommendFor&&<div><h4>Eu indicaria para</h4><p>{book.recommendFor}</p></div>}
  </div>}
 </article>
}
export default function BookCatalog({books}:{books:BookEntry[]}){
 const [q,setQ]=useState(''),[category,setCategory]=useState('Todas'),[sort,setSort]=useState('editorial')
 const categories=useMemo(()=>['Todas',...Array.from(new Set(books.map(b=>b.category||'Outras leituras'))).sort((a,b)=>a.localeCompare(b,'pt-BR'))],[books])
 const visible=useMemo(()=>{
  const needle=q.trim().toLocaleLowerCase('pt-BR')
  const arr=books.filter(b=>(category==='Todas'||(b.category||'Outras leituras')===category)&&(!needle||[b.title,b.author,b.about,b.review,b.lessons||''].join(' ').toLocaleLowerCase('pt-BR').includes(needle)))
  if(sort==='title')arr.sort((a,b)=>a.title.localeCompare(b.title,'pt-BR'))
  if(sort==='rating')arr.sort((a,b)=>(b.rating||0)-(a.rating||0))
  return arr
 },[books,q,category,sort])
 return <main className={styles.page}>
  <div className={styles.shell}>
   <nav className={styles.nav}><a href="/diego">← Voltar à minha bio</a><a href="/">EY<span>AGENCIA</span></a></nav>
   <header className={styles.hero}>
    <div className={styles.heroIcon}>▤</div>
    <p className={styles.eyebrow}>BIBLIOTECA PESSOAL · DIEGO LEMES</p>
    <h1>Livros que <em>eu li.</em></h1>
    <p>Uma biblioteca construída com os livros que li e os aprendizados que aplico em negócios, tecnologia, gestão e na vida. Compartilho aqui minha visão de cada leitura.</p>
    <div className={styles.numbers}><span><b>{books.length}</b> {books.length===1?'livro':'livros'} no catálogo</span><span><b>{categories.length-1}</b> assuntos</span></div>
   </header>
   <section className={styles.content}>
    <div className={styles.heading}><div><small>MINHA ESTANTE</small><h2>Explore as leituras</h2></div><a href={highlight} target="_blank" rel="noopener noreferrer">Destaque Leitura📕 ↗</a></div>
    {books.length>0?<><div className={styles.filters}>
      <label><span>Buscar</span><input type="search" placeholder="Livro, autor ou assunto" value={q} onChange={e=>setQ(e.target.value)}/></label>
      <label><span>Assunto</span><select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option value={c} key={c}>{c}</option>)}</select></label>
      <label><span>Ordenar</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="editorial">Minha seleção</option><option value="rating">Minha nota</option><option value="title">Título A–Z</option></select></label>
    </div>
    <p className={styles.count} aria-live="polite">{visible.length} {visible.length===1?'livro encontrado':'livros encontrados'}</p>
    {visible.length?<div className={styles.grid}>{visible.map(b=><Book book={b} key={b.id}/>)}</div>:<div className={styles.empty}><h3>Nenhum livro encontrado</h3><p>Tente outra busca ou categoria.</p><button onClick={()=>{setQ('');setCategory('Todas')}}>Limpar filtros</button></div>}</>:
      <div className={styles.empty}><div className={styles.emptyIcon}>▤</div><h3>Minha biblioteca está sendo organizada</h3><p>Estou selecionando os livros que li e preparando minhas resenhas. Enquanto isso, você pode acessar meu destaque <strong>Leitura📕</strong> no Instagram.</p><a href={highlight} target="_blank" rel="noopener noreferrer">Ver minhas leituras no Instagram ↗</a></div>}
    <p className={styles.disclosure}>Transparência: os links de compra poderão ser de afiliado do Mercado Livre. Se você comprar por eles, posso receber comissão sem custo adicional para você. As resenhas expressam minhas reflexões sobre as leituras e os projetos que desenvolvo.</p>
   </section>
   <AuthorLibrary books={books}/>
   <footer className={styles.footer}><span>Diego Lemes · Construir, aprender e compartilhar.</span><a href="/diego">Voltar ao perfil ↗</a></footer>
  </div>
 </main>
}
