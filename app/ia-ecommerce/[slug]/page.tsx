import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { categories, editorial, tools } from "../data";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) return {};

  return {
    title: `${category.title}: IA para E-commerce 2026 | EyAgencia`,
    description: category.intro,
    alternates: {
      canonical: `https://eyagencia.com.br/ia-ecommerce/${category.slug}`,
    },
    openGraph: {
      title: `${category.title} | IA para E-commerce 2026`,
      description: category.description,
      url: `https://eyagencia.com.br/ia-ecommerce/${category.slug}`,
      siteName: "EyAgencia",
      locale: "pt_BR",
      type: "article",
      images: [{
        url: "/ia-ecommerce/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${category.title} — IA para E-commerce 2026`,
      }],
    },
  };
}

export default async function IACategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const categoryTools = tools.filter((tool) => tool.categorySlug === category.slug);
  const related = categories.filter((item) => category.related.includes(item.slug));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `https://eyagencia.com.br/ia-ecommerce/${category.slug}#page`,
        name: `${category.title} — IA para E-commerce 2026`,
        url: `https://eyagencia.com.br/ia-ecommerce/${category.slug}`,
        description: category.intro,
        dateModified: "2026-09-29",
        publisher: {
          "@type": "Organization",
          name: editorial.publisher,
          url: "https://eyagencia.com.br",
        },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: categoryTools.map((tool, index) => ({
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
          { "@type": "ListItem", position: 3, name: category.title, item: `https://eyagencia.com.br/ia-ecommerce/${category.slug}` },
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
            <Link href="/" className="hover:text-[#275c58]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/ia-ecommerce" className="hover:text-[#275c58]">IA para E-commerce</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800">{category.title}</span>
          </nav>

          <div className="mt-8 max-w-4xl">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-[#b54d24]">Guia por aplicação</span>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">{category.title}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">{category.intro}</p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <span className="text-xs font-black uppercase tracking-widest text-[#275c58]">Pergunta de negócio</span>
            <h2 className="mt-3 text-2xl font-black leading-tight">{category.businessQuestion}</h2>
            <p className="mt-5 leading-7 text-slate-600">
              A ferramenta vem depois. Primeiro, estabeleça uma linha de base e defina qual comportamento, custo ou receita precisa mudar. Isso permite separar inovação útil de adoção apenas por tendência.
            </p>
          </article>

          <aside className="rounded-2xl bg-zinc-950 p-8 text-white">
            <span className="text-xs font-black uppercase tracking-widest text-[#f0815b]">O que medir</span>
            <ul className="mt-5 space-y-3">
              {category.metrics.map((metric) => (
                <li key={metric} className="flex gap-3 text-sm leading-6 text-zinc-300">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#f0815b]" />
                  {metric}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#b54d24]">Ferramentas verificadas</span>
              <h2 className="mt-3 text-3xl font-black">Tecnologias relacionadas</h2>
            </div>
            <Link href="/ia-ecommerce#ferramentas" className="text-sm font-black text-[#275c58] hover:text-[#1f4a46]">
              Ver radar completo →
            </Link>
          </div>

          {categoryTools.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {categoryTools.map((tool) => (
                <article key={tool.slug} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="text-xs font-black uppercase tracking-wider text-[#275c58]">{tool.company}</div>
                  <h3 className="mt-3 text-2xl font-black">{tool.name}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{tool.useCase}</p>
                  <Link href={`/ia-ecommerce/ferramentas/${tool.slug}`} className="mt-6 inline-flex text-sm font-black text-[#b54d24] hover:text-[#933d1b]">
                    Análise completa →
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8">
              <p className="leading-7 text-slate-600">
                Esta categoria faz parte do mapa editorial da EyAgencia e receberá fichas individuais conforme as tecnologias forem verificadas. Mantemos a página ativa para organizar o tema sem publicar comparações superficiais.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-black">Continue a pesquisa</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {related.map((item) => (
              <Link key={item.slug} href={`/ia-ecommerce/${item.slug}`} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-[#275c58] hover:text-[#275c58]">
                {item.title}
              </Link>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-7 text-sm leading-7 text-slate-600">
            <strong className="text-slate-900">Critério editorial EyAgencia:</strong> {editorial.methodology} Atualizado em {editorial.updatedAt}.
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
