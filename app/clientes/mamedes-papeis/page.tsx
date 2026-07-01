import type { Metadata } from "next";

// METADADOS DE SEO APRIMORADOS PARA A MAMEDES
export const metadata: Metadata = {
  title: "Case de Sucesso: Mamedes Papéis | EyAgencia",
  description: "Veja como a EyAgencia reestruturou o SEO técnico, otimizou o Google Shopping e escalou o ROAS do e-commerce da Mamedes Papéis.",
  keywords: ["Case de Sucesso E-commerce", "SEO para E-commerce", "Google Shopping Mamedes", "Google Analytics 4", "Tráfego Pago Papelaria", "EyAgencia Cases"],
};

export default function MamedesCaseStudy() {
  // JSON-LD: Sinalizando para o Google a autoridade do estudo de caso
  const caseSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://eyagencia.com.br/clientes/mamedes-papeis"
    },
    "headline": "Como estruturamos o SEO e multiplicamos o ROAS da Mamedes Papéis",
    "description": "Estudo de caso detalhando a arquitetura de categorias, otimização de XML e campanhas de Shopping para a Mamedes Papéis.",
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
    "datePublished": "2024-02-15",
    "dateModified": "2024-06-20"
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
            <span className="text-[#f0815b] font-bold tracking-wider uppercase text-sm px-4 py-1.5 bg-[#f0815b]/10 rounded-full inline-block w-fit">
              Case de Sucesso E-commerce
            </span>
            <span className="text-zinc-500 font-mono text-sm">Tempo de leitura: 5 min</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Mamedes Papéis: Dominando as buscas em <span className="text-[#f0815b]">catálogos complexos</span>.
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-3xl">
            Como organizamos a arquitetura de categorias de um extenso inventário e transformamos o Google Shopping em uma máquina de previsibilidade de vendas.
          </p>
        </header>

        {/* DESTAQUE DE RESULTADOS (Logo no topo para prender a atenção) */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
          <h3 className="text-xl font-bold text-white mb-8 text-center relative z-10">O Impacto Gerado Pela Estruturação Técnica</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="flex flex-col items-center justify-center p-4">
              <span className="block text-5xl font-black text-blue-500 mb-2">+210%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Sessões Orgânicas</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-blue-500 mb-2">Top 3</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Em Termos Head-Tail</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-blue-500 mb-2">4.2x</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Aumento de ROAS (Ads)</span>
            </div>
          </div>
        </section>

        {/* CORPO DO CASE: DETALHAMENTO COM MOCKUPS */}
        <div className="space-y-24 text-zinc-300 leading-relaxed">
          
          {/* Seção 1: Arquitetura de Categorias e SEO Técnico */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Arquitetura de Informação</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                Lojas com muitos SKUs costumam sofrer com <strong>canibalização de palavras-chave</strong> e URLs duplicadas geradas por filtros (Faceted Navigation). Nossa primeira missão foi remapear toda a taxonomia do site da Mamedes Papéis.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Hierarquia de URLs amigáveis (Silos de Conteúdo estruturados).</li>
                <li>Bloqueio técnico via robots.txt de parâmetros de busca inúteis.</li>
                <li>Injeção de <strong>Schema de Produto</strong> dinâmico em todo o catálogo.</li>
              </ul>
            </div>
            
            {/* Mockup do Search Console / Auditoria */}
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">mamedes-search-console.webp</span>
              </div>
              <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-600 p-4">
                  <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                  <p className="font-semibold text-sm">Dashboard do Search Console</p>
                  <p className="text-xs mt-1 text-zinc-500 max-w-[200px]">Substitua pelo print do crescimento de páginas indexadas e volume de cliques.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 2: Google Merchant Center e Feed Otimizado */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              {/* Mockup do Google Ads / Merchant */}
              <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
                <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">mamedes-merchant-center.webp</span>
                </div>
                <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                  <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-600 p-4">
                    <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    <p className="font-semibold text-sm">Performance do Google Shopping</p>
                    <p className="text-xs mt-1 text-zinc-500 max-w-[200px]">Substitua pelo print da qualidade do feed ou gráfico de conversões PMAX.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Domínio no Google Shopping</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                Não adianta injetar dinheiro em Tráfego Pago se o feed de produtos (XML) estiver pobre. Reformulamos os atributos dos produtos enviados ao <strong>Google Merchant Center</strong>, garantindo que o algoritmo entendesse exatamente o que a Mamedes vende.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Otimização de Títulos no Feed (Categoria + Cor + Tamanho + Marca).</li>
                <li>Correção de erros críticos de EAN (GTIN) e frete dinâmico.</li>
                <li>Estratégia avançada de campanhas Performance Max subdivididas por rentabilidade.</li>
              </ul>
            </div>
          </section>

          {/* Seção 3: CRO e Tagueamento via GA4 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#f0815b]/10 rounded-lg text-[#f0815b]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">GA4 & Tagueamento Cirúrgico</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                A jornada de compra de papelaria e embalagens envolve alto volume de itens no carrinho. O antigo tagueamento não acompanhava essas micro-conversões. <strong>Reconfiguramos o Google Tag Manager (GTM) e GA4</strong> para mapear as quedas no funil de checkout.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Monitoramento exato de "Add to Cart" e "Begin Checkout".</li>
                <li>Otimização de velocidade da loja (Core Web Vitals) reduzindo Bounce Rate.</li>
                <li>Visão clara do CPA (Custo por Aquisição) real de cada categoria de papel.</li>
              </ul>
            </div>
            
            {/* Mockup do Google Analytics */}
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">mamedes-ga4-ecommerce.webp</span>
              </div>
              <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-600 p-4">
                  <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                  <p className="font-semibold text-sm">Monetização no GA4</p>
                  <p className="text-xs mt-1 text-zinc-500 max-w-[200px]">Substitua pelo print do relatório de E-commerce do Analytics mostrando faturamento.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* CALL TO ACTION */}
        <section className="mt-24 bg-gradient-to-br from-zinc-900 to-blue-500/10 border border-zinc-800 rounded-2xl p-10 md:p-16 text-center shadow-2xl">
          <h4 className="text-3xl md:text-4xl font-black text-white mb-6">Seu e-commerce tem potencial reprimido?</h4>
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
            Assim como a Mamedes Papéis, muitos e-commerces não escalam por causa de erros técnicos invisíveis. Agende uma auditoria e descubra para onde seu dinheiro está vazando.
          </p>
          <a href="/contato" className="inline-flex items-center gap-2 bg-[#f0815b] text-white font-bold py-4 px-10 rounded-full hover:bg-[#d96a45] transition-all hover:scale-105 shadow-[0_0_20px_rgba(240,129,91,0.3)]">
            Falar com Especialista
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </section>

      </article>
    </main>
  );
}