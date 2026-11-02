"use client";

import Image from "next/image";
import styles from "./links.module.css";

type IconId = "instagram" | "tiktok" | "youtube" | "facebook" | "whatsapp" | "chart" | "globe" | "spark" | "book" | "briefcase" | "chat" | "handshake" | "store";
type Biolink = { id: string; title: string; description: string; href: string; icon: IconId; featured?: boolean; eyebrow?: string };

const socials: { id: IconId; label: string; href: string }[] = [
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/eyagencia" },
  { id: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@eyagenciamkt" },
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@eyagenciadee-commercemktso5161" },
  { id: "facebook", label: "Facebook", href: "https://www.facebook.com/eyagencia" },
];

const primary: Biolink[] = [
  { id: "diagnostico", title: "Diagnóstico para o seu e-commerce", description: "Descubra oportunidades para vender mais com estratégia e dados", href: "https://www.eyagencia.com.br/#diagnostico", icon: "chart", eyebrow: "COMECE AQUI", featured: true },
  { id: "comercial", title: "Fale com nosso time comercial", description: "Projetos, propostas e novos negócios pelo WhatsApp", href: "https://wa.me/554832200260?text=Ol%C3%A1%2C%20vim%20pela%20bio%20da%20EYAgencia%20e%20quero%20conversar%20sobre%20um%20projeto.", icon: "whatsapp", eyebrow: "CONTATO COMERCIAL" },
  { id: "consultoria", title: "Consultoria e dúvidas", description: "Converse sobre marketing digital, performance e vendas", href: "https://wa.me/554832200260?text=Ol%C3%A1%2C%20vim%20pela%20bio%20da%20EYAgencia%20e%20quero%20saber%20sobre%20consultoria.", icon: "chat" },
  { id: "seo", title: "SEO, AEO e GEO para marcas", description: "Posicionamento no Google, IA e busca generativa", href: "https://www.eyagencia.com.br/#servicos", icon: "spark" },
  { id: "ia", title: "IA aplicada ao e-commerce", description: "Ferramentas, guias e soluções para lojas virtuais", href: "https://www.eyagencia.com.br/ia-ecommerce", icon: "globe" },
];

const extra: Biolink[] = [
  { id: "clientes", title: "Clientes e projetos", description: "Conheça marcas que fazem parte da nossa trajetória", href: "https://www.eyagencia.com.br/clientes", icon: "briefcase" },
  { id: "blog", title: "Blog EYAgencia", description: "Conteúdo sobre e-commerce, SEO e novas tecnologias", href: "https://www.eyagencia.com.br/blog", icon: "book" },
  { id: "parceiros", title: "Plataformas e parceiros", description: "Conheça nosso ecossistema de soluções", href: "https://www.eyagencia.com.br/parceiros", icon: "handshake" },
  { id: "website", title: "Site oficial EYAgencia", description: "Serviços, metodologia e todas as nossas soluções", href: "https://www.eyagencia.com.br/", icon: "store" },
];

function track(id: string, group: string, url: string) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: Record<string, string>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "biolink_click", brand: "eyagencia", link_id: id, link_group: group, link_url: url });
}

function Icon({ name }: { name: IconId }) {
  const props = { viewBox: "0 0 24 24", width: 23, height: 23, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  switch (name) {
    case "instagram": return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></svg>;
    case "tiktok": return <svg {...props}><path d="M14 3v12.6a4.6 4.6 0 1 1-4.6-4.6c.5 0 .9.1 1.3.2V7.7a8 8 0 1 0 6.7 7.9V9a8 8 0 0 0 4 1.1V6.7A5 5 0 0 1 17.4 3H14Z" fill="currentColor" stroke="none" /></svg>;
    case "youtube": return <svg {...props}><rect x="2.2" y="5.4" width="19.6" height="13.2" rx="4" /><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" /></svg>;
    case "facebook": return <svg {...props}><path d="M15.3 21v-8h2.8l.4-3.5h-3.2V7.4c0-1 .3-1.7 1.8-1.7h1.6V2.5c-.8-.1-1.6-.2-2.4-.2-3.1 0-4.9 1.9-4.9 5.2v2H8.7V13h2.7v8" /></svg>;
    case "whatsapp": return <svg {...props}><path d="M20 11.6a8.2 8.2 0 0 1-12.1 7.2L3 20l1.4-4.6A8.2 8.2 0 1 1 20 11.6Z" /><path d="M8.1 8.3c.1-.5.5-.7.8-.7h.7l1.1 2.2c.1.3-.2.7-.5 1.1a6 6 0 0 0 2.8 2.7c.4-.4.7-.9 1.1-.9l2.1 1c.4.2.3.7.1 1.2-.4 1.1-1.6 1.6-2.7 1.2-3-.9-6-3.6-6.1-5.6" /></svg>;
    case "chart": return <svg {...props}><path d="M4 19.5V4.5M4 19.5H21M7 14l4-4 3 2 5-6" /><path d="M15 6h4v4" /></svg>;
    case "spark": return <svg {...props}><path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4Z" /></svg>;
    case "book": return <svg {...props}><path d="M12 6.7c-3-2-5.7-2-9-1.2v13c3.4-.8 6.2-.7 9 1.2m0-13c3-2 5.7-2 9-1.2v13c-3.4-.8-6.2-.7-9 1.2m0-13v13" /></svg>;
    case "briefcase": return <svg {...props}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></svg>;
    case "chat": return <svg {...props}><path d="M20 11.5a8 8 0 0 1-12 6.9L3 20l1.5-4.8A8 8 0 1 1 20 11.5Z" /><path d="M8 11h8m-8 3h5" /></svg>;
    case "handshake": return <svg {...props}><path d="m3 8 4-4 5 2 3-1 6 5-4 4-4-3-3 3-4-1-3-5Zm3 5 3 3m2-1 2 2m1-3 2 2" /></svg>;
    case "store": return <svg {...props}><path d="M3 9 5 3h14l2 6v3a3 3 0 0 1-4.5 2.6 3 3 0 0 1-5 0 3 3 0 0 1-5 0A3 3 0 0 1 3 12V9Zm2 7v5h14v-5M9 21v-5h6v5" /></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></svg>;
  }
}

function LinkCard({ item, group }: { item: Biolink; group: string }) {
  return <a href={item.href} target={item.href.includes("tiktok.com") ? "_self" : "_blank"} rel="noopener noreferrer" className={item.featured ? styles.featuredCard : styles.linkCard} onClick={() => track(item.id, group, item.href)}>
    <span className={styles.linkIcon}><Icon name={item.icon} /></span>
    <span className={styles.linkText}>
      {item.eyebrow && <span className={styles.eyebrow}>{item.eyebrow}</span>}
      <strong>{item.title}</strong><small>{item.description}</small>
    </span><span className={styles.arr} aria-hidden="true">↗</span>
  </a>;
}

export default function EyLinksPage() {
  return <div className={styles.page}>
    <div className={styles.ambient} aria-hidden="true" />
    <main className={styles.container}>
      <header className={styles.header}>
        <a href="https://www.eyagencia.com.br/" aria-label="Ir ao site oficial EYAgencia" onClick={() => track("logo", "header", "https://www.eyagencia.com.br/")} className={styles.logoFrame}>
          <Image src="/eyagencia-logo-verde.png" alt="EYAgencia" width={230} height={90} priority className={styles.logo} />
        </a>
        <div className={styles.profileSeal}><span>E<span className={styles.profileAccent}>Y</span></span><span className={styles.onlineDot} /></div>
        <p className={styles.kicker}>ESTRATÉGIA · TECNOLOGIA · RESULTADOS</p>
        <h1>EY<span>Agencia</span></h1>
        <p className={styles.subtitle}>Sua operação digital merece mais do que presença.<br /><b>Precisa de performance.</b></p>
        <div className={styles.tags}><span>SEO &amp; IA</span><span>Tráfego pago</span><span>E-commerce B2B</span></div>
      </header>

      <section className={styles.socialSection} aria-label="Redes sociais oficiais da EYAgencia">
        <div className={styles.socialGrid}>{socials.map(s => <a key={s.id} href={s.href} target={s.id === "tiktok" ? "_self" : "_blank"} rel="noopener noreferrer" className={styles.social} onClick={() => track(s.id, "social", s.href)} aria-label={"EYAgencia no " + s.label}><Icon name={s.id} /><span>{s.label}</span></a>)}</div>
      </section>

      <section className={styles.linksSection} aria-label="Soluções e contato"><div className={styles.sectionLabel}><span />PRÓXIMO PASSO<span /></div><div className={styles.cards}>{primary.map(item => <LinkCard key={item.id} item={item} group="primary" />)}</div></section>
      <section className={styles.linksSection} aria-label="Conteúdos e projetos"><div className={styles.sectionLabel}><span />EXPLORE NOSSO ECOSSISTEMA<span /></div><div className={styles.cards}>{extra.map(item => <LinkCard key={item.id} item={item} group="explore" />)}</div></section>
      <footer className={styles.footer}><p>EYAGENCIA · MARKETING, DADOS &amp; E-COMMERCE</p><small>Uma página oficial da EYAgencia. Desenvolvida para conectar você às nossas soluções.</small></footer>
    </main>
  </div>;
}
