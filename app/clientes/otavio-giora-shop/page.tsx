import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case de Sucesso: Otávio Giora Shop | EyAgencia",
  description: "Como a EyAgencia estruturou o tráfego pago e SEO para e-commerce de alto ticket da Otávio Giora Shop.",
  keywords: ["Case de Sucesso Alto Padrão", "SEO para Luxo", "Tráfego Pago High Ticket", "Google Shopping Moda", "EyAgencia Cases"],
};

export default function OtavioGioraCaseStudy() {
  const caseSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://eyagencia.com.br/clientes/otaviogiora" },
    "headline": "Otávio Giora Shop: Escalando e-commerce de alto padrão",
    "author": { "@type": "Organization", "name": "EyAgencia" },
    "publisher": { "@type": "Organization", "name": "EyAgencia", "logo": { "@type": "ImageObject", "url": "https://eyagencia.com.br/icon.png" } }
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema) }} />
      <article className="max-w-5xl mx-auto px-6 lg:px-8">
        
        <header className="mb-16 border-b border-zinc-800 pb-10">
          <div className="flex items-center gap-6 mb-6">
            <span className="text-purple-500 font-bold uppercase text-sm px-4 py-1.5 bg-purple-500/10 rounded-full">Case de Sucesso: Alto Padrão</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            Otávio Giora Shop: Convertendo público <span className="text-purple-500">High Ticket</span>.
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-3xl">
            A arquitetura de tráfego e dados por trás do e-commerce que alia exclusividade, ticket médio alto e retorno constante sobre investimento publicitário.
          </p>
        </header>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="p-4">
              <span className="block text-5xl font-black text-purple-500 mb-2">+120%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase">Receita (YoY)</span>
            </div>
            <div className="p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-purple-500 mb-2">Top 5%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase">Público de Alta Renda</span>
            </div>
            <div className="p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-purple-500 mb-2">3.5x</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase">ROAS Sustentável</span>
            </div>
          </div>
        </section>

        <div className="space-y-24 text-zinc-300 leading-relaxed">
          {/* Seção 1 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Mapeamento de Público GA4</h2>
              <p className="mb-4 text-zinc-400">Vender produtos de alto ticket requer dados precisos. Utilizamos o GA4 integrado aos sinais de dados do Google Ads para criar perfis de compradores focados em quem tem real poder aquisitivo, reduzindo cliques desqualificados.</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-2">
              <div className="aspect-video bg-zinc-950 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-800 text-zinc-600">
                 Print do GA4 focado em Audiências de Alto Valor
              </div>
            </div>
          </section>

          {/* Seção 2 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 rounded-xl border border-zinc-800 bg-zinc-900 p-2">
              <div className="aspect-video bg-zinc-950 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-800 text-zinc-600">
                 Print de Busca Visual (Google Imagens / Shopping)
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-white mb-4">SEO Visual e Branding</h2>
              <p className="mb-4 text-zinc-400">O cliente premium compra com os olhos. Fizemos uma auditoria de SEO em todas as imagens (Alt text, compressão WebP e ImageObject Schema) para dominar a busca visual do Google, essencial nesse nicho.</p>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}