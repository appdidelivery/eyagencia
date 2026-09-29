import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { categories, editorial, faqs, tools } from "./data";
import { guides } from "./guias/data";

export const metadata: Metadata = {
  title: "IA para E-commerce 2026: Ferramentas e Aplicações | EyAgencia",
  description:
    "Guia atualizado de inteligência artificial para e-commerce em 2026: agentes, atendimento, CRM, mídia, personalização, conteúdo, busca e commerce agentivo.",
  keywords: [
    "IA para e-commerce",
    "inteligência artificial e-commerce 2026",
    "ferramentas de IA para lojas virtuais",
    "agentes de IA para e-commerce",
    "commerce agentivo",
    "IA para lojistas",
    "automação e-commerce",
    "GEO para e-commerce",
  ],
  alternates: {
    canonical: "https://eyagencia.com.br/ia-ecommerce",
  },
  openGraph: {
    title: "IA para E-commerce 2026 | Guia EyAgencia",
    description:
      "Mapa prático das ferramentas de IA que já estão mudando aquisição, conversão, atendimento e operação no e-commerce.",
    url: "https://eyagencia.com.br/ia-ecommerce",
    siteName: "EyAgencia",
    locale: "pt_BR",
    type: "article",
    images: [
      {
        url: "/ia-ecommerce/opengraph-image",
        width: 1200,
        height: 630,
        alt: "IA para E-commerce 2026 — Central de Inteligência EyAgencia",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function IAEcommercePage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://eyagencia.com.br/ia-ecommerce#page",
        name: "IA para E-commerce 2026",
        url: "https://eyagencia.com.br/ia-ecommerce",
        description:
          "Guia editorial da EyAgencia sobre ferramentas e aplicações de inteligência artificial para e-commerce em 2026.",
        dateModified: "2026-09-29",
        primaryImageOfPage: {
          "@type": "ImageObject",
          contentUrl: "https://eyagencia.com.br/ia-ecommerce/opengraph-image",
          caption: "IA para E-commerce 2026 — Central de Inteligência EyAgencia",
        },
        isPartOf: {
          "@type": "WebSite",
          name: "EyAgencia",
          url: "https://eyagencia.com.br",
        },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: tools.map((tool, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "SoftwareApplication",
              name: tool.name,
              applicationCategory: tool.category,
              url: `https://eyagencia.com.br/ia-ecommerce/ferramentas/${tool.slug}`,
              sameAs: tool.source,
              creator: {
                "@type": "Organization",
                name: tool.company,
              },
            },
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://eyagencia.com.br",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "IA para E-commerce",
            item: "https://eyagencia.com.br/ia-ecommerce",
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Header theme="light" />

      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50 px-6 pb-20 pt-36 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(39,92,88,0.14),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(240,129,91,0.12),transparent_34%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <span className="inline-flex rounded-full border border-[#275c58]/20 bg-[#275c58]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#275c58]">
              Central de Inteligência • Atualizado em 29/09/2026
            </span>

            <h1 className="mt-7 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              IA para E-commerce em 2026:
              <span className="block text-[#275c58]">
                ferramentas, agentes e aplicações
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Um mapa prático para lojistas e gestores entenderem onde a
              inteligência artificial já impacta aquisição, conversão,
              atendimento, CRM, conteúdo e operação. Sem lista genérica:
              organizamos cada tecnologia pelo problema de negócio que ela
              ajuda a resolver.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#ferramentas"
                className="rounded-md bg-[#275c58] px-7 py-4 text-center text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#1f4a46]"
              >
                Explorar ferramentas
              </a>
              <Link
                href="/#diagnostico"
                className="rounded-md border border-slate-300 bg-white px-7 py-4 text-center text-sm font-black text-slate-900 transition hover:border-[#f0815b] hover:text-[#b54d24]"
              >
                Diagnóstico para meu e-commerce
              </Link>
            </div>
          </div>

          <figure className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-[#275c58]/16 via-transparent to-[#f0815b]/16 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-2 shadow-2xl shadow-slate-900/10">
              <Image
                src="/ia-ecommerce/hero-ia-ecommerce.svg"
                alt="Mapa visual de inteligência artificial aplicada ao e-commerce, conectando SEO e GEO, mídia, CRM, atendimento, analytics e agentes de IA"
                width={1200}
                height={800}
                priority
                className="h-auto w-full rounded-[1.55rem]"
              />
            </div>
            <figcaption className="mt-4 text-center text-xs leading-5 text-slate-500">
              Ecossistema de IA aplicado ao e-commerce: descoberta, aquisição,
              conversão, relacionamento, dados e operação.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-6 py-12 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="text-xs font-black uppercase tracking-widest text-[#b54d24]">
              Mudança 01
            </div>
            <h2 className="mt-3 text-xl font-black">Da busca para a conversa</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Produtos já podem ser descobertos em experiências conversacionais
              como o ChatGPT. Para lojistas, catálogo, disponibilidade,
              metadados e estrutura de produto passam a influenciar novos
              canais de descoberta.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="text-xs font-black uppercase tracking-widest text-[#b54d24]">
              Mudança 02
            </div>
            <h2 className="mt-3 text-xl font-black">De copiloto para agente</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Ferramentas como Sidekick e agentes especializados já conseguem
              analisar contexto da loja, executar tarefas e apoiar decisões, em
              vez de apenas gerar texto.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="text-xs font-black uppercase tracking-widest text-[#b54d24]">
              Mudança 03
            </div>
            <h2 className="mt-3 text-xl font-black">IA dentro da mídia</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              A otimização de Shopping, criativos e páginas de destino está
              cada vez mais integrada aos sistemas de IA das próprias
              plataformas de aquisição.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-[#b54d24]">
              Taxonomia EyAgencia
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Onde a IA já está entrando na operação do lojista
            </h2>
            <p className="mt-4 text-slate-600">
              Esta central será expandida continuamente com novas ferramentas,
              integrações, casos de uso e páginas individuais.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/ia-ecommerce/${category.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#275c58]/40 hover:shadow-lg"
              >
                <h3 className="text-lg font-black text-slate-900 group-hover:text-[#275c58]">
                  {category.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {category.description}
                </p>
                <span className="mt-5 inline-flex text-xs font-black uppercase tracking-wider text-[#b54d24]">
                  Explorar categoria →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="ferramentas" className="bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#b54d24]">
                Radar 2026
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Ferramentas para acompanhar agora
              </h2>
              <p className="mt-4 text-slate-600">
                Não é um ranking. É uma seleção editorial de tecnologias com
                aplicação clara em e-commerce e documentação oficial ativa em
                2026.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <div className="rounded-xl bg-[#275c58]/10 px-4 py-3 text-xs font-bold text-[#275c58]">
                {tools.length} tecnologias verificadas
              </div>
              <Link
                href="/ia-ecommerce/ferramentas"
                className="text-sm font-black text-[#b54d24] hover:text-[#933d1b]"
              >
                Ver catálogo completo →
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {tools.slice(0, 8).map((tool) => (
              <article
                key={tool.name}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#275c58]/10 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-[#275c58]">
                    {tool.category}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                    {tool.status}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-black text-slate-950">
                  <Link href={`/ia-ecommerce/ferramentas/${tool.slug}`} className="hover:text-[#275c58]">
                    {tool.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  {tool.company}
                </p>

                <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
                  <p>
                    <strong className="text-slate-900">Aplicação:</strong>{" "}
                    {tool.useCase}
                  </p>
                  <p>
                    <strong className="text-slate-900">Faz mais sentido para:</strong>{" "}
                    {tool.bestFor}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/ia-ecommerce/ferramentas/${tool.slug}`}
                    className="inline-flex text-sm font-black text-[#275c58] hover:text-[#1f4a46]"
                  >
                    Análise completa →
                  </Link>
                  <a
                    href={tool.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex text-sm font-black text-[#b54d24] hover:text-[#933d1b]"
                  >
                    Fonte oficial ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/ia-ecommerce/ferramentas"
              className="inline-flex rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-800 transition hover:border-[#275c58] hover:text-[#275c58]"
            >
              Explorar todas as {tools.length} ferramentas verificadas →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#b54d24]">
                Guias editoriais
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Da ferramenta para a execução
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                A biblioteca editorial conecta tecnologia, processo e métrica.
                Cada guia parte de documentação oficial e termina em uma forma
                prática de aplicar ou medir o recurso na operação.
              </p>
            </div>
            <Link href="/ia-ecommerce/guias" className="text-sm font-black text-[#275c58]">
              Ver todos os guias →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {guides.slice(0, 4).map((guide) => (
              <article key={guide.slug} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-[#b54d24]">
                    {guide.eyebrow}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{guide.readTime}</span>
                </div>
                <h3 className="mt-4 text-2xl font-black leading-tight">
                  <Link href={`/ia-ecommerce/guias/${guide.slug}`} className="hover:text-[#275c58]">
                    {guide.title}
                  </Link>
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{guide.description}</p>
                <Link href={`/ia-ecommerce/guias/${guide.slug}`} className="mt-6 inline-flex text-sm font-black text-[#275c58]">
                  Ler guia →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.18em] text-[#b54d24]">
              Critério editorial e E-E-A-T
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              Como a EyAgencia pesquisa e revisa esta central
            </h2>
            <p className="mt-5 leading-7 text-slate-600">
              Esta página é mantida como material editorial e técnico. A seleção
              considera aplicação real em e-commerce, documentação primária,
              estágio de disponibilidade, limitações e métricas que permitem
              avaliar resultado no negócio.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Fontes primárias", "Priorizamos documentação oficial, centrais de ajuda, changelogs e páginas de produto das próprias plataformas."],
              ["Aplicação prática", "Cada tecnologia é relacionada a um gargalo operacional ou comercial e a indicadores que podem ser acompanhados."],
              ["Revisão e data", `Conteúdo revisado em ${editorial.updatedAt}. Recursos em beta ou com disponibilidade variável são sinalizados.`],
              ["Transparência", "A central não usa posição em lista paga como critério editorial e não publica um ranking geral de melhor ferramenta."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-black text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/ia-ecommerce/metodologia" className="inline-flex text-sm font-black text-[#275c58] hover:text-[#1f4a46]">
              Ler metodologia editorial completa →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 px-6 py-20 text-white lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.18em] text-[#f0815b]">
              Método EyAgencia
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Não comece pela ferramenta. Comece pelo gargalo.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-zinc-300">
              A adoção de IA tende a gerar mais resultado quando parte de um
              problema mensurável. Antes de integrar qualquer tecnologia,
              mapeie onde existe desperdício de tempo, perda de margem,
              abandono, CAC alto, baixa recompra ou falta de escala.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7">
            <ol className="space-y-5">
              {[
                "Identifique o gargalo com impacto financeiro.",
                "Meça a linha de base antes da automação.",
                "Escolha uma ferramenta compatível com seu stack.",
                "Implemente em um fluxo pequeno e controlado.",
                "Compare ganho de conversão, tempo, custo ou retenção.",
                "Escale somente depois de validar o resultado.",
              ].map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0815b] text-sm font-black text-zinc-950">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-sm leading-6 text-zinc-300">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-[#b54d24]">
              Perguntas frequentes
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              IA aplicada ao e-commerce
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-slate-200 bg-white p-6"
              >
                <summary className="cursor-pointer list-none font-black text-slate-900">
                  {faq.q}
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-[#275c58] p-8 text-white shadow-xl sm:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#f6b29a]">
                Próximo passo
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                Quer montar um stack de IA para a sua operação?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50">
                A EyAgencia pode mapear seus gargalos, dados, plataforma,
                mídia, CRM e atendimento antes de recomendar integrações.
              </p>
            </div>
            <Link
              href="/#diagnostico"
              className="rounded-md bg-[#f0815b] px-7 py-4 text-center text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#e27049]"
            >
              Solicitar diagnóstico
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl text-xs leading-6 text-slate-500">
          <p>
            <strong className="text-slate-700">Nota editorial:</strong>{" "}
            {editorial.methodology} Recursos, elegibilidade e disponibilidade
            podem mudar. Revisão editorial: {editorial.updatedAt}.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
