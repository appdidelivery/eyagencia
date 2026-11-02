import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "EYAgencia | Links Oficiais, Contato, SEO e E-commerce",
  description: "Todos os links oficiais da EYAgencia: diagnóstico de e-commerce, consultoria, WhatsApp comercial, SEO, inteligência artificial, projetos, blog e redes sociais.",
  alternates: { canonical: "https://www.eyagencia.com.br/links" },
  openGraph: { title: "EYAgencia | Links Oficiais", description: "Estratégia, tecnologia e resultados. Encontre nossos links, soluções e canais.", url: "https://www.eyagencia.com.br/links", images: ["/eyagencia-logo-verde.png"], type: "website" },
};
export default function LinksLayout({ children }: Readonly<{children: React.ReactNode}>) { return children; }
