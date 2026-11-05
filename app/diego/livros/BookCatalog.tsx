'use client'
import {useMemo,useState} from 'react'
import styles from './books.module.css'

export type BookEntry={id:string;slug?:string|null;title:string;author:string;category?:string|null;about:string;review:string;lessons?:string|null;recommendFor?:string|null;rating?:number|null;readYear?:number|null;affiliateUrl?:string|null;amazonAffiliateUrl?:string|null;shopeeAffiliateUrl?:string|null;imageUrl?:string|null;imageAlt?:string|null;reviewDraft?:boolean;seedOrder?:number}
const highlight='https://www.instagram.com/stories/highlights/17898572725107429/'
// Ofertas recebidas do programa de afiliados do Diego em 05/11/2026.
// Links de livros ainda não publicados ficam preparados, sem marcá-los como lidos.
// A associação por slug evita trocar títulos/edições; edições do CMS têm prioridade.
const offerLinks:Record<string,{mercadoLivre?:string;amazon?:string;editionNote?:string}>={
// Primeiros títulos: links encaminhados nos prints de 05/11/2026.
 'as-5-linguagens-do-amor':{mercadoLivre:'https://meli.la/13NR5gV'}, // edição tradicional (não a edição para homens)
 'os-7-habitos-das-pessoas-altamente-eficazes':{mercadoLivre:'https://meli.la/11rPFwi'},
 'almanaque-de-naval-ravikant':{mercadoLivre:'https://meli.la/2Jz8onR'},
 'a-startup-enxuta':{mercadoLivre:'https://meli.la/1qgWthY'},
 'bem-vindo-espirito-santo':{mercadoLivre:'https://meli.la/1zMtEAx'},
 'fora-de-serie-outliers':{mercadoLivre:'https://meli.la/1rH66HP'},
 'o-investidor-inteligente':{mercadoLivre:'https://meli.la/1bb8Tru'},
 'os-axiomas-de-zurique':{mercadoLivre:'https://meli.la/2I3US4h'},
 'o-homem-mais-inteligente-da-historia':{mercadoLivre:'https://meli.la/13ijdKV'},
 'voce-e-insubstituivel':{mercadoLivre:'https://meli.la/2U64pQS'},
 'o-mestre-dos-mestres':{mercadoLivre:'https://meli.la/2pTiHWx'},
 'pais-brilhantes-professores-fascinantes':{mercadoLivre:'https://meli.la/1UFVFxR'},
 'o-mestre-inesquecivel':{mercadoLivre:'https://meli.la/292CgsS'},
 'o-mestre-da-sensibilidade':{mercadoLivre:'https://meli.la/2XUqVTY'},
 'ansiedade-digital':{mercadoLivre:'https://meli.la/13KRfSZ'},
 'pais-inteligentes-formam-sucessores-nao-herdeiros':{mercadoLivre:'https://meli.la/12eBQ3C'},
 'as-regras-de-ouro-dos-casais-saudaveis':{mercadoLivre:'https://meli.la/2V7eh2c'},
 'felicidade-roubada':{mercadoLivre:'https://meli.la/29mfL5m'},
 'chamando-atencao-da-sorte':{mercadoLivre:'https://meli.la/1k25yUT'},
 'instagram-whatsapp-e-facebook-para-negocios':{mercadoLivre:'https://meli.la/2mC75yT'}, // aguardando livro no catálogo
 'steve-jobs-para-jovens':{mercadoLivre:'https://meli.la/2JuMtZY',editionNote:'Edição em inglês'},
 'steve-jobs-walter-isaacson':{mercadoLivre:'https://meli.la/1pS9m7S'}, // biografia diferente, ainda sem registro
 'de-zero-a-um':{mercadoLivre:'https://meli.la/2Xa4Xdv'},
 'scrum-dobro-trabalho-metade-tempo':{mercadoLivre:'https://meli.la/1eZXpx5'}, // Scrum: A arte de fazer o dobro do trabalho na metade do tempo
 'faca-o-teu-melhor':{mercadoLivre:'https://meli.la/2KJzU9B'}, // Faça o teu melhor!
 'marketing-digital-o-segredo-do-facebook':{mercadoLivre:'https://meli.la/1xyGoKS'}, // Marketing Digital: O Segredo do Facebook (título ainda não cadastrado)
 'receita-previsivel':{mercadoLivre:'https://meli.la/2HMb4dr'}, // Receita previsível
 'as-dez-leis-da-confianca':{mercadoLivre:'https://meli.la/23ebagF'}, // As dez leis da confiança
 'bold-oportunidades-exponenciais':{mercadoLivre:'https://meli.la/1tMC2RS'}, // BOLD: Oportunidades exponenciais
 'do-mil-ao-milhao':{mercadoLivre:'https://meli.la/2sLjmqY'}, // Do mil ao milhão
 'o-poder-da-acao':{mercadoLivre:'https://meli.la/2cagsoq'}, // O poder da ação
}
// O link de "Marketing Digital: O Segredo do Facebook" é diferente de
// "Facebook Marketing", de Camila Porto; não vincular ao título errado.
const christSeriesBox={mercadoLivre:'https://meli.la/1BW8wRa',amazon:'https://link.amazon/B0fA2qibf'}
// Edição especial distinta do livro padrão; não altera a contagem de livros lidos.
const languagesForMen='https://meli.la/1kqkHiy'
// Capa da mesma edição Best Business / ISBN 9788568905159 exibida na foto enviada.
const verifiedCoverOverrides:Record<string,string>={
 'os-axiomas-de-zurique':'https://carrefourbr.vtexassets.com/arquivos/ids/7455066/MV28420319_Axiomas-de-Zurique--Os-_1_Zoom.jpg?v=637350061305170000'
}

const validBuy=(raw?:string|null,provider:'mercado_livre'|'amazon'|'shopee'='mercado_livre')=>{
 if(!raw)return null
 try{
  const u=new URL(raw),h=u.hostname.toLowerCase()
  const hosts:Record<string,string[]>={
   mercado_livre:['mercadolivre.com.br','mercadolivre.com','mercado.li','meli.la'],
   amazon:['amazon.com.br','amzn.to','a.co','link.amazon'],
   shopee:['shopee.com.br','shope.ee']
  }
  return u.protocol==='https:'&&hosts[provider].some(d=>h===d||h.endsWith('.'+d))?u.href:null
 }catch{return null}
}

function Book({book}:{book:BookEntry}){
 const [expanded,setExpanded]=useState(false)
 const [imageFailed,setImageFailed]=useState(false)
 const coverSrc=book.slug&&verifiedCoverOverrides[book.slug]||book.imageUrl
 const selectedOffer=book.slug?offerLinks[book.slug]:undefined
 const externalBuy=validBuy(book.affiliateUrl)
 const buy=externalBuy||validBuy(selectedOffer?.mercadoLivre)
 const buyLabel=externalBuy?'Mercado Livre ↗':selectedOffer?.editionNote?`Mercado Livre · ${selectedOffer.editionNote} ↗`:'Mercado Livre ↗'
 const amazon=validBuy(book.amazonAffiliateUrl||selectedOffer?.amazon,'amazon')
 const shopee=validBuy(book.shopeeAffiliateUrl,'shopee')
 const menEdition=book.slug==='as-5-linguagens-do-amor'?validBuy(languagesForMen):null
 const rating=book.rating&&Number.isInteger(book.rating)&&book.rating>0&&book.rating<=5?book.rating:0
 const track=(partner:string)=>{const w=window as Window&{dataLayer?:Array<Record<string,string>>};w.dataLayer ||= [];w.dataLayer.push({event:'diego_book_affiliate_click',book_id:book.slug||book.id,partner})}
 return <article className={styles.book} id={book.slug||book.id}>
  <div className={styles.bookTop}>
   <div className={styles.cover}>{coverSrc&&!imageFailed?<img src={coverSrc} alt={book.imageAlt||'Capa de '+book.title} loading="lazy" decoding="async" onError={()=>setImageFailed(true)}/>:<div className={styles.typographicCover}><small>{book.author}</small><strong>{book.title}</strong><span aria-hidden="true">▤</span></div>}</div>
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
   {buy&&<a href={buy} rel="sponsored nofollow noopener noreferrer" target="_blank" onClick={()=>track('mercado_livre')}>{buyLabel}</a>}
   {amazon&&<a href={amazon} rel="sponsored nofollow noopener noreferrer" target="_blank" onClick={()=>track('amazon')}>Amazon ↗</a>}
   {menEdition&&<a href={menEdition} rel="sponsored nofollow noopener noreferrer" target="_blank" onClick={()=>track('mercado_livre_edicao_homens')}>Edição para homens · ML ↗</a>}
   {shopee&&<a href={shopee} rel="sponsored nofollow noopener noreferrer" target="_blank" onClick={()=>track('shopee')}>Shopee ↗</a>}
   {!buy&&!amazon&&!shopee&&<span className={styles.pending}>Compra em breve</span>}
  </div>
  {book.slug==='o-mestre-dos-mestres'&&<aside aria-label="Coleção completa Análise da Inteligência de Cristo" style={{borderTop:'1px solid #39634c',paddingTop:13,marginTop:14}}>
   <p style={{fontSize:11,color:'#badbc4',lineHeight:1.55}}>Também disponível: edição que reúne os <strong>cinco volumes de Análise da Inteligência de Cristo</strong>.</p>
   <div className={styles.actions}>
    <a href={christSeriesBox.mercadoLivre} rel="sponsored nofollow noopener noreferrer" target="_blank" onClick={()=>track('mercado_livre_box_5_volumes')}>Box 5 volumes · Mercado Livre ↗</a>
    <a href={christSeriesBox.amazon} rel="sponsored nofollow noopener noreferrer" target="_blank" onClick={()=>track('amazon_box_5_volumes')}>Box 5 volumes · Amazon ↗</a>
   </div>
  </aside>}
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
    <p className={styles.disclosure}>Transparência: os links de compra podem ser de afiliado do Mercado Livre, Amazon ou Shopee. Se você comprar por eles, posso receber comissão sem custo adicional para você. As resenhas expressam minhas reflexões sobre as leituras e os projetos que desenvolvo.</p>
   </section>
   <footer className={styles.footer}><span>Diego Lemes · Construir, aprender e compartilhar.</span><a href="/diego">Voltar ao perfil ↗</a></footer>
  </div>
 </main>
}
