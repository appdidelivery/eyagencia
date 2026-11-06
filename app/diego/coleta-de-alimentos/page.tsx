import type {Metadata} from 'next'
import Link from 'next/link'
import styles from './page.module.css'
import ActionLinks from './ActionLinks'

const url='https://www.eyagencia.com.br/diego/coleta-de-alimentos'
export const metadata:Metadata={
 title:'Dia Nacional da Coleta de Alimentos 2026 | Voluntariado na Grande Florianópolis · Diego Lemes',
 description:'Conheça o Dia Nacional da Coleta de Alimentos, ação solidária anual. Diego Lemes e família participam há mais de 11 anos na região de São José e Florianópolis. Saiba como ser voluntário.',
 alternates:{canonical:url},
 openGraph:{
  title:'Uma vez por ano. Milhares de gestos. Dia Nacional da Coleta de Alimentos 2026',
  description:'7 de novembro de 2026 · Veja como funciona a coleta, conheça a iniciativa nacional e participe como voluntário na Grande Florianópolis.',
  type:'article',url,locale:'pt_BR',siteName:'Diego Lemes · EyAgencia'
 },robots:{index:true,follow:true}
}
const jsonLd={
 '@context':'https://schema.org',
 '@graph':[
  {'@type':'WebPage','@id':url+'#page',name:'Dia Nacional da Coleta de Alimentos na Grande Florianópolis',url,inLanguage:'pt-BR',description:'Ação de voluntariado anual com recolhimento de alimentos não perecíveis e mobilização de supermercados e comunidade.'},
  {'@type':'Event','@id':url+'#evento-2026',name:'Dia Nacional da Coleta de Alimentos 2026',startDate:'2026-11-07',endDate:'2026-11-07',eventStatus:'https://schema.org/EventScheduled',eventAttendanceMode:'https://schema.org/OfflineEventAttendanceMode',location:{'@type':'Place',name:'Supermercados participantes (confirmar no grupo regional)',address:{'@type':'PostalAddress',addressLocality:'Grande Florianópolis',addressRegion:'SC',addressCountry:'BR'}},organizer:{'@type':'Organization',name:'Companhia das Obras — Dia Nacional da Coleta de Alimentos',url:'https://www.instagram.com/coletadealimentos/'},description:'Mobilização anual em supermercados com participação voluntária. Confira os estabelecimentos e turnos de 2026 na organização local.'},
  {'@type':'Person',name:'Diego Lemes',url:'https://www.eyagencia.com.br/diego',subjectOf:{'@id':url+'#page'}}
 ]
}
export default function ColetaPage(){
 return <div className={styles.page}>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,'\\u003c')}}/>
  <header className={styles.header}>
   <Link href="/diego" className={styles.back}>← Minha bio</Link>
   <a href="https://www.instagram.com/coletadealimentos/" target="_blank" rel="noopener noreferrer" className={styles.headerHandle}>@coletadealimentos ↗</a>
  </header>
  <main>
   <section className={styles.hero}>
    <div className={styles.heroIntro}>
     <span className={styles.eyebrow}><span className={styles.pulse}/> UM PROJETO QUE NOS MOVE HÁ MAIS DE UMA DÉCADA</span>
     <h1>Uma vez por ano.<br/><em>Um Brasil inteiro</em><br/>fazendo a diferença<span>.</span></h1>
     <p>Quando a solidariedade encontra os corredores de um supermercado, um gesto simples vira alimento na mesa de alguém. Este é o <strong>Dia Nacional da Coleta de Alimentos</strong>.</p>
     <ActionLinks kind="hero"/>
     <p className={styles.footnote}>Participação voluntária e gratuita · Grande Florianópolis · As instruções sobre pontos e horários são compartilhadas pela organização regional.</p>
    </div>
    <div className={styles.visual}>
     <div className={styles.visualTop}><span>EDIÇÃO NACIONAL</span><span>2026</span></div>
     <div className={styles.visualCenter}>
      <span className={styles.foodIcon} aria-hidden="true">♥</span>
      <span className={styles.visualMini}>UM DIA DE SOLIDARIEDADE</span>
      <strong>07<span> / </span>11</strong>
      <span className={styles.visualDay}>SÁBADO · 2026</span>
     </div>
     <div className={styles.visualBottom}><span>21ª EDIÇÃO</span><span>43 CIDADES</span><span>200+ MERCADOS</span></div>
    </div>
   </section>
   <section className={styles.story}>
    <span className={styles.eyebrow}>POR QUE FAÇO PARTE</span>
    <div className={styles.storyGrid}>
     <h2>Não é sobre um dia no calendário.<br/><em>É sobre as pessoas.</em></h2>
     <div>
      <p>Há pelo menos <strong>11 anos</strong>, eu e minha família nos unimos ao projeto aqui na Grande Florianópolis. Sou gerente do <strong>Giassi Areias, em São José</strong>, e conheço de perto a força dos clientes, voluntários e famílias que fazem essa mobilização acontecer.</p>
      <p>Minha família participa junto comigo. Ajudar na arrecadação nos ensinou que o essencial não está apenas nas grandes campanhas, mas em cada pessoa que se dispõe a dedicar tempo, organizar doações e olhar para o próximo.</p>
      <p className={styles.signature}>— Diego Lemes</p>
     </div>
    </div>
   </section>
   <section className={styles.how}>
    <div className={styles.sectionTitle}><span className={styles.eyebrow}>COMO FUNCIONA</span><h2>É simples participar.</h2><p>As equipes voluntárias recebem clientes nos supermercados parceiros e convidam quem puder a doar alimentos não perecíveis.</p></div>
    <div className={styles.steps}>
     <article><span>01</span><h3>Entre na mobilização</h3><p>Participe do grupo regional e consulte as orientações para 2026, incluindo lojas e turnos disponíveis.</p></article>
     <article><span>02</span><h3>Dedique parte do seu dia</h3><p>Voluntários recebem clientes e explicam como contribuir durante as compras.</p></article>
     <article><span>03</span><h3>Doe o que puder</h3><p>Alimentos não perecíveis são recolhidos e encaminhados pela rede parceira de bancos de alimentos.</p></article>
    </div>
   </section>
   <section className={styles.regional}>
    <div className={styles.regionalCopy}>
     <span className={styles.eyebrow}>SÃO JOSÉ · FLORIANÓPOLIS · REGIÃO</span>
     <h2>A nossa região também faz parte dessa história.</h2>
     <p>A parceria histórica da campanha com o <strong>Sesc Mesa Brasil</strong> e com supermercados como o <strong>Giassi Areias</strong> foi registrada pelo Sesc-SC. O programa apoia a logística e a distribuição de alimentos às instituições beneficiadas.</p>
     <p>Para a edição de 2026, <strong>confirme os estabelecimentos, horários e a organização do voluntariado no grupo regional</strong>. Informações de edições anteriores não equivalem à lista oficial deste ano.</p>
     <a href="https://www.sesc-sc.com.br/assistencia/sabado-10-de-novembro-e-o-dia-nacional-da-coleta-de-alimentos" rel="noopener noreferrer" target="_blank" className={styles.source}>Ver histórico da campanha no Sesc-SC ↗</a>
    </div>
    <div className={styles.regionalCard}><span>2006 → 2026</span><strong>21 anos</strong><small>de mobilização nacional</small><div>Uma ação por ano. Milhares de pessoas colocando a solidariedade em prática.</div></div>
   </section>
   <section className={styles.callToAction}>
    <div><span className={styles.eyebrow}>FAÇA PARTE DESTA EDIÇÃO</span><h2>Você também pode ajudar.</h2><p>Se você mora em São José, Florianópolis ou nas cidades próximas, entre no grupo para saber como participar. Se estiver em outra região, acompanhe o perfil nacional para encontrar iniciativas perto de você.</p></div>
    <ActionLinks kind="footer"/>
   </section>
  </main>
  <footer className={styles.footer}><span>Projeto nacional: Companhia das Obras · Mobilização local: comunidade voluntária</span><Link href="/diego">← Voltar para Diego Lemes</Link><span>Esta é uma página de divulgação pessoal, não um canal oficial da organização.</span></footer>
 </div>
}
