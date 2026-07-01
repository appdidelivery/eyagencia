import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case de Sucesso: Lottus Moda | EyAgencia",
  description: "Descubra como a EyAgencia dominou o mercado de moda feminina com SEO para E-commerce, otimização de catálogo e Google Ads para a Lottus Moda.",
  keywords: ["Case de Sucesso Moda", "SEO para Moda Feminina", "Tráfego Pago Vestuário", "Google Ads Moda", "EyAgencia Cases"],
};

export default function LottusModaCaseStudy() {
  const caseSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://eyagencia.com.br/clientes/lottusmoda" },
    "headline": "Lottus Moda: Escalando o E-commerce de Moda Feminina",
    "author": { "@type": "Organization", "name": "EyAgencia" },
    "publisher": { "@type": "Organization", "name": "EyAgencia", "logo": { "@type": "ImageObject", "url": "https://eyagencia.com.br/icon.png" } }
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema) }} />
      <article className="max-w-5xl mx-auto px-6 lg:px-8">
        
        <header className="mb-16 border-b border-zinc-800 pb-10">
          <div className="flex items-center gap-6 mb-6">
            <span className="text-rose-500 font-bold uppercase text-sm px-4 py-1.5 bg-rose-500/10 rounded-full">Case de Sucesso: Moda Feminina</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            Lottus Moda: Dominando as coleções com <span className="text-rose-500">Performance Max</span>.
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-3xl">
            Como resolvemos problemas de variação de tamanho, sazonalidade e abandono de carrinho em um dos nichos mais disputados da internet.
          </p>
        </header>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="p-4">
              <span className="block text-5xl font-black text-rose-500 mb-2">+250%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase">Crescimento de Cliques</span>
            </div>
            <div className="p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-rose-500 mb-2">-40%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase">CPA (Custo por Aquisição)</span>
            </div>
            <div className="p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-rose-500 mb-2">4.5x</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase">Aumento de ROAS</span>
            </div>
          </div>
        </section>

        <div className="space-y-24 text-zinc-300 leading-relaxed">
          {/* Seção 1 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Gestão de SKUs e SEO Técnico</h2>
              <p className="mb-4 text-zinc-400">Moda tem o desafio dos filtros (P, M, G, Cores) que destroem o SEO criando URLs infinitas. Otimizamos o Crawl Budget com canonical tags precisas, dizendo ao Google exatamente qual é o "produto mestre" a ser indexado.</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-2">
              <div className="aspect-video bg-zinc-950 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-800 text-zinc-600">
                 Print do Search Console / Indexação
              </div>
            </div>
          </section>

          {/* Seção 2 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 rounded-xl border border-zinc-800 bg-zinc-900 p-2">
              <div className="aspect-video bg-zinc-950 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-800 text-zinc-600">
                 Print do Google Shopping / Campanhas PMAX
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-white mb-4">Feed Perfeito no Google Shopping</h2>
              <p className="mb-4 text-zinc-400">O Google Shopping para roupas não perdoa falhas. Ajustamos o XML enviando campos exatos de *Age Group*, *Gender* e *Size System*. Isso alimentou a Performance Max (PMAX) de forma tão precisa que o algoritmo derrubou o CPA quase pela metade.</p>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}