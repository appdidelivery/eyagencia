import type { Metadata } from "next";

// METADADOS DE SEO APRIMORADOS
export const metadata: Metadata = {
  title: "Case de Sucesso: Soller Embalagens | EyAgencia",
  description: "Descubra como a EyAgencia estruturou o SEO Técnico, Google Meu Negócio e escalou as operações B2B da Soller Embalagens com previsibilidade de ROAS.",
  keywords: ["Case de Sucesso E-commerce", "SEO para B2B", "Tráfego Pago Soller Embalagens", "Google Analytics 4", "Search Console", "EyAgencia Cases"],
};

export default function SollerCaseStudy() {
  // JSON-LD: Sinalizando para o Google a autoridade do estudo de caso
  const caseSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://eyagencia.com.br/clientes/soller-embalagens"
    },
    "headline": "Como escalamos a operação B2B da Soller Embalagens",
    "description": "Estudo de caso detalhando a reestruturação de SEO, GMB e campanhas de ROAS para a Soller Embalagens.",
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
    "datePublished": "2024-01-10",
    "dateModified": "2024-05-15"
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
              Case de Sucesso B2B
            </span>
            <span className="text-zinc-500 font-mono text-sm">Tempo de leitura: 4 min</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Soller Embalagens: Estruturação técnica e <span className="text-[#f0815b]">escala em vendas complexas</span>.
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-3xl">
            Como aplicamos engenharia de dados e SEO Técnico avançado para transformar a presença digital de uma das principais fornecedoras de embalagens do mercado.
          </p>
        </header>

        {/* DESTAQUE DE RESULTADOS (Logo no topo para prender a atenção) */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f0815b]/10 blur-3xl rounded-full pointer-events-none"></div>
          <h3 className="text-xl font-bold text-white mb-8 text-center relative z-10">O Impacto Gerado nos Primeiros 6 Meses</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="flex flex-col items-center justify-center p-4">
              <span className="block text-5xl font-black text-[#f0815b] mb-2">+140%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Tráfego Orgânico (Cliques)</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-[#f0815b] mb-2">Setup</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Arquitetura de Dados Validada</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-[#f0815b] mb-2">3.5x</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Crescimento no ROAS</span>
            </div>
          </div>
        </section>

        {/* CORPO DO CASE: DETALHAMENTO COM MOCKUPS */}
        <div className="space-y-24 text-zinc-300 leading-relaxed">
          
          {/* Seção 1: Crescimento Orgânico (Search Console) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Domínio no Google Search</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                O tráfego B2B exige confiança. Não basta estar na primeira página; é preciso ter as "rich snippets" corretas. Realizamos uma auditoria técnica profunda que corrigiu gargalos de indexação e implementou a <strong>Marcação de Dados Estruturados (Schema.org)</strong>.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Otimização de Core Web Vitals (LCP, FID, CLS).</li>
                <li>Correção de canibalização de palavras-chave entre categorias.</li>
                <li>Crescimento consistente em impressões e cliques qualificados.</li>
              </ul>
            </div>
            
            {/* Mockup do Google Search Console */}
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">search-console-performance.webp</span>
              </div>
              <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                {/* AQUI VOCÊ SUBSTITUI PELO COMPONENTE <img src="/sua-imagem.jpg" /> DEPOIS */}
                <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-600 p-4">
                  <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                  <p className="font-semibold text-sm">Dashboard do Search Console</p>
                  <p className="text-xs mt-1 text-zinc-500 max-w-[200px]">Substitua este bloco pela imagem simbólica do gráfico orgânico subindo.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 2: Google Meu Negócio (SEO Local e Autoridade) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              {/* Mockup do Google Meu Negócio */}
              <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
                <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">google-my-business-profile.webp</span>
                </div>
                <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                  {/* AQUI VOCÊ SUBSTITUI PELO COMPONENTE <img src="/sua-imagem.jpg" /> DEPOIS */}
                  <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-600 p-4">
                    <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <p className="font-semibold text-sm">Ficha Estruturada (Google Meu Negócio)</p>
                    <p className="text-xs mt-1 text-zinc-500 max-w-[200px]">Substitua este bloco pelo print das avaliações e ficha otimizada.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 8h8" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Autoridade Local (GMB)</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                Para um fornecedor B2B, a ficha do Google Meu Negócio é uma vitrine de credibilidade. Reestruturamos completamente o perfil da Soller Embalagens para funcionar como uma máquina de provas sociais e captura de leads corporativos.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Categorização semântica de produtos e serviços prestados.</li>
                <li>Estratégia ativa de captura de reviews de clientes B2B chave.</li>
                <li>Sincronização de catálogo diretamente na busca do Google.</li>
              </ul>
            </div>
          </section>

          {/* Seção 3: Performance e Vendas (Google Analytics / Tráfego Pago) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#f0815b]/10 rounded-lg text-[#f0815b]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">GA4 & ROAS Previsível</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                Onde a maioria das agências vê "cliques", nós vemos <strong>Custo de Aquisição (CAC)</strong> e <strong>Lifetime Value (LTV)</strong>. Parametrizamos todo o fluxo no Google Analytics 4 (GA4) para entender o comportamento de compra corporativo, cortando gastos inúteis no tráfego pago e injetando orçamento nas palavras de alto valor.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Mapeamento avançado de eventos de conversão no GA4.</li>
                <li>Campanhas segmentadas focadas em ROAS de longo prazo.</li>
                <li>Redução brutal do desperdício de verba em termos B2C irrelevantes.</li>
              </ul>
            </div>
            
            {/* Mockup do Google Analytics */}
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">google-analytics-4-conversions.webp</span>
              </div>
              <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                {/* AQUI VOCÊ SUBSTITUI PELO COMPONENTE <img src="/sua-imagem.jpg" /> DEPOIS */}
                <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-600 p-4">
                  <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                  <p className="font-semibold text-sm">Dashboard de Performance GA4</p>
                  <p className="text-xs mt-1 text-zinc-500 max-w-[200px]">Substitua este bloco pelo print dos gráficos de conversão e eventos.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* CALL TO ACTION */}
        <section className="mt-24 bg-gradient-to-br from-zinc-900 to-[#f0815b]/10 border border-zinc-800 rounded-2xl p-10 md:p-16 text-center shadow-2xl">
          <h4 className="text-3xl md:text-4xl font-black text-white mb-6">Pronto para dominar o seu nicho?</h4>
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
            Assim como a Soller Embalagens, seu e-commerce pode estar perdendo milhares de reais por falta de uma infraestrutura técnica focada em conversão. Vamos mapear seus gargalos.
          </p>
          <a href="/contato" className="inline-flex items-center gap-2 bg-[#f0815b] text-white font-bold py-4 px-10 rounded-full hover:bg-[#d96a45] transition-all hover:scale-105 shadow-[0_0_20px_rgba(240,129,91,0.3)]">
            Solicitar Auditoria Gratuita
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </section>

      </article>
    </main>
  );
}