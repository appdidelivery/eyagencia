import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case de Sucesso: Otávio Giora Shop | EyAgencia",
  description: "Como a EyAgencia estruturou o tráfego pago e SEO focado em público de alta renda (High Ticket) para a Otávio Giora Shop.",
  keywords: ["Case de Sucesso Alto Padrão", "SEO para Luxo", "Tráfego Pago High Ticket", "Google Shopping Premium", "EyAgencia Cases"],
};

export default function OtavioGioraCaseStudy() {
  const caseSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://eyagencia.com.br/clientes/otaviogiora" },
    "headline": "Otávio Giora Shop: Escalando e-commerce de alto padrão",
    "description": "Estudo de caso detalhando o mapeamento de audiência High Ticket e SEO visual para marca premium.",
    "author": { "@type": "Organization", "name": "EyAgencia", "url": "https://eyagencia.com.br" },
    "publisher": { "@type": "Organization", "name": "EyAgencia", "logo": { "@type": "ImageObject", "url": "https://eyagencia.com.br/icon.png" } },
    "datePublished": "2024-07-20",
    "dateModified": "2024-11-01"
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema) }} />
      
      <article className="max-w-5xl mx-auto px-6 lg:px-8">
        
        {/* CABEÇALHO */}
        <header className="mb-16 border-b border-zinc-800 pb-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <span className="text-purple-500 font-bold tracking-wider uppercase text-sm px-4 py-1.5 bg-purple-500/10 rounded-full inline-block w-fit">
              Case de Sucesso: Alto Padrão & High Ticket
            </span>
            <span className="text-zinc-500 font-mono text-sm">Tempo de leitura: 5 min</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Otávio Giora Shop: Convertendo o exigente público <span className="text-purple-500">High Ticket</span>.
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-3xl">
            A arquitetura de tráfego e dados por trás de um e-commerce que alia exclusividade, ticket médio altíssimo e ROAS sustentável.
          </p>
        </header>

        {/* RESULTADOS */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>
          <h3 className="text-xl font-bold text-white mb-8 text-center relative z-10">Crescimento Focado no Público AA</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="flex flex-col items-center justify-center p-4">
              <span className="block text-5xl font-black text-purple-500 mb-2">+120%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Receita (Year over Year)</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-purple-500 mb-2">Top 5%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Foco em Alta Renda</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-purple-500 mb-2">3.5x</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">ROAS Sustentável</span>
            </div>
          </div>
        </section>

        {/* CONTEÚDO */}
        <div className="space-y-24 text-zinc-300 leading-relaxed">
          
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Segmentação Premium (GA4)</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                Vender produtos de alto ticket no Google Ads pode esgotar o orçamento rapidamente se o anúncio aparecer para quem procura "versões baratas". 
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Utilizamos o GA4 integrado aos sinais de dados demográficos do Google para refinar as listas de público-alvo (Top 10% da renda).</li>
                <li>Negativação extrema de termos como "promoção", "barato", "réplica".</li>
                <li>Campanhas focadas não apenas em cliques, mas em quem possui histórico real de compras de valor agregado.</li>
              </ul>
            </div>
            
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">ga4-high-ticket-audience.webp</span>
              </div>
              <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-600 p-4">
                  <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  <p className="font-semibold text-sm">Filtros de Audiência GA4</p>
                  <p className="text-xs mt-1 text-zinc-500 max-w-[200px]">Substitua pelo print do Analytics mostrando o LTV e perfil de alta renda.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">seo-visual-search.webp</span>
              </div>
              <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-600 p-4">
                  <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="font-semibold text-sm">Google Imagens e Shopping</p>
                  <p className="text-xs mt-1 text-zinc-500 max-w-[200px]">Substitua pelo print do Google Shopping exibindo produtos do cliente no topo.</p>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">SEO Visual e Branding</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                O cliente premium compra com os olhos, muito antes de ler a descrição técnica. As imagens precisavam dominar a aba "Imagens" e "Shopping" do Google.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Auditoria técnica de SEO em todas as imagens (Alt text focado em palavras de intenção, conversão para formato WebP).</li>
                <li>Implementação rigorosa de <strong>ImageObject Schema</strong> para o Google entender o prestígio da marca.</li>
                <li>Campanhas PMAX utilizando recursos criativos (lifestyle assets) de alta resolução.</li>
              </ul>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">ROAS e Previsibilidade</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                No alto padrão, não se busca volume de vendas diário, mas sim faturamento sólido com margem alta. Criamos relatórios personalizados no Looker Studio para os diretores da Otávio Giora Shop.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Mapeamento da janela de conversão estendida (produtos caros levam mais tempo para serem comprados).</li>
                <li>Remarketing sequencial: mantendo a marca na cabeça do consumidor nas redes sociais após a pesquisa inicial no Google.</li>
              </ul>
            </div>
            
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">looker-studio-dashboard.webp</span>
              </div>
              <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-600 p-4">
                  <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  <p className="font-semibold text-sm">Dashboard Gerencial</p>
                  <p className="text-xs mt-1 text-zinc-500 max-w-[200px]">Substitua pelo print do Looker Studio mostrando faturamento e ROAS.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* CTA */}
        <section className="mt-24 bg-gradient-to-br from-zinc-900 to-purple-500/10 border border-zinc-800 rounded-2xl p-10 md:p-16 text-center shadow-2xl">
          <h4 className="text-3xl md:text-4xl font-black text-white mb-6">Sua marca precisa atrair o público que paga mais?</h4>
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
            Tráfego genérico não vende luxo. A EyAgencia estrutura os dados do seu e-commerce para focar exclusivamente em quem tem poder de decisão e compra.
          </p>
          <a href="/contato" className="inline-flex items-center gap-2 bg-[#f0815b] text-white font-bold py-4 px-10 rounded-full hover:bg-[#d96a45] transition-all hover:scale-105">
            Diagnóstico para Marcas Premium
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </section>
      </article>
    </main>
  );
}