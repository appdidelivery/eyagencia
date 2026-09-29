import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { editorial } from "../data";

export const metadata: Metadata = {
  title: "Metodologia Editorial da Central de IA | EyAgencia",
  description:
    "Conheça os critérios de pesquisa, revisão, fontes, transparência e atualização usados pela EyAgencia na Central de IA para E-commerce 2026.",
  alternates: {
    canonical: "https://eyagencia.com.br/ia-ecommerce/metodologia",
  },
  openGraph: {
    title: "Metodologia Editorial | IA para E-commerce — EyAgencia",
    description:
      "Critérios de pesquisa, fontes primárias, revisão e transparência da Central de Inteligência da EyAgencia.",
    url: "https://eyagencia.com.br/ia-ecommerce/metodologia",
    siteName: "EyAgencia",
    locale: "pt_BR",
    type: "article",
    images: [{
      url: "/ia-ecommerce/opengraph-image",
      width: 1200,
      height: 630,
      alt: "Metodologia editorial da Central de IA para E-commerce da EyAgencia",
    }],
  },
};

const criteria = [
  {
    title: "1. Aplicação real em e-commerce",
    text: "A ferramenta precisa ter uso verificável em pelo menos um ponto da jornada ou da operação: aquisição, catálogo, busca, atendimento, CRM, conversão, dados, precificação, logística ou automação.",
  },
  {
    title: "2. Fonte primária antes de opinião",
    text: "Priorizamos documentação oficial, centrais de ajuda, changelogs e páginas institucionais do produto. Conteúdo de terceiros pode complementar contexto, mas não substitui a fonte primária para recursos, disponibilidade e limitações.",
  },
  {
    title: "3. Limitações entram na análise",
    text: "Beta, elegibilidade, idioma, dependência de plataforma, requisitos de dados e necessidade de supervisão são tratados como parte da ficha — não como rodapé opcional.",
  },
  {
    title: "4. Métrica antes de entusiasmo",
    text: "Toda adoção deve ter uma hipótese mensurável. Tempo economizado, taxa de resolução, conversão, AOV, ROAS, margem ou retenção são exemplos de indicadores usados para decidir se a tecnologia merece escala.",
  },
  {
    title: "5. Atualização e rastreabilidade",
    text: "As fichas registram data de revisão e apontam para a documentação oficial. Quando um recurso muda de estágio ou disponibilidade, a página deve ser atualizada em vez de manter uma descrição histórica como se fosse atual.",
  },
  {
    title: "6. Sem ranking geral",
    text: "A Central não usa uma classificação única de “melhor IA”. Ferramentas resolvem problemas diferentes, dependem de stacks diferentes e precisam ser comparadas pelo contexto da operação.",
  },
];

export default function MethodologyPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://eyagencia.com.br/ia-ecommerce/metodologia#page",
        name: "Metodologia Editorial da Central de IA para E-commerce",
        url: "https://eyagencia.com.br/ia-ecommerce/metodologia",
        dateModified: "2026-09-29",
        publisher: {
          "@type": "Organization",
          name: "EyAgencia",
          url: "https://eyagencia.com.br",
        },
        about: [
          "Inteligência artificial para e-commerce",
          "Metodologia editorial",
          "E-E-A-T",
          "GEO",
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://eyagencia.com.br" },
          { "@type": "ListItem", position: 2, name: "IA para E-commerce", item: "https://eyagencia.com.br/ia-ecommerce" },
          { "@type": "ListItem", position: 3, name: "Metodologia Editorial", item: "https://eyagencia.com.br/ia-ecommerce/metodologia" },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Header theme="light" />

      <section className="border-b border-slate-200 bg-slate-50 px-6 pb-16 pt-36 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <nav className="text-sm font-semibold text-slate-500">
            <Link href="/ia-ecommerce" className="hover:text-[#275c58]">IA para E-commerce</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800">Metodologia editorial</span>
          </nav>

          <span className="mt-8 inline-flex text-xs font-black uppercase tracking-[0.18em] text-[#b54d24]">
            Transparência editorial
          </span>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
            Como pesquisamos a Central de IA para E-commerce
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-600">
            O objetivo da Central é ser útil para decisão de negócio. Por isso,
            conteúdo, SEO e GEO são tratados junto com fonte, contexto,
            limitação e métrica. Não publicamos uma tecnologia apenas porque
            está em alta.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6">
            {criteria.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <h2 className="text-xl font-black">{item.title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-zinc-950 p-8 text-white">
              <span className="text-xs font-black uppercase tracking-widest text-[#f0815b]">Hierarquia de fonte</span>
              <ol className="mt-5 space-y-3 text-sm leading-6 text-zinc-300">
                <li>1. Documentação oficial e changelog</li>
                <li>2. Página oficial do produto ou recurso</li>
                <li>3. Estudos de caso com metodologia identificável</li>
                <li>4. Fontes independentes para contexto complementar</li>
              </ol>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <span className="text-xs font-black uppercase tracking-widest text-[#275c58]">Revisão</span>
              <p className="mt-5 leading-7 text-slate-600">
                Última revisão geral: <strong className="text-slate-900">{editorial.updatedAt}</strong>.
                Cada ficha também carrega sua própria data de verificação e link
                para a fonte primária utilizada.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-slate-200 p-7">
            <h2 className="text-xl font-black">Correções e atualizações</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Recursos de IA mudam rapidamente. Se uma documentação oficial
              alterar disponibilidade, escopo ou funcionamento, a Central deve
              refletir essa mudança. O conteúdo é mantido pela EyAgencia como
              material editorial próprio, com foco em aplicação prática para
              e-commerce.
            </p>
            <Link href="/ia-ecommerce" className="mt-5 inline-flex text-sm font-black text-[#275c58]">
              Voltar para a Central de IA →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
