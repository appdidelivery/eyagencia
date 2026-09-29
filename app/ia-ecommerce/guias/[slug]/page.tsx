import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { categories, tools } from "../../data";
import { guides } from "../data";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) return {};

  return {
    title: `${guide.title} | EyAgencia`,
    description: guide.description,
    alternates: {
      canonical: `https://eyagencia.com.br/ia-ecommerce/guias/${guide.slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `https://eyagencia.com.br/ia-ecommerce/guias/${guide.slug}`,
      siteName: "EyAgencia",
      locale: "pt_BR",
      type: "article",
      images: [{
        url: "/ia-ecommerce/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${guide.title} — EyAgencia`,
      }],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();

  const relatedTools = tools.filter((tool) => guide.relatedTools.includes(tool.slug));
  const relatedCategories = categories.filter((category) => guide.relatedCategories.includes(category.slug));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://eyagencia.com.br/ia-ecommerce/guias/${guide.slug}#article`,
        headline: guide.title,
        description: guide.description,
        datePublished: "2026-09-29",
        dateModified: "2026-09-29",
        inLanguage: "pt-BR",
        image: "https://eyagencia.com.br/ia-ecommerce/opengraph-image",
        author: {
          "@type": "Organization",
          name: "EyAgencia",
          url: "https://eyagencia.com.br",
        },
        publisher: {
          "@type": "Organization",
          name: "EyAgencia",
          url: "https://eyagencia.com.br",
        },
        citation: guide.sources.map((source) => source.url),
        isPartOf: {
          "@type": "CollectionPage",
          name: "Guias de IA para E-commerce 2026",
          url: "https://eyagencia.com.br/ia-ecommerce/guias",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://eyagencia.com.br" },
          { "@type": "ListItem", position: 2, name: "IA para E-commerce", item: "https://eyagencia.com.br/ia-ecommerce" },
          { "@type": "ListItem", position: 3, name: "Guias", item: "https://eyagencia.com.br/ia-ecommerce/guias" },
          { "@type": "ListItem", position: 4, name: guide.title, item: `https://eyagencia.com.br/ia-ecommerce/guias/${guide.slug}` },
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
            <Link href="/ia-ecommerce" className="hover:text-[#275c58]">IA para E-commerce</Link>
            <span className="mx-2">/</span>
            <Link href="/ia-ecommerce/guias" className="hover:text-[#275c58]">Guias</Link>
          </nav>

          <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1fr_0.72fr]">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#b54d24]">
                {guide.eyebrow}
              </span>
              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
                {guide.title}
              </h1>
              <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-600">
                {guide.intro}
              </p>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
                <span>Por EyAgencia</span>
                <span>Revisado em {guide.updatedAt}</span>
                <span>{guide.readTime} de leitura</span>
              </div>
            </div>

            <figure>
              <div className="overflow-hidden rounded-[2rem] border border-white bg-white p-2 shadow-xl">
                <Image
                  src="/ia-ecommerce/hero-ia-ecommerce.svg"
                  alt={`Ilustração editorial da EyAgencia para o guia: ${guide.title}`}
                  width={1200}
                  height={800}
                  className="h-auto w-full rounded-[1.6rem]"
                />
              </div>
              <figcaption className="mt-3 text-center text-xs leading-5 text-slate-400">
                Central de Inteligência EyAgencia — IA aplicada a e-commerce.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-[#275c58] p-8 text-white">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-[#f6b29a]">
            Leitura executiva
          </span>
          <h2 className="mt-3 text-2xl font-black">O que você precisa levar deste guia</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {guide.keyTakeaways.map((item) => (
              <li key={item} className="rounded-2xl bg-white/8 p-5 text-sm leading-7 text-emerald-50">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <article className="px-6 pb-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-14">
            {guide.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-3xl font-black tracking-tight">{section.title}</h2>
                <div className="mt-5 space-y-5 text-[17px] leading-8 text-slate-600">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-6 grid gap-3">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                        <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#f0815b]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </article>

      <section className="border-y border-slate-200 bg-slate-50 px-6 py-14 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-[#b54d24]">
            Fontes verificadas
          </span>
          <h2 className="mt-3 text-2xl font-black">Documentação usada nesta revisão</h2>
          <div className="mt-6 grid gap-4">
            {guide.sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-200 bg-white p-5 text-sm font-bold text-[#275c58] shadow-sm transition hover:border-[#275c58]/40"
              >
                {source.label} ↗
              </a>
            ))}
          </div>
          <p className="mt-6 text-xs leading-6 text-slate-500">
            A EyAgencia prioriza fontes primárias para recursos, disponibilidade
            e limitações. Recomendações operacionais são interpretação editorial
            da EyAgencia sobre como aplicar esses recursos em e-commerce.
          </p>
        </div>
      </section>

      {(relatedTools.length > 0 || relatedCategories.length > 0) && (
        <section className="px-6 py-14 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-black">Continue a pesquisa</h2>
            {relatedTools.length > 0 && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {relatedTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/ia-ecommerce/ferramentas/${tool.slug}`}
                    className="rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="text-xs font-black uppercase tracking-wider text-[#275c58]">{tool.company}</div>
                    <div className="mt-2 text-lg font-black">{tool.name}</div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{tool.status}</p>
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {relatedCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/ia-ecommerce/${category.slug}`}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-[#275c58] hover:text-[#275c58]"
                >
                  {category.title}
                </Link>
              ))}
              <Link
                href="/ia-ecommerce/metodologia"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-[#275c58] hover:text-[#275c58]"
              >
                Metodologia editorial
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 pb-16 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-zinc-950 p-8 text-white sm:p-10">
          <h2 className="text-2xl font-black">Quer aplicar isso na sua operação?</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
            A EyAgencia pode mapear plataforma, catálogo, mensuração, conteúdo e
            gargalos antes de definir o stack de IA. A tecnologia entra depois
            da hipótese de negócio.
          </p>
          <Link
            href="/#diagnostico"
            className="mt-6 inline-flex rounded-md bg-[#f0815b] px-6 py-3 text-sm font-black text-slate-950"
          >
            Solicitar diagnóstico
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
