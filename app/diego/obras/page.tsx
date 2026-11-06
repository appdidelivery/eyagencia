import type {Metadata} from 'next'
import Link from 'next/link'
const url='https://www.eyagencia.com.br/diego/obras'
export const metadata:Metadata={
 title:'Livros e projetos autorais | Diego Lemes',
 description:'Projetos literários de Diego Lemes: A Defesa Mais Importante e Enquanto a Água Subia, livro documental sobre as enchentes de 2024 no Rio Grande do Sul.',
 alternates:{canonical:url},openGraph:{title:'Biblioteca de autor — Diego Lemes',url,type:'website',locale:'pt_BR'},robots:{index:true,follow:true}
}
export default function AuthorBooks(){
 const schema={'@context':'https://schema.org','@type':'CollectionPage','@id':url+'#pagina',name:'Projetos de livros de Diego Lemes',url,author:{'@type':'Person',name:'Diego Lemes',url:'https://www.eyagencia.com.br/diego'},inLanguage:'pt-BR'}
 return <main style={{background:'#f5f3ed',color:'#25383c',minHeight:'100vh',padding:'0 20px 80px'}}>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  <div style={{maxWidth:1020,margin:'auto'}}>
   <nav style={{padding:'25px 0',font:'600 13px Inter,Arial,sans-serif'}}><Link href="/diego" style={{color:'#306a70'}}>← Diego Lemes</Link> <span style={{color:'#839396'}}> / Obras</span></nav>
   <header style={{padding:'70px 0 50px',maxWidth:720}}><p style={{font:'800 11px Inter,Arial,sans-serif',letterSpacing:'.2em',color:'#47727b'}}>LIVROS · MEMÓRIA · HISTÓRIAS REAIS</p><h1 style={{fontSize:'clamp(44px,7vw,82px)',letterSpacing:'-.055em',lineHeight:1.03,fontWeight:500,margin:'24px 0'}}>Histórias que merecem ficar.</h1><p style={{font:'18px/1.8 Georgia,serif'}}>Reúno aqui meus projetos de escrita e pesquisa. Cada livro nasce de encontros, entrevistas e experiências que não deveriam desaparecer com o tempo.</p></header>
   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(285px,1fr))',gap:20}}>
    <article style={{borderRadius:14,background:'#1e4753',color:'#fff',padding:'40px 35px',minHeight:355,display:'flex',flexDirection:'column'}}>
     <small style={{font:'700 11px Inter,Arial,sans-serif',letterSpacing:'.18em',color:'#b6d3d6'}}>LIVRO 02 · LIVRO VIVO</small>
     <h2 style={{font:'normal 44px/1.06 Georgia,serif',margin:'36px 0 14px'}}>Enquanto a<br/>Água Subia.</h2>
     <p style={{font:'15px/1.6 Georgia,serif',color:'#dae8e9'}}>Uma família, a enchente de 2024 e as faces da humanidade.</p>
     <Link href="/diego/obras/enquanto-a-agua-subia" style={{marginTop:'auto',display:'inline-block',paddingTop:28,color:'#ffdfad',font:'700 13px Inter,Arial,sans-serif'}}>Abrir a edição digital em construção ↗</Link>
    </article>
    <article style={{borderRadius:14,border:'1px solid #cfd6d2',background:'#fffefa',padding:'40px 35px',minHeight:355,display:'flex',flexDirection:'column'}}>
     <small style={{font:'700 11px Inter,Arial,sans-serif',letterSpacing:'.18em',color:'#8c7445'}}>LIVRO 01 · EM EDIÇÃO</small>
     <h2 style={{font:'normal 44px/1.06 Georgia,serif',margin:'36px 0 14px'}}>A Defesa Mais<br/>Importante.</h2>
     <p style={{font:'15px/1.7 Georgia,serif'}}>A trajetória do goleiro Sidão, suas escolhas, desafios e a história para além das traves.</p>
     <small style={{marginTop:'auto',paddingTop:28,color:'#68787b',font:'600 13px Inter,Arial,sans-serif'}}>Manuscrito em revisão e validação editorial</small>
    </article>
   </div>
   <p style={{borderTop:'1px solid #d1d9d4',marginTop:58,paddingTop:22,font:'13px/1.7 Inter,Arial,sans-serif',color:'#6b7978'}}>As versões digitais preliminares não equivalem a uma publicação definitiva. Fotografias e depoimentos de outras pessoas só serão incorporados após as verificações e autorizações correspondentes.</p>
  </div>
 </main>
}
