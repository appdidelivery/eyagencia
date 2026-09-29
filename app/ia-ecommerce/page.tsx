import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

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
        url: "/eyagencia-logo-verde.png",
        width: 1200,
        height: 630,
        alt: "EyAgencia — IA para E-commerce 2026",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const categories = [
  {
    title: "Agentes e operação",
    description:
      "Copilotos e agentes que analisam dados, executam tarefas e reduzem trabalho operacional.",
  },
  {
    title: "Atendimento e vendas",
    description:
      "Assistentes que respondem dúvidas, recomendam produtos e apoiam pré e pós-venda.",
  },
  {
    title: "CRM e automação",
    description:
      "IA aplicada a segmentação, jornadas, campanhas, retenção e relacionamento.",
  },
  {
    title: "Busca e descoberta",
    description:
      "Busca semântica, recomendação e descoberta de produtos com intenção mais complexa.",
  },
  {
    title: "Personalização e CRO",
    description:
      "Experiências, vitrines e ofertas adaptadas ao comportamento do comprador.",
  },
  {
    title: "Ads e aquisição",
    description:
      "Otimização de mídia, criativos, segmentação e Shopping com modelos de IA.",
  },
  {
    title: "Conteúdo, SEO e GEO",
    description:
      "Conteúdo, catálogo e estrutura técnica preparados para busca tradicional e respostas de IA.",
  },
  {
    title: "Imagem e vídeo",
    description:
      "Criação e edição de ativos de produto, anúncios e conteúdo em escala.",
  },
  {
    title: "Analytics e BI",
    description:
      "Leitura de dados, detecção de padrões e apoio à tomada de decisão.",
  },
  {
    title: "Precificação",
    description:
      "Monitoramento competitivo e suporte algorítmico a decisões de preço.",
  },
  {
    title: "Logística e operação",
    description:
      "Previsão, roteirização, atendimento operacional e automação de backoffice.",
  },
  {
    title: "Commerce agentivo",
    description:
      "Produtos descobertos, comparados e comprados dentro de interfaces conversacionais.",
  },
];

const tools = [
  {
    name: "ChatGPT Shopping & Merchant Feeds",
    company: "OpenAI",
    category: "Commerce agentivo",
    status: "Canal de descoberta e compra",
    useCase:
      "Expor produtos em experiências de compra do ChatGPT e manter catálogo atualizado por integrações e feeds elegíveis.",
    bestFor:
      "Lojistas que querem preparar catálogo, metadados e presença para descoberta em interfaces de IA.",
    url: "https://help.openai.com/pt-br/articles/11128490-shopping-with-chatgpt-search",
  },
  {
    name: "Sidekick",
    company: "Shopify",
    category: "Agentes e operação",
    status: "Assistente nativo da plataforma",
    useCase:
      "Analisar dados, editar produtos, criar conteúdo, automatizar tarefas e apoiar decisões dentro do admin da Shopify.",
    bestFor:
      "Operações Shopify que querem reduzir tarefas manuais sem sair do painel da loja.",
    url: "https://help.shopify.com/pt-BR/manual/ai-powered-tools/sidekick",
  },
  {
    name: "Shopify Magic",
    company: "Shopify",
    category: "Conteúdo, SEO e mídia",
    status: "Suite de IA nativa",
    useCase:
      "Gerar descrições, conteúdo, e-mails e mídia para acelerar a produção do catálogo e do marketing.",
    bestFor:
      "Times enxutos que precisam aumentar volume de conteúdo e ativos criativos.",
    url: "https://help.shopify.com/pt-BR/manual/ai-powered-tools/shopify-magic",
  },
  {
    name: "K:AI Customer Agent",
    company: "Klaviyo",
    category: "CRM e vendas",
    status: "Agente de relacionamento",
    useCase:
      "Atender compradores, usar contexto do catálogo e dados do cliente e oferecer recomendações personalizadas.",
    bestFor:
      "Marcas com estratégia forte de CRM, retenção e comunicação multicanal.",
    url: "https://www.klaviyo.com/solutions/ai/customer-agent/shopping-assistant",
  },
  {
    name: "AI Agent",
    company: "Gorgias",
    category: "Atendimento e vendas",
    status: "Agente de suporte e pré-venda",
    useCase:
      "Automatizar conversas de suporte e vendas em canais como chat, e-mail, SMS e redes sociais.",
    bestFor:
      "E-commerces com volume relevante de atendimento e dúvidas repetitivas.",
    url: "https://helpcenter.gorgias.com/en-US/ai-agent-explained-497772",
  },
  {
    name: "experience.AI + Huginn",
    company: "Nosto",
    category: "Personalização e CRO",
    status: "Personalização e agentes",
    useCase:
      "Personalizar busca, merchandising, recomendações e testes com inteligência sobre catálogo e comportamento.",
    bestFor:
      "Operações com tráfego suficiente para otimizar experiência e conversão de forma contínua.",
    url: "https://www.nosto.com/",
  },
  {
    name: "IA Max para Shopping",
    company: "Google Ads",
    category: "Ads e aquisição",
    status: "Beta em 2026",
    useCase:
      "Usar IA para ampliar relevância de criativos, termos e páginas de destino em pesquisas de compra mais complexas.",
    bestFor:
      "Varejistas que já trabalham com Merchant Center e campanhas de Shopping.",
    url: "https://support.google.com/google-ads/answer/17091277?hl=pt-BR",
  },
  {
    name: "Product Recommendations",
    company: "Adobe Commerce",
    category: "Personalização e recomendação",
    status: "Recomendação com Adobe AI",
    useCase:
      "Gerar recomendações personalizadas a partir de comportamento agregado de compradores e dados do catálogo.",
    bestFor:
      "Operações Adobe Commerce que querem automatizar cross-sell, up-sell e recomendação.",
    url: "https://experienceleague.adobe.com/pt-br/docs/commerce/product-recommendations/overview",
  },
];

const faqs = [
  {
    q: "Qual é a melhor IA para e-commerce em 2026?",
    a: "Não existe uma única ferramenta melhor para todas as operações. A escolha depende do gargalo: aquisição, atendimento, CRM, conteúdo, personalização, dados ou operação. Este guia organiza as soluções por aplicação para facilitar essa decisão.",
  },
  {
    q: "IA substitui a plataforma de e-commerce?",
    a: "Na maioria dos casos, não. A IA funciona como uma camada de inteligência sobre a plataforma, o catálogo, os dados e os canais de aquisição e relacionamento.",
  },
  {
    q: "O que é commerce agentivo?",
    a: "É um modelo em que agentes de IA participam diretamente da jornada de compra: entendem intenção, pesquisam, comparam, recomendam produtos e, em alguns fluxos, podem ajudar a concluir a transação.",
  },
  {
    q: "Como saber por onde começar?",
    a: "Comece pelo maior gargalo mensurável da operação. Atendimento alto, CAC crescente, baixa conversão, produção lenta de conteúdo e pouca retenção exigem ferramentas e integrações diferentes.",
  },
];

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
              url: tool.url,
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
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full border border-[#275c58]/20 bg-[#275c58]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#275c58]">
              Central de Inteligência • Atualizado em 29/09/2026
            </span>

            <h1 className="mt-7 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
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
              <article
                key={category.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-black text-slate-900">
                  {category.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {category.description}
                </p>
              </article>
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
            <div className="rounded-xl bg-[#275c58]/10 px-4 py-3 text-xs font-bold text-[#275c58]">
              Versão inicial: {tools.length} tecnologias verificadas
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {tools.map((tool) => (
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
                  {tool.name}
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

                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex text-sm font-black text-[#b54d24] hover:text-[#933d1b]"
                >
                  Ver fonte oficial →
                </a>
              </article>
            ))}
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
            <strong className="text-slate-700">Nota editorial:</strong> esta
            página não é patrocinada e não estabelece um ranking. Recursos,
            elegibilidade e disponibilidade podem mudar. As descrições foram
            consolidadas a partir de documentação oficial das plataformas e
            revisadas em 29 de setembro de 2026.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
