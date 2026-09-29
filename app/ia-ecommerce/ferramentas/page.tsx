import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { categories, editorial, tools } from "../data";

export const metadata: Metadata = {
  title: "Ferramentas de IA para E-commerce em 2026 | EyAgencia",
  description:
    "Catálogo editorial de ferramentas de IA para e-commerce: agentes, busca, atendimento, CRM, Ads, GEO, imagem, analytics, precificação, logística e commerce agentivo.",
  alternates: {
    canonical: "https://eyagencia.com.br/ia-ecommerce/ferramentas",
  },
  openGraph: {
    title: "Ferramentas de IA para E-commerce 2026 | EyAgencia",
    description:
      "Catálogo editorial com aplicações, métricas, limitações e fontes oficiais de tecnologias de IA para e-commerce.",
    url: "https://eyagencia.com.br/ia-ecommerce/ferramentas",
    siteName: "EyAgencia",
    locale: "pt_BR",
    type: "website",
    images: [{
      url: "/ia-ecommerce/opengraph-image",
      width: 1200,
      height: 630,
      alt: "Ferramentas de IA para E-commerce 2026 — EyAgencia",
    }],
  },
};

export default function ToolsIndexPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://eyagencia.com.br/ia-ecommerce/ferramentas#page",
        name: "Ferramentas de IA para E-commerce em 2026",
        url: "https://eyagencia.com.br/ia-ecommerce/ferramentas",
        description:
          "Catálogo editorial da EyAgencia com ferramentas de inteligência artificial aplicadas ao e-commerce.",
        dateModified: "2026-09-29",
        publisher: {
          "@type": "Organization",
          name: "EyAgencia",
          url: "https://eyagencia.com.br",
        },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: tools.length,
          itemListElement: tools.map((tool, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `https://eyagencia.com.br/ia-ecommerce/ferramentas/${tool.slug}`,
            name: tool.name,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://eyagencia.com.br" },
          { "@type": "ListItem", position: 2, name: "IA para E-commerce", item: "https://eyagencia.com.br/ia-ecommerce" },
          { "@type": "ListItem", position: 3, name: "Ferramentas", item: "https://eyagencia.com.br/ia-ecommerce/ferramentas" },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Header theme="light" />

      <section className="border-b border-slate-200 bg-slate-50 px-6 pb-16 pt-36 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="text-sm font-semibold text-slate-500">
            <Link href="/" className="hover:text-[#275c58]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/ia-ecommerce" className="hover:text-[#275c58]">IA para E-commerce</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800">Ferramentas</span>
          </nav>

          <div className="mt-8 max-w-4xl">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-[#b54d24]">
              Catálogo editorial • {tools.length} tecnologias verificadas
            </span>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
              Ferramentas de IA para E-commerce em 2026
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              A tecnologia aparece aqui somente depois de verificarmos aplicação
              prática, fonte primária e limites de uso. As fichas não funcionam
              como ranking: servem para comparar o problema que cada solução
              resolve e quais métricas devem validar a adoção.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const count = tools.filter((tool) => tool.categorySlug === category.slug).length;
              return (
                <Link
                  key={category.slug}
                  href={`/ia-ecommerce/${category.slug}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#275c58]/40 hover:shadow-lg"
                >
                  <div className="text-sm font-black text-slate-900">{category.title}</div>
                  <div className="mt-2 text-xs font-bold text-[#275c58]">
                    {count} {count === 1 ? "tecnologia verificada" : "tecnologias verificadas"}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-14">
          {categories.map((category) => {
            const categoryTools = tools.filter((tool) => tool.categorySlug === category.slug);
            if (categoryTools.length === 0) return null;

            return (
              <section key={category.slug} aria-labelledby={`cat-${category.slug}`}>
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div className="max-w-3xl">
                    <h2 id={`cat-${category.slug}`} className="text-3xl font-black tracking-tight">
                      {category.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{category.description}</p>
                  </div>
                  <Link href={`/ia-ecommerce/${category.slug}`} className="text-sm font-black text-[#275c58]">
                    Guia da categoria →
                  </Link>
                </div>

                <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {categoryTools.map((tool) => (
                    <article key={tool.slug} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#275c58]/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#275c58]">
                          {tool.company}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                          {tool.status}
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-black text-slate-950">{tool.name}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{tool.useCase}</p>
                      <Link
                        href={`/ia-ecommerce/ferramentas/${tool.slug}`}
                        className="mt-5 inline-flex text-sm font-black text-[#b54d24]"
                      >
                        Ver análise completa →
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-14 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-7 text-sm leading-7 text-slate-600">
          <strong className="text-slate-900">Metodologia editorial:</strong>{" "}
          {editorial.methodology} Revisão geral em {editorial.updatedAt}.{" "}
          <Link href="/ia-ecommerce/metodologia" className="font-black text-[#275c58]">
            Leia os critérios completos →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
