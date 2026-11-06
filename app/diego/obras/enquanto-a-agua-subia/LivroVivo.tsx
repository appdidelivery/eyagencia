'use client'
import {useEffect,useMemo,useState} from 'react'
import Link from 'next/link'
import {acts,chapters,opening,bookTitle,bookSubtitle,type PublishedMedia,type PublishedChapter} from './data'
import styles from './ebook.module.css'

type Props={approvedMedia:PublishedMedia[];publishedChapters:PublishedChapter[]}
const mediaUrl=(code:string)=>'/diego/obras/enquanto-a-agua-subia/registro/'+encodeURIComponent(code)

export default function LivroVivo({approvedMedia,publishedChapters}:Props){
 const [fontSize,setFontSize]=useState(19)
 const [dark,setDark]=useState(false)
 const [progress,setProgress]=useState(0)
 const [active,setActive]=useState('')
 const chapterByCode=useMemo(()=>new Map(publishedChapters.map(c=>[c.code,c])),[publishedChapters])
 useEffect(()=>{
  try{setFontSize(Math.max(16,Math.min(24,Number(localStorage.getItem('enchente-font'))||19)));setDark(localStorage.getItem('enchente-dark')==='true')}catch{}
 },[])
 useEffect(()=>{
  const update=()=>{
   const max=document.documentElement.scrollHeight-window.innerHeight
   setProgress(max>0?Math.max(0,Math.min(100,100*window.scrollY/max)):0)
   const found=chapters.filter(c=>{const el=document.getElementById(c.code);return el&&el.getBoundingClientRect().top<170})
   setActive(found.length?found[found.length-1].code:'')
  }
  update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update)
  return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update)}
 },[])
 const changeFont=(step:number)=>setFontSize(prev=>{const next=Math.max(16,Math.min(24,prev+step));try{localStorage.setItem('enchente-font',String(next))}catch{}return next})
 const toggleDark=()=>setDark(prev=>{try{localStorage.setItem('enchente-dark',String(!prev))}catch{}return !prev})
 const mediaByChapter=(code:string)=>approvedMedia.filter(m=>m.chapterCode===code)
 return <div className={styles.root} data-theme={dark?'night':'paper'} style={{'--font-size':fontSize+'px'} as React.CSSProperties}>
  <div className={styles.readingProgress} aria-hidden="true" style={{width:progress+'%'}}/>
  <header className={styles.toolbar}>
   <Link href="/diego/obras" className={styles.brand}>DL <span>· BIBLIOTECA DE AUTOR</span></Link>
   <div className={styles.readingTools} aria-label="Opções de leitura">
    <button type="button" onClick={()=>changeFont(-1)} aria-label="Diminuir tamanho da fonte">A−</button>
    <button type="button" onClick={()=>changeFont(1)} aria-label="Aumentar tamanho da fonte">A+</button>
    <button type="button" onClick={toggleDark}>{dark?'Tema claro':'Tema escuro'}</button>
    <button type="button" onClick={()=>window.print()} className={styles.print}>Imprimir / PDF</button>
   </div>
  </header>
  <div className={styles.layout}>
   <aside className={styles.sidebar}>
    <div className={styles.sideTitle}>
     <span className={styles.overline}>LIVRO VIVO · VERSÃO 0.1</span>
     <strong>{bookTitle}</strong>
     <p>Um arquivo de memória em construção. Capítulos, fotos e relatos ainda passam por apuração.</p>
    </div>
    <nav aria-label="Índice do livro">
     <a className={styles.navIntro} href="#abertura">Carta de abertura</a>
     {acts.map(act=><div key={act.number} className={styles.navAct}>
      <span>ATO {String(act.number).padStart(2,'0')} · {act.title}</span>
      {chapters.filter(c=>c.act===act.number).map(c=><a key={c.code} className={active===c.code?styles.activeChapter:styles.navChapter} href={'#'+c.code}>
       <small>{String(c.number).padStart(2,'0')}</small>{c.title}
       {chapterByCode.has(c.code)&&<span aria-label="Texto publicado">●</span>}
      </a>)}
     </div>)}
    </nav>
    <Link className={styles.sideBack} href="/diego">Sobre o autor ↗</Link>
   </aside>
   <main className={styles.paper}>
    <div className={styles.cover}>
     <div className={styles.coverLight} aria-hidden="true"/>
     <div className={styles.coverTop}>MEMÓRIA · SOLIDARIEDADE · RIO GRANDE DO SUL, 2024</div>
     <div className={styles.coverContent}>
      <p className={styles.authorName}>DIEGO LEMES</p>
      <h1>Enquanto<br/>a <em>Água</em><br/>Subia<span>.</span></h1>
      <p>{bookSubtitle}</p>
     </div>
     <div className={styles.waterLines} aria-hidden="true"><span/><span/><span/><span/></div>
     <div className={styles.coverBottom}>Uma história ainda sendo contada <span>· EDIÇÃO DE TRABALHO</span></div>
    </div>
    <div className={styles.paperInner}>
     <div className={styles.disclosure} role="note"><strong>Leitura preliminar.</strong> Esta edição digital é um projeto editorial, não o manuscrito completo. O relato de acontecimentos, imagens de terceiros e responsabilidades institucionais dependerá de checagem, edição e autorizações antes da publicação definitiva.</div>
     <section id="abertura" className={styles.opening}>
      <span className={styles.overline}>CARTA DE ABERTURA · VERSÃO EDITORIAL INICIAL</span>
      <h2>A memória começa quando encontramos coragem para olhar de novo.</h2>
      {opening.map((p,i)=><p key={i}>{p}</p>)}
      <div className={styles.signature}><strong>Diego Lemes</strong><span>Projeto editorial · novembro de 2026</span></div>
     </section>
     {acts.map(act=><div key={act.number} className={styles.actGroup}>
      <div className={styles.actHeader}><span>ATO {String(act.number).padStart(2,'0')}</span><h2>{act.title}</h2><p>{act.short}</p></div>
      {chapters.filter(c=>c.act===act.number).map(chapter=>{
       const approved=chapterByCode.get(chapter.code)
       const media=mediaByChapter(chapter.code)
       return <article key={chapter.code} id={chapter.code} className={styles.chapter}>
        <div className={styles.chapterNumber}>{String(chapter.number).padStart(2,'0')} <span>{approved?'TEXTO EDITORIAL PUBLICADO':'CAPÍTULO EM APURAÇÃO'}</span></div>
        <h3>{chapter.title}</h3>
        {approved?.body?.trim()?approved.body.trim().split(/\n\s*\n/).filter(Boolean).map((p,i)=><p key={i} className={styles.prose}>{p}</p>):
        <div className={styles.chapterBrief}><strong>Direção editorial deste capítulo</strong><p>{chapter.focus}</p><small>As cenas, entrevistas e datas serão incorporadas após confrontar os registros originais. Não são apresentadas lembranças inventadas.</small></div>}
        {!!media.length&&<div className={styles.mediaGrid}>{media.map(m=><Link className={styles.mediaCard} href={mediaUrl(m.code)} key={m.code}>
         {m.imageUrl?<img src={m.imageUrl} alt={m.alt||m.title} loading="lazy" />:<span className={styles.mediaPlaceholder}>▶ Vídeo</span>}
         <span><strong>{m.title}</strong><small>Registro {m.code.toUpperCase()} · ver documentação ↗</small></span>
        </Link>)}</div>}
        <div className={styles.chapterLinks}>
         <a href={mediaUrl(chapter.code)} title={'Link permanente para o capítulo '+chapter.number}>Link do capítulo para o livro impresso ↗</a>
         <small>{media.length?media.length+' registro(s) visual(is) autorizado(s)':'Registros visuais em triagem'}</small>
        </div>
       </article>
      })}
     </div>)}
     <section className={styles.finalNote} aria-labelledby="memoria-futura"><span className={styles.overline}>A PESQUISA CONTINUA</span><h2 id="memoria-futura">Cada imagem tem uma história. Cada história merece ser conferida.</h2><p>O acervo original está preservado em ambiente privado. Esta plataforma só exibirá fotografias e vídeos selecionados para publicação, identificados e com os devidos cuidados de privacidade e autoria.</p><Link href="/diego/obras" className={styles.endLink}>Voltar à biblioteca do autor ↗</Link></section>
    </div>
   </main>
  </div>
  <footer className={styles.footer}><span>© {new Date().getFullYear()} Diego Lemes · Edição digital de trabalho</span><Link href="/diego">Perfil do autor</Link></footer>
 </div>
}
