import type { Metadata } from "next";

// METADADOS DE SEO APRIMORADOS PARA A FOCCO AUTO
export const metadata: Metadata = {
  title: "Case de Sucesso: Focco Auto | EyAgencia",
  description: "Descubra como a EyAgencia resolveu o SEO técnico de catálogos automotivos e escalou o faturamento da Focco Auto com Google Shopping e GA4.",
  keywords: ["Case de Sucesso Autopeças", "SEO para E-commerce Automotivo", "Google Shopping Focco Auto", "Google Analytics 4", "Tráfego Pago Autopeças", "EyAgencia Cases"],
};

export default function FoccoAutoCaseStudy() {
  // JSON-LD: Sinalizando para o Google a autoridade do estudo de caso
  const caseSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://eyagencia.com.br/clientes/focco-auto"
    },
    "headline": "Como escalamos a operação de e-commerce automotivo da Focco Auto",
    "description": "Estudo de caso detalhando a resolução de SEO para filtros de Ano/Modelo e campanhas de Shopping para autopeças.",
    "author": {
      "@type": "Organization",
      "name": "EyAgencia",
      "url": "https://eyagencia.com.br"
    },
    "publisher": {
      "@type": "Organization",
      "name": "EyAgencia",
      "logo": {
        "@type": "ImageObject",
        "url": "https://eyagencia.com.br/icon.png"
      }
    },
    "datePublished": "2024-03-10",
    "dateModified": "2024-07-01"
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      {/* Injeção invisível do Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema) }}
      />

      <article className="max-w-5xl mx-auto px-6 lg:px-8">
        
        {/* CABEÇALHO DO CASE */}
        <header className="mb-16 border-b border-zinc-800 pb-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <span className="text-red-500 font-bold tracking-wider uppercase text-sm px-4 py-1.5 bg-red-500/10 rounded-full inline-block w-fit">
              Case de Sucesso: Autopeças
            </span>
            <span className="text-zinc-500 font-mono text-sm">Tempo de leitura: 4 min</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Focco Auto: Engenharia de SEO para um <span className="text-red-500">catálogo de alta complexidade</span>.
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-3xl">
            Como resolvemos a canibalização de palavras-chave nos filtros de "Ano e Modelo" e transformamos o e-commerce automotivo em uma referência orgânica e paga.
          </p>
        </header>

        {/* DESTAQUE DE RESULTADOS */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-3xl rounded-full pointer-events-none"></div>
          <h3 className="text-xl font-bold text-white mb-8 text-center relative z-10">Desempenho Após a Implementação Técnica</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="flex flex-col items-center justify-center p-4">
              <span className="block text-5xl font-black text-red-500 mb-2">+185%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Tráfego Mobile</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-red-500 mb-2">-60%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Custo por Aquisição (CAC)</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-red-500 mb-2">5x</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">ROAS no Shopping</span>
            </div>
          </div>
        </section>

        {/* CORPO DO CASE: DETALHAMENTO COM MOCKUPS */}
        <div className="space-y-24 text-zinc-300 leading-relaxed">
          
          {/* Seção 1: Crawl Budget e Filtros (SEO Técnico) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Domando Filtros Complexos</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                O maior gargalo de SEO em autopeças é a navegação em facetas. Quando um usuário filtra "Peça X + Ford + Ka + 2018", o site gera URLs dinâmicas que esgotam o <strong>Crawl Budget</strong> do Google.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Otimizamos o arquivo `robots.txt` para bloquear indexação de combinações infinitas e inúteis.</li>
                <li>Criamos regras de <em>Canonical Tags</em> focadas apenas nos clusters principais de veículos.</li>
                <li>Implementação de <strong>Schema de Compatibilidade Automotiva</strong>, fazendo o Google entender exatamente para quais carros a peça serve.</li>
              </ul>
            </div>
            
            {/* Mockup do Search Console */}
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">focco-seo-crawl-budget.webp</span>
              </div>
              <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-600 p-4">
                  <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                  <p className="font-semibold text-sm">Auditoria Técnica - GSC</p>
                  <p className="text-xs mt-1 text-zinc-500 max-w-[200px]">Substitua pelo print de páginas indexadas corretamente no Search Console.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 2: Google Merchant Center & GTINs */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              {/* Mockup do Google Ads / Merchant */}
              <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
                <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">focco-merchant-center.webp</span>
                </div>
                <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                  <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-600 p-4">
                    <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    <p className="font-semibold text-sm">Feed de Alta Performance</p>
                    <p className="text-xs mt-1 text-zinc-500 max-w-[200px]">Substitua pelo print do Merchant Center livre de reprovações de produtos.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Google Ads: Vencendo Leilões</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                O Google Shopping de autopeças é cruel. Se você envia um feed de XML mal estruturado, perde para concorrentes gigantes. A EyAgencia reestruturou toda a engenharia de dados dos produtos da Focco Auto.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Correção e envio preciso de atributos essenciais: <strong>MPN (Código da Peça)</strong>, Brand e EAN.</li>
                <li>Uso de <em>Custom Labels</em> para separar campanhas por margem de lucro e curva ABC.</li>
                <li>Estruturação de Performance Max (PMAX) alimentada por dados de primeira mão.</li>
              </ul>
            </div>
          </section>

          {/* Seção 3: Mobile First & UX Automotiva */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#f0815b]/10 rounded-lg text-[#f0815b]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">O Mecânico Compra Pelo Celular</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                Em autopeças, grande parte das buscas vêm de mecânicos que estão debaixo do carro com o celular sujo na mão precisando da peça com urgência. A lentidão custa vendas. Trabalhamos os <strong>Core Web Vitals</strong> e o rastreio fino via GA4.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Otimização drástica do LCP (Largest Contentful Paint) para acesso 4G e 3G.</li>
                <li>Tagueamento de GTM focado em taxa de "Add to Cart" mobile.</li>
                <li>Previsibilidade de faturamento com relatórios de retenção de clientes mecânicos no GA4.</li>
              </ul>
            </div>
            
            {/* Mockup do Google Analytics / PageSpeed */}
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">focco-pagespeed-ga4.webp</span>
              </div>
              <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-600 p-4">
                  <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  <p className="font-semibold text-sm">Performance e Conversão Mobile</p>
                  <p className="text-xs mt-1 text-zinc-500 max-w-[200px]">Substitua pelo print do PageSpeed ou gráfico de aquisição mobile no GA4.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* CALL TO ACTION */}
        <section className="mt-24 bg-gradient-to-br from-zinc-900 to-red-500/10 border border-zinc-800 rounded-2xl p-10 md:p-16 text-center shadow-2xl">
          <h4 className="text-3xl md:text-4xl font-black text-white mb-6">O seu catálogo é um problema ou uma máquina de vendas?</h4>
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
            Assim como a Focco Auto, e-commerces com muitos SKUs perdem milhares de reais para a concorrência devido a falhas de SEO Técnico e XML ruim. Vamos diagnosticar a sua loja.
          </p>
          <a href="/contato" className="inline-flex items-center gap-2 bg-[#f0815b] text-white font-bold py-4 px-10 rounded-full hover:bg-[#d96a45] transition-all hover:scale-105 shadow-[0_0_20px_rgba(240,129,91,0.3)]">
            Solicitar Auditoria Técnica
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </section>

      </article>
    </main>
  );
}