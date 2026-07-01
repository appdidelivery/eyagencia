import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case de Sucesso: Embalagens Original | EyAgencia",
  description: "Como a EyAgencia estruturou o e-commerce híbrido (B2B e B2C) da Embalagens Original com foco em CRO e SEO Técnico.",
  keywords: ["Case de Sucesso Embalagens", "SEO para E-commerce B2B", "CRO E-commerce", "Tráfego Pago Embalagens", "EyAgencia Cases"],
};

export default function EmbalagensOriginalCaseStudy() {
  const caseSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://eyagencia.com.br/clientes/embalagensoriginal" },
    "headline": "Embalagens Original: Aceleração de vendas B2B e B2C",
    "author": { "@type": "Organization", "name": "EyAgencia" },
    "publisher": { "@type": "Organization", "name": "EyAgencia", "logo": { "@type": "ImageObject", "url": "https://eyagencia.com.br/icon.png" } }
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema) }} />
      <article className="max-w-5xl mx-auto px-6 lg:px-8">
        
        <header className="mb-16 border-b border-zinc-800 pb-10">
          <div className="flex items-center gap-6 mb-6">
            <span className="text-yellow-500 font-bold uppercase text-sm px-4 py-1.5 bg-yellow-500/10 rounded-full">Case de Sucesso: Embalagens</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            Embalagens Original: Otimização de catálogo para <span className="text-yellow-500">B2B e B2C</span>.
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-3xl">
            Como unificamos a jornada de compra de clientes atacadistas e varejistas em uma única plataforma otimizada para velocidade e alta conversão.
          </p>
        </header>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="p-4">
              <span className="block text-5xl font-black text-yellow-500 mb-2">+190%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase">Sessões Qualificadas</span>
            </div>
            <div className="p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-yellow-500 mb-2">-35%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase">Redução de Abandono de Carrinho</span>
            </div>
            <div className="p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-yellow-500 mb-2">4.1x</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase">Retorno (ROAS)</span>
            </div>
          </div>
        </section>

        <div className="space-y-24 text-zinc-300 leading-relaxed">
          {/* Seção 1 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">UX e Velocidade (Core Web Vitals)</h2>
              <p className="mb-4 text-zinc-400">Embalagens possuem muitas variações (tamanho, cor, gramatura). Sites lentos matam a conversão B2B. Focamos em melhorar a velocidade de carregamento (LCP) e a navegabilidade mobile para facilitar pedidos em lote.</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-2">
              <div className="aspect-video bg-zinc-950 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-800 text-zinc-600">
                 Print do PageSpeed Insights com métricas verdes
              </div>
            </div>
          </section>

          {/* Seção 2 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 rounded-xl border border-zinc-800 bg-zinc-900 p-2">
              <div className="aspect-video bg-zinc-950 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-800 text-zinc-600">
                 Print do Google Shopping / Feed
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-white mb-4">Feed Dinâmico B2B vs B2C</h2>
              <p className="mb-4 text-zinc-400">Segmentamos o Google Shopping com feeds separados. Produtos de varejo para lances de PMAX padrão, e caixas master (atacado) focadas em campanhas de Search de alta intenção e remarketing B2B.</p>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}