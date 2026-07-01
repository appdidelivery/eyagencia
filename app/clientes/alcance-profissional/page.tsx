import type { Metadata } from "next";

// METADADOS DE SEO APRIMORADOS PARA ALCANCE PROFISSIONAL
export const metadata: Metadata = {
  title: "Case de Sucesso: Alcance Profissional | EyAgencia",
  description: "Descubra como a EyAgencia alavancou o SEO, Google Ads e o LTV de compradores recorrentes da Alcance Profissional no nicho de estética automotiva.",
  keywords: ["Case de Sucesso Estética Automotiva", "SEO para Limpeza Profissional", "Tráfego Pago Car Care", "Rich Snippets", "LTV E-commerce", "EyAgencia Cases"],
};

export default function AlcanceProfissionalCaseStudy() {
  // JSON-LD: Sinalizando para o Google a autoridade do estudo de caso
  const caseSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://eyagencia.com.br/clientes/alcance-profissional"
    },
    "headline": "Como escalamos a operação de E-commerce da Alcance Profissional",
    "description": "Estudo de caso detalhando a estratégia de SEO em Rich Snippets, Vídeos e campanhas de alta conversão para o nicho de Car Care.",
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
    "datePublished": "2024-05-10",
    "dateModified": "2024-09-01"
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
            <span className="text-cyan-500 font-bold tracking-wider uppercase text-sm px-4 py-1.5 bg-cyan-500/10 rounded-full inline-block w-fit">
              Case de Sucesso: Car Care & B2B
            </span>
            <span className="text-zinc-500 font-mono text-sm">Tempo de leitura: 4 min</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Alcance Profissional: SEO Técnico para <span className="text-cyan-500">vendas químicas complexas</span>.
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-3xl">
            Como unimos estratégias de conteúdo, Rich Snippets e Tráfego Pago para educar o mercado de estética automotiva e gerar recorrência.
          </p>
        </header>

        {/* DESTAQUE DE RESULTADOS */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>
          <h3 className="text-xl font-bold text-white mb-8 text-center relative z-10">Evolução do Projeto em 6 Meses</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="flex flex-col items-center justify-center p-4">
              <span className="block text-5xl font-black text-cyan-500 mb-2">+170%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Acessos Orgânicos</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-cyan-500 mb-2">3.8x</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">ROAS em Google Ads</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-cyan-500 mb-2">+42%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Taxa de Recompra (LTV)</span>
            </div>
          </div>
        </section>

        {/* CORPO DO CASE: DETALHAMENTO COM MOCKUPS */}
        <div className="space-y-24 text-zinc-300 leading-relaxed">
          
          {/* Seção 1: SEO, Schema Markup e Vídeos */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Dominando com Rich Snippets</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                Produtos de detalhamento automotivo exigem explicação (como diluir, em qual superfície aplicar). Transformamos essas objeções em uma arma de SEO. Injetamos <strong>Video Schema</strong> e <strong>FAQ Schema</strong> em todo o catálogo da Alcance Profissional.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Ranqueamento na "Posição Zero" do Google para dúvidas comuns ("Como aplicar vitrificador X").</li>
                <li>Implementação de vídeos tutoriais nas páginas de produto otimizados para o bot do Google.</li>
                <li>Aumento brutal no tempo de permanência na página, sinalizando altíssima relevância ao algoritmo.</li>
              </ul>
            </div>
            
            {/* Mockup do Search Console / SERP */}
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">alcance-rich-snippets-serp.webp</span>
              </div>
              <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                <img 
  src="/Relatorio e-commerce eyagencia.png" 
  alt="Relatório de E-commerce EyAgencia" 
  className="w-full h-full object-cover rounded-b-lg" 
/>
              </div>
            </div>
          </section>

          {/* Seção 2: Google Ads e Youtube (Performance Max) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              {/* Mockup do Google Ads */}
              <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
                <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">alcance-youtube-ads.webp</span>
                </div>
                <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                  <img 
  src="/Relatorio e-commerce eyagencia.png" 
  alt="Relatório de E-commerce EyAgencia" 
  className="w-full h-full object-cover rounded-b-lg" 
/>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Tráfego Pago que Educa e Vende</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                Uma embalagem bonita não vende química automotiva sozinha; o <strong>resultado visual</strong> é o que vende. Integramos o vasto material em vídeo da Alcance Profissional diretamente no motor do Google Ads via Performance Max (PMAX).
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Veiculação de YouTube Ads focada em públicos "In-Market" (compradores de polidores e produtos automotivos).</li>
                <li>Sincronização de catálogo avançada no Merchant Center com atributos técnicos detalhados.</li>
                <li>Separação de campanhas: Entusiastas (Ticket Médio baixo) x Estúdios de Detalhamento (Ticket Médio alto).</li>
              </ul>
            </div>
          </section>

          {/* Seção 3: GA4 e Retenção do Profissional */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#f0815b]/10 rounded-lg text-[#f0815b]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Rastreando o LTV (Recompra)</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                Lava-rápidos e estúdios de <em>car care</em> consomem produtos rapidamente. O verdadeiro lucro da operação não está na primeira compra, mas na décima. Nossa equipe reestruturou o <strong>GA4 e GTM</strong> para identificar esse público B2B e nutrí-lo.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Identificação de usuários recorrentes e criação de listas de remarketing dinâmico por tempo de consumo do produto (ex: repor o produto 30 dias após a compra).</li>
                <li>Tagueamento de micro-conversões: Quem baixa a FISPQ (Ficha de Segurança) ou tabela de diluição é um prospect B2B altamente qualificado.</li>
                <li>Monitoramento do Custo por Aquisição (CAC) versus o lucro de longo prazo (LTV).</li>
              </ul>
            </div>
            
            {/* Mockup do Google Analytics */}
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">alcance-ga4-cohorts.webp</span>
              </div>
              <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                <img 
  src="/Relatorio e-commerce eyagencia.png" 
  alt="Relatório de E-commerce EyAgencia" 
  className="w-full h-full object-cover rounded-b-lg" 
/>
              </div>
            </div>
          </section>
        </div>

        {/* CALL TO ACTION */}
        <section className="mt-24 bg-gradient-to-br from-zinc-900 to-cyan-500/10 border border-zinc-800 rounded-2xl p-10 md:p-16 text-center shadow-2xl">
          <h4 className="text-3xl md:text-4xl font-black text-white mb-6">O seu produto precisa de educação para ser vendido?</h4>
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
            Assim como a Alcance Profissional, se o seu nicho possui objeções técnicas e requer um cliente bem informado, a EyAgencia constrói a engenharia ideal de funil para transformar visitantes frios em compradores leais.
          </p>
          <a href="/contato" className="inline-flex items-center gap-2 bg-[#f0815b] text-white font-bold py-4 px-10 rounded-full hover:bg-[#d96a45] transition-all hover:scale-105 shadow-[0_0_20px_rgba(240,129,91,0.3)]">
            Solicitar Mapeamento Estratégico
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </section>

      </article>
    </main>
  );
}