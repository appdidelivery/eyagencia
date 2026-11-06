import type { Metadata } from "next";
import Image from "next/image";
import TrackedLink from "./TrackedLink";
import styles from "./page.module.css";

const siteUrl = "https://www.eyagencia.com.br/diego";

export const metadata: Metadata = {
  title: "Diego Lemes | E-commerce, Tecnologia e IA na Prática",
  description:
    "Conheça Diego Lemes: formação em gestão de e-commerce pela ComSchool, mais de 11 anos de experiência e mais de 200 projetos implementados. Projetos, IA, livros e conhecimento aplicado.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Diego Lemes | Projetos, Tecnologia e Conhecimento",
    description: "Mais de 11 anos de experiência em e-commerce, mais de 200 projetos implementados e tecnologia aplicada a negócios.",
    url: siteUrl,
    siteName: "Diego Lemes · EyAgencia",
    locale: "pt_BR",
    type: "profile",
    images: [{ url: "/eyagencia-logo-verde.png", width: 1200, height: 630, alt: "EyAgencia" }]
  },
  robots: { index: true, follow: true }
};

type LiveLink = {
  title: string;
  subtitle: string;
  href: string;
  icon: string;
  label?: string;
  featured?: boolean;
};

const publishedLinks: LiveLink[] = [
  {
    title: "EyAgencia · minha agência",
    subtitle: "Estratégia digital, e-commerce, SEO e performance",
    href: "https://www.eyagencia.com.br/",
    icon: "✳",
    label: "MEUS NEGÓCIOS",
    featured: true
  },
  {
    title: "Velo Delivery · minha plataforma",
    subtitle: "Tecnologia própria para delivery, gestão e vendas online",
    href: "https://www.velodelivery.com.br/",
    icon: "◈",
    label: "PRODUTO DIGITAL"
  },
  {
    title: "Livros que eu li · minha biblioteca",
    subtitle: "Minha opinião, aprendizados e indicações",
    href: "/diego/livros",
    icon: "▥",
    label: "CATÁLOGO INTERATIVO"
  },
  {
    title: "Minha playlist · YouTube Music",
    subtitle: "Músicas que acompanham minha rotina",
    href: "https://music.youtube.com/playlist?list=PLFV65sgoXYGw&si=hZmQB6RTTWlBMKmn",
    icon: "♫",
    label: "MINHA PLAYLIST"
  },
  {
    title: "Projetos e cases de e-commerce",
    subtitle: "Negócios, experiências e soluções em operação",
    href: "/clientes",
    icon: "▦"
  },
  {
    title: "Minha trajetória profissional",
    subtitle: "Da ComSchool e Soluções Net aos projetos de hoje",
    href: "#trajetoria",
    icon: "◈"
  },
  {
    title: "IA aplicada ao e-commerce",
    subtitle: "Ferramentas, aplicações e guias práticos",
    href: "/ia-ecommerce",
    icon: "✳"
  },
  {
    title: "Artigos e conteúdos técnicos",
    subtitle: "E-commerce, SEO, dados, automação e IA",
    href: "/blog",
    icon: "▤"
  },
  {
    title: "Contato profissional",
    subtitle: "Converse com a EyAgencia sobre seu projeto",
    href: "https://wa.me/554832200260?text=Ol%C3%A1%2C%20vim%20pelo%20perfil%20do%20Diego%20Lemes%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto.",
    icon: "✉"
  }
];

const upcoming = [
  {
    title: "A Defesa Mais Importante",
    subtitle: "",
    icon: "◫",
    phase: "Em breve"
  },
  {
    title: "Cursos gratuitos de IA na prática",
    subtitle: "Do primeiro contato com IA à criação de serviços",
    icon: "✧",
    phase: "Em planejamento"
  },
  {
    title: "Materiais, produtos e metodologias",
    subtitle: "Guias, templates e recursos aplicáveis ao seu negócio",
    icon: "◇",
    phase: "Em breve"
  }
];

const bioLinkIds = ["eyagencia", "velo_delivery", "livros", "playlist", "projetos", "trajetoria", "ia_ecommerce", "artigos", "contato"];

function LiveCard({ item, position }: { item: LiveLink; position: number }) {
  const external = item.href.startsWith("https://");
  return (
    <TrackedLink
      linkId={bioLinkIds[position - 1] || "outro"}
      position={position}
      href={item.href}
      className={item.featured ? styles.featuredCard : styles.linkCard}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      <span className={styles.cardIcon} aria-hidden="true">{item.icon}</span>
      <span className={styles.cardText}>
        {item.label ? <span className={styles.cardKicker}>{item.label}</span> : null}
        <strong>{item.title}</strong>
        <small>{item.subtitle}</small>
      </span>
      <span className={styles.cardArrow} aria-hidden="true">↗</span>
    </TrackedLink>
  );
}

export default function DiegoBioPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": siteUrl + "#profile",
    url: siteUrl,
    name: "Diego Lemes — projetos e conhecimento aplicado",
    mainEntity: {
      "@type": "Person",
      "@id": siteUrl + "#diego",
      name: "Diego Lemes",
      url: siteUrl,
      sameAs: ["https://www.instagram.com/tidiegolemes/"],
      alumniOf: { "@type": "EducationalOrganization", name: "ComSchool" },
      knowsAbout: ["Gestão de e-commerce", "Marketing digital", "Inteligência artificial aplicada", "Automação", "Gestão de projetos"],
      worksFor: { "@type": "Organization", name: "EyAgencia", url: "https://www.eyagencia.com.br/" },
      description: "Profissional de e-commerce com mais de 11 anos de experiência, mais de 200 projetos implementados e atuação na EyAgencia e Velo Delivery."
    }
  };

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, "\\u003c") }} />
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.shell}>
        <div className={styles.brandBar}>
          <a className={styles.brand} href="/" aria-label="Voltar ao site EyAgencia">
            <Image src="/eyagencia-logo-verde.png" alt="EyAgencia" width={170} height={58} priority />
          </a>
          <span className={styles.brandTag}><span className={styles.signal} /> PÁGINA PESSOAL</span>
        </div>

        <main className={styles.layout}>
          <section className={styles.identity} aria-labelledby="name">
            <div className={styles.storyMosaic} role="group" aria-label="Cinco fotos da minha trajetória profissional e familiar">
              <div className={styles.mosaicLead}><Image src="/diego/mosaico/startup-summit.jpg" alt="No Startup Summit em Florianópolis, ao lado de duas pessoas da equipe" fill sizes="(max-width:850px) 42vw, 175px" priority /></div>
              <div className={styles.mosaicTile}><Image src="/diego/mosaico/familia-festa.jpg" alt="Encontro em família ao ar livre" fill sizes="(max-width:850px) 26vw, 100px" /></div>
              <div className={styles.mosaicTile}><Image src="/diego/mosaico/familia-lara.jpg" alt="Celebração e chegada de um bebê à família" fill sizes="(max-width:850px) 26vw, 100px" /></div>
              <div className={styles.mosaicTile}><Image src="/diego/mosaico/familia-memorias.jpg" alt="Uma lembrança de infância e família" fill sizes="(max-width:850px) 26vw, 100px" /></div>
              <div className={styles.mosaicTile}><Image src="/diego/mosaico/familia-origens.jpg" alt="Memória de uma caminhada em família em meio à natureza" fill sizes="(max-width:850px) 26vw, 100px" /></div>
            </div>
            <p className={styles.eyebrow}>PROJETOS REAIS · CONHECIMENTO APLICADO</p>
            <h1 id="name">Diego <em>Lemes.</em></h1>
            <p className={styles.role}>E-commerce, tecnologia e inteligência artificial na prática.</p>
            <p className={styles.intro}>
              Construo soluções digitais, conecto estratégia à execução e compartilho o que aprendo pelo caminho.
            </p>

            <div className={styles.chips} aria-label="Áreas de atuação">
              <span>E-commerce</span><span>IA & automação</span><span>Projetos digitais</span>
            </div>

            <div className={styles.numbers} aria-label="Experiência profissional">
              <div><b>11+</b><small>anos de<br />experiência</small></div>
              <div><b>200+</b><small>projetos<br />implementados</small></div>
              <div><b>2014</b><small>formação<br />ComSchool</small></div>
            </div>

            <TrackedLink linkId="instagram" position={10} className={styles.instagram} href="https://www.instagram.com/tidiegolemes/" target="_blank" rel="noopener noreferrer">
              <span className={styles.instagramIcon} aria-hidden="true">◎</span>
              Acompanhe no Instagram <span aria-hidden="true">↗</span>
            </TrackedLink>

            <section id="trajetoria" className={styles.story}>
              <div className={styles.storyTag}>UM POUCO SOBRE MIM</div>
              <h2>Experiência que virou método.</h2>
              <p>
                Sou formado em <strong>Gerência de E-commerce pela ComSchool (2014)</strong>.
                Atuei por dois anos, entre <strong>2013 e 2014, na Soluções Net</strong>,
                antiga plataforma de e-commerce de São José (SC). Foi ali que ampliei minha
                experiência técnica na implantação e evolução de lojas virtuais.
              </p>
              <p>
                Depois segui com minha própria agência, a <strong>EyAgencia</strong>, assumindo
                a implementação e o desenvolvimento de projetos para negócios de diferentes portes.
                Já <strong>implementei mais de 200 projetos</strong> e ajudei a
                <strong> escalar muitas lojas virtuais</strong>, combinando estratégia, tecnologia,
                marketing, dados e automação.
              </p>
              <p>
                Hoje também construo produtos digitais, como a <strong>Velo Delivery</strong>,
                e exploro aplicações práticas de inteligência artificial.
              </p>
            </section>
          </section>

          <div className={styles.resources}>
            <div className={styles.introPanel}>
              <span className={styles.panelEyebrow}><span /> PORTAL DE LINKS</span>
              <h2>Ideias em movimento.<br /><span>Conhecimento para compartilhar.</span></h2>
              <p>Explore os projetos e conteúdos disponíveis agora. Novas publicações, livros e formações vão aparecer por aqui conforme forem concluídos.</p>
            </div>

            <section className={styles.linkSection} aria-labelledby="active-title">
              <div className={styles.sectionHead}>
                <h2 id="active-title">Meus negócios e projetos</h2>
                <span className={styles.ready}><span /> DISPONÍVEL</span>
              </div>
              <div className={styles.cardList}>{publishedLinks.map((item, index) => <LiveCard key={item.title} item={item} position={index + 1} />)}</div>
            </section>

            <section className={styles.linkSection} aria-labelledby="soon-title">
              <div className={styles.sectionHead}>
                <h2 id="soon-title">O que vem por aí</h2>
                <span className={styles.building}>EM DESENVOLVIMENTO</span>
              </div>
              <div className={styles.cardList}>
                {upcoming.map(item => (
                  <div key={item.title} className={styles.upcomingCard} aria-disabled="true">
                    <span className={styles.mutedIcon} aria-hidden="true">{item.icon}</span>
                    <span className={styles.cardText}>
                      <strong>{item.title}</strong>
                      {item.subtitle ? <small>{item.subtitle}</small> : null}
                    </span>
                    <span className={styles.soonBadge}>{item.phase}</span>
                  </div>
                ))}
              </div>
              <p className={styles.soonNote}>Esses conteúdos ainda não estão publicados. Os botões serão habilitados quando estiverem prontos.</p>
            </section>
          </div>
        </main>

        <footer className={styles.footer}>
          <span><strong>Diego Lemes</strong> · Construir, aprender e compartilhar.</span>
          <a href="/">Um projeto do ecossistema EyAgencia ↗</a>
        </footer>
      </div>
    </div>
  );
}
