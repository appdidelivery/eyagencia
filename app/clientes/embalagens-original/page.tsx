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
    "description": "Estudo de caso detalhando a otimização de velocidade, UX e campanhas segmentadas para atacado e varejo.",
    "author": { "@type": "Organization", "name": "EyAgencia", "url": "https://eyagencia.com.br" },
    "publisher": { "@type": "Organization", "name": "EyAgencia", "logo": { "@type": "ImageObject", "url": "https://eyagencia.com.br/icon.png" } },
    "datePublished": "2024-06-12",
    "dateModified": "2024-10-05"
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema) }} />
      
      <article className="max-w-5xl mx-auto px-6 lg:px-8">
        
        {/* CABEÇALHO */}
        <header className="mb-16 border-b border-zinc-800 pb-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <span className="text-yellow-500 font-bold tracking-wider uppercase text-sm px-4 py-1.5 bg-yellow-500/10 rounded-full inline-block w-fit">
              Case de Sucesso: Embalagens
            </span>
            <span className="text-zinc-500 font-mono text-sm">Tempo de leitura: 4 min</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Embalagens Original: Otimização para <span className="text-yellow-500">B2B e B2C</span>.
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-3xl">
            Como unificamos a jornada de compra de clientes atacadistas e varejistas em uma única plataforma, focando em velocidade, CRO e feeds dinâmicos.
          </p>
        </header>

        {/* RESULTADOS */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none"></div>
          <h3 className="text-xl font-bold text-white mb-8 text-center relative z-10">Impacto Direto no Faturamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="flex flex-col items-center justify-center p-4">
              <span className="block text-5xl font-black text-yellow-500 mb-2">+190%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Sessões Qualificadas</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-yellow-500 mb-2">-35%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Abandono de Carrinho</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-yellow-500 mb-2">4.1x</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Aumento de ROAS</span>
            </div>
          </div>
        </section>

        {/* CONTEÚDO */}
        <div className="space-y-24 text-zinc-300 leading-relaxed">
          
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Velocidade & Core Web Vitals</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                O site possuía milhares de variações de embalagens (tamanho, cor, gramatura). Sites pesados matam a conversão B2B, pois o atacadista não tem tempo a perder.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Otimização brutal do LCP (Largest Contentful Paint), reduzindo o carregamento em 2.4 segundos.</li>
                <li>Implementação de <em>Lazy Loading</em> e formatos de imagem WebP.</li>
                <li>Limpeza de código que travava a renderização do carrinho de compras.</li>
              </ul>
            </div>
            
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">pagespeed-insights.webp</span>
              </div>
              <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-600 p-4">
                  <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="font-semibold text-sm">Dashboard de Performance</p>
                  <p className="text-xs mt-1 text-zinc-500 max-w-[200px]">Substitua pelo print do PageSpeed mostrando as métricas verdes.</p>
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
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">merchant-center-b2b.webp</span>
              </div>
              <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-600 p-4">
                  <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  <p className="font-semibold text-sm">Google Merchant B2B vs B2C</p>
                  <p className="text-xs mt-1 text-zinc-500 max-w-[200px]">Substitua pelo print do Merchant Center com produtos segmentados.</p>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Feed Dinâmico: B2B e B2C</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                Uma loja que vende 1 unidade e também caixas fechadas de 1.000 unidades precisa falar com algoritmos diferentes. Segmentamos o Google Shopping com feeds separados.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Produtos de varejo mapeados para campanhas Performance Max genéricas.</li>
                <li>"Caixas Master" (Atacado) isoladas em campanhas de Search de alta intenção e PMAX exclusiva para B2B.</li>
                <li>Redução do CPC médio ao parar de exibir atacado para quem busca varejo.</li>
              </ul>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">CRO e Abandono de Carrinho</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                Identificamos pelo GA4 que os usuários montavam carrinhos gigantes, mas abandonavam na hora do frete. A EyAgencia liderou o processo de Otimização da Taxa de Conversão (CRO).
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Simplificação do checkout e exibição de regras de frete grátis antes da finalização.</li>
                <li>Campanhas de remarketing agressivas apenas para carrinhos acima de R$ 500,00.</li>
                <li>Recuperação de 35% do faturamento que ficava travado no funil de vendas.</li>
              </ul>
            </div>
            
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">ga4-checkout-funnel.webp</span>
              </div>
              <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-600 p-4">
                  <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  <p className="font-semibold text-sm">Funil de Checkout (GA4)</p>
                  <p className="text-xs mt-1 text-zinc-500 max-w-[200px]">Substitua pelo print do funil de conversão reduzindo as desistências.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* CTA */}
        <section className="mt-24 bg-gradient-to-br from-zinc-900 to-yellow-500/10 border border-zinc-800 rounded-2xl p-10 md:p-16 text-center shadow-2xl">
          <h4 className="text-3xl md:text-4xl font-black text-white mb-6">Sua operação B2B e B2C precisa de alinhamento?</h4>
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
            Descubra as falhas técnicas que estão fazendo seu e-commerce perder vendas tanto no varejo quanto no atacado corporativo.
          </p>
          <a href="/contato" className="inline-flex items-center gap-2 bg-[#f0815b] text-white font-bold py-4 px-10 rounded-full hover:bg-[#d96a45] transition-all hover:scale-105">
            Diagnóstico de E-commerce Híbrido
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </section>
      </article>
    </main>
  );
}