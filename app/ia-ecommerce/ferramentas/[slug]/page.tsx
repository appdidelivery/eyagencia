import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { categories, editorial, tools } from "../../data";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) return {};

  return {
    title: `${tool.name} no E-commerce: guia 2026 | EyAgencia`,
    description: `${tool.useCase} Veja aplicações, métricas, limitações e fonte oficial revisada pela EyAgencia.`,
    alternates: {
      canonical: `https://eyagencia.com.br/ia-ecommerce/ferramentas/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.name} para E-commerce | EyAgencia`,
      description: tool.useCase,
      url: `https://eyagencia.com.br/ia-ecommerce/ferramentas/${tool.slug}`,
      siteName: "EyAgencia",
      locale: "pt_BR",
      type: "article",
      images: [{
        url: "/ia-ecommerce/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${tool.name} para E-commerce — análise EyAgencia`,
      }],
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) notFound();

  const category = categories.find((item) => item.slug === tool.categorySlug);
  const relatedTools = tools.filter((item) => item.categorySlug === tool.categorySlug && item.slug !== tool.slug).slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `https://eyagencia.com.br/ia-ecommerce/ferramentas/${tool.slug}#article`,
        headline: `${tool.name} no E-commerce: guia 2026`,
        description: tool.useCase,
        dateModified: "2026-09-29",
        datePublished: "2026-09-29",
        author: { "@type": "Organization", name: "EyAgencia", url: "https://eyagencia.com.br" },
        publisher: { "@type": "Organization", name: "EyAgencia", url: "https://eyagencia.com.br" },
        mainEntity: {
          "@type": "SoftwareApplication",
          name: tool.name,
          applicationCategory: tool.category,
          creator: { "@type": "Organization", name: tool.company },
          url: tool.source,
        },
        citation: tool.source,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://eyagencia.com.br" },
          { "@type": "ListItem", position: 2, name: "IA para E-commerce", item: "https://eyagencia.com.br/ia-ecommerce" },
          { "@type": "ListItem", position: 3, name: category?.title ?? tool.category, item: `https://eyagencia.com.br/ia-ecommerce/${tool.categorySlug}` },
          { "@type": "ListItem", position: 4, name: tool.name, item: `https://eyagencia.com.br/ia-ecommerce/ferramentas/${tool.slug}` },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Header theme="light" />

      <section className="border-b border-slate-200 bg-slate-50 px-6 pb-16 pt-36 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <nav className="text-sm font-semibold text-slate-500">
            <Link href="/ia-ecommerce" className="hover:text-[#275c58]">IA para E-commerce</Link>
            <span className="mx-2">/</span>
            <Link href={`/ia-ecommerce/${tool.categorySlug}`} className="hover:text-[#275c58]">{category?.title ?? tool.category}</Link>
          </nav>

          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#275c58]/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#275c58]">{tool.category}</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">{tool.status}</span>
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">{tool.name}</h1>
            <p className="mt-3 text-lg font-bold text-slate-500">{tool.company}</p>
            <p className="mt-6 text-lg leading-8 text-slate-600">{tool.useCase}</p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <article>
            <h2 className="text-3xl font-black">Onde faz sentido no e-commerce</h2>
            <p className="mt-5 leading-8 text-slate-600">{tool.bestFor}</p>

            <h2 className="mt-12 text-2xl font-black">Aplicações práticas</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {tool.practicalUses.map((item) => (
                <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm font-semibold leading-6 text-slate-700">{item}</li>
              ))}
            </ul>

            <h2 className="mt-12 text-2xl font-black">O que validar antes de adotar</h2>
            <ul className="mt-5 space-y-3">
              {tool.attention.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-7 text-slate-600">
                  <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#f0815b]" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-zinc-950 p-7 text-white">
              <span className="text-xs font-black uppercase tracking-widest text-[#f0815b]">Indicadores</span>
              <h2 className="mt-3 text-xl font-black">Como medir resultado</h2>
              <ul className="mt-5 space-y-3">
                {tool.metrics.map((metric) => (
                  <li key={metric} className="text-sm leading-6 text-zinc-300">{metric}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-7">
              <span className="text-xs font-black uppercase tracking-widest text-[#275c58]">Fonte primária</span>
              <p className="mt-3 text-sm leading-7 text-slate-600">{tool.sourceLabel}</p>
              <a href={tool.source} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-black text-[#b54d24] hover:text-[#933d1b]">
                Consultar documentação oficial →
              </a>
              <p className="mt-5 text-xs text-slate-400">Revisado em {tool.reviewedAt}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-black">Ferramentas relacionadas</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {relatedTools.length > 0 ? relatedTools.map((item) => (
              <Link key={item.slug} href={`/ia-ecommerce/ferramentas/${item.slug}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="text-xs font-black uppercase tracking-wider text-[#275c58]">{item.company}</div>
                <div className="mt-2 text-lg font-black">{item.name}</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.status}</p>
              </Link>
            )) : (
              <Link href={`/ia-ecommerce/${tool.categorySlug}`} className="rounded-2xl border border-slate-200 bg-white p-6 font-black text-[#275c58]">
                Explorar {category?.title ?? tool.category} →
              </Link>
            )}
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-7 text-sm leading-7 text-slate-600">
            <strong className="text-slate-900">Transparência editorial:</strong> {editorial.methodology} Esta ficha não é uma recomendação comercial automática nem uma classificação de “melhor ferramenta”.{" "}
            <Link href="/ia-ecommerce/metodologia" className="font-black text-[#275c58]">Metodologia completa →</Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-[#275c58] p-8 text-white sm:p-12">
          <h2 className="text-3xl font-black">Quer avaliar se {tool.name} faz sentido no seu stack?</h2>
          <p className="mt-4 max-w-2xl leading-7 text-emerald-50">A decisão deve considerar plataforma, dados, volume, equipe, margem e processo atual. A EyAgencia pode mapear o gargalo antes da integração.</p>
          <Link href="/#diagnostico" className="mt-7 inline-flex rounded-md bg-[#f0815b] px-7 py-4 text-sm font-black text-slate-950">Solicitar diagnóstico</Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
