import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { guides } from "./data";

export const metadata: Metadata = {
  title: "Guias de IA para E-commerce 2026 | EyAgencia",
  description:
    "Guias editoriais sobre IA aplicada ao e-commerce: Nuvemshop, Tray, GA4, GEO, commerce agentivo, medição e operação.",
  alternates: {
    canonical: "https://eyagencia.com.br/ia-ecommerce/guias",
  },
  openGraph: {
    title: "Guias de IA para E-commerce 2026 | EyAgencia",
    description:
      "Conteúdo editorial próprio sobre inteligência artificial aplicada a operações de e-commerce.",
    url: "https://eyagencia.com.br/ia-ecommerce/guias",
    siteName: "EyAgencia",
    locale: "pt_BR",
    type: "website",
    images: [{
      url: "/ia-ecommerce/opengraph-image",
      width: 1200,
      height: 630,
      alt: "Guias de IA para E-commerce — EyAgencia",
    }],
  },
};

export default function GuidesIndexPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://eyagencia.com.br/ia-ecommerce/guias#page",
        name: "Guias de IA para E-commerce 2026",
        url: "https://eyagencia.com.br/ia-ecommerce/guias",
        dateModified: "2026-09-29",
        publisher: {
          "@type": "Organization",
          name: "EyAgencia",
          url: "https://eyagencia.com.br",
        },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: guides.length,
          itemListElement: guides.map((guide, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `https://eyagencia.com.br/ia-ecommerce/guias/${guide.slug}`,
            name: guide.title,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://eyagencia.com.br" },
          { "@type": "ListItem", position: 2, name: "IA para E-commerce", item: "https://eyagencia.com.br/ia-ecommerce" },
          { "@type": "ListItem", position: 3, name: "Guias", item: "https://eyagencia.com.br/ia-ecommerce/guias" },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Header theme="light" />

      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50 px-6 pb-16 pt-36 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(39,92,88,0.12),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(240,129,91,0.10),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <nav className="text-sm font-semibold text-slate-500">
              <Link href="/ia-ecommerce" className="hover:text-[#275c58]">IA para E-commerce</Link>
              <span className="mx-2">/</span>
              <span className="text-slate-800">Guias</span>
            </nav>
            <span className="mt-8 inline-flex text-xs font-black uppercase tracking-[0.18em] text-[#b54d24]">
              Conteúdo editorial próprio
            </span>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
              Guias de IA para E-commerce em 2026
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Conteúdo para quem precisa decidir e executar: como aplicar IA em
              plataforma, aquisição, analytics, GEO e operação sem transformar
              automação em ruído.
            </p>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-white bg-white p-2 shadow-xl">
            <Image
              src="/ia-ecommerce/hero-ia-ecommerce.svg"
              alt="Ecossistema visual de inteligência artificial aplicada ao e-commerce"
              width={1200}
              height={800}
              priority
              className="h-auto w-full rounded-[1.6rem]"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          {guides.map((guide, index) => (
            <article
              key={guide.slug}
              className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#b54d24]">
                  {guide.eyebrow}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {guide.readTime}
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-black leading-tight tracking-tight group-hover:text-[#275c58]">
                <Link href={`/ia-ecommerce/guias/${guide.slug}`}>
                  {guide.title}
                </Link>
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {guide.description}
              </p>
              <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                <span className="text-xs font-semibold text-slate-400">
                  Revisado em {guide.updatedAt}
                </span>
                <Link
                  href={`/ia-ecommerce/guias/${guide.slug}`}
                  className="text-sm font-black text-[#275c58]"
                >
                  Ler guia →
                </Link>
              </div>
              {index === 0 && (
                <div className="mt-5 rounded-xl bg-[#275c58]/8 px-4 py-3 text-xs font-bold text-[#275c58]">
                  Comece aqui se sua loja usa Nuvemshop.
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-6 py-14 lg:px-8">
        <div className="mx-auto max-w-5xl text-sm leading-7 text-slate-600">
          <strong className="text-slate-900">Política editorial:</strong> os
          guias usam fontes primárias, registram data de revisão e distinguem
          recurso disponível, beta e recomendação operacional da EyAgencia.{" "}
          <Link href="/ia-ecommerce/metodologia" className="font-black text-[#275c58]">
            Ver metodologia completa →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
