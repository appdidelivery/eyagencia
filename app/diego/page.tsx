import type { Metadata } from "next";
import Image from "next/image";
import styles from "./page.module.css";

const siteUrl = "https://www.eyagencia.com.br/diego";

export const metadata: Metadata = {
  title: "Diego Lemes | E-commerce, Tecnologia e IA na Prática",
  description:
    "Conheça Diego Lemes: formação em gestão de e-commerce pela ComSchool, mais de 11 anos de experiência e mais de 200 projetos assistidos. Projetos, IA, livros e conhecimento aplicado.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Diego Lemes | Projetos, Tecnologia e Conhecimento",
    description: "Mais de 11 anos de experiência em e-commerce, mais de 200 projetos assistidos e tecnologia aplicada a negócios.",
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
    title: "Eu Primeiro — meu livro",
    subtitle: "Um projeto de escrita e reflexão em desenvolvimento",
    icon: "◫",
    phase: "Em construção"
  },
  {
    title: "Minha biblioteca",
    subtitle: "Livros que li, aprendizados e indicações pessoais",
    icon: "▥",
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

function LiveCard({ item }: { item: LiveLink }) {
  const external = item.href.startsWith("https://");
  return (
    <a
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
    </a>
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
      description: "Profissional de e-commerce com mais de 11 anos de experiência e mais de 200 projetos assistidos."
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
            <div className={styles.portrait}>
              <div className={styles.monogram} aria-label="Monograma Diego Lemes">D<span>L</span></div>
              <span className={styles.portraitDot} />
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
              <div><b>200+</b><small>projetos<br />assistidos</small></div>
              <div><b>2014</b><small>formação<br />ComSchool</small></div>
            </div>

            <a className={styles.instagram} href="https://www.instagram.com/tidiegolemes/" target="_blank" rel="noopener noreferrer">
              <span className={styles.instagramIcon} aria-hidden="true">◎</span>
              Acompanhe no Instagram <span aria-hidden="true">↗</span>
            </a>

            <section id="trajetoria" className={styles.story}>
              <div className={styles.storyTag}>UM POUCO SOBRE MIM</div>
              <h2>Experiência que virou método.</h2>
              <p>
                Sou formado em Gerência de E-commerce pela <strong>ComSchool, desde 2014</strong>.
                Minha passagem pela <strong>Soluções Net</strong>, antiga plataforma de e-commerce de
                São José (SC), foi uma etapa importante da minha formação prática.
              </p>
              <p>
                Ao longo de mais de 11 anos, participei da evolução de operações de diferentes
                tamanhos e acompanhei <strong>mais de 200 projetos</strong>. Hoje, aplico essa
                experiência a tecnologia, negócios digitais, automação e inteligência artificial.
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
                <h2 id="active-title">Acesse agora</h2>
                <span className={styles.ready}><span /> DISPONÍVEL</span>
              </div>
              <div className={styles.cardList}>{publishedLinks.map(item => <LiveCard key={item.title} item={item} />)}</div>
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
                      <small>{item.subtitle}</small>
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
