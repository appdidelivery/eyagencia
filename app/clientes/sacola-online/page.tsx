import type { Metadata } from "next";

// METADADOS DE SEO APRIMORADOS PARA A SACOLA ONLINE
export const metadata: Metadata = {
  title: "Case de Sucesso: Sacola Online | EyAgencia",
  description: "Veja como a EyAgencia dominou palavras-chave de alta concorrência e escalou as vendas em atacado (B2B) da Sacola Online através de SEO Técnico e Tráfego Pago.",
  keywords: ["Case de Sucesso B2B", "SEO para Gráficas e Embalagens", "Tráfego Pago Atacado", "Google Ads B2B", "LTV E-commerce", "EyAgencia Cases"],
};

export default function SacolaOnlineCaseStudy() {
  // JSON-LD: Sinalizando para o Google a autoridade do estudo de caso
  const caseSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://eyagencia.com.br/clientes/sacola-online"
    },
    "headline": "Sacola Online: Como dominamos o atacado B2B no e-commerce de embalagens",
    "description": "Estudo de caso sobre redução de CAC e aumento de LTV em e-commerce de sacolas e embalagens através de SEO e Google Ads.",
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
    "datePublished": "2024-04-05",
    "dateModified": "2024-08-12"
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
            <span className="text-emerald-500 font-bold tracking-wider uppercase text-sm px-4 py-1.5 bg-emerald-500/10 rounded-full inline-block w-fit">
              Case de Sucesso: Atacado & B2B
            </span>
            <span className="text-zinc-500 font-mono text-sm">Tempo de leitura: 4 min</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Sacola Online: Dominando buscas acirradas e <span className="text-emerald-500">escalando o LTV corporativo</span>.
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-3xl">
            Como tiramos a operação da guerra de preços do varejo e a posicionamos como líder técnica na aquisição de clientes B2B de alto volume de recompra.
          </p>
        </header>

        {/* DESTAQUE DE RESULTADOS */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>
          <h3 className="text-xl font-bold text-white mb-8 text-center relative z-10">Consolidação do Atacado em 8 Meses</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="flex flex-col items-center justify-center p-4">
              <span className="block text-5xl font-black text-emerald-500 mb-2">Top 1</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Em Palavras "Money Keywords"</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-emerald-500 mb-2">+240%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Receita Orgânica (B2B)</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-emerald-500 mb-2">-45%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Redução de CAC (Google Ads)</span>
            </div>
          </div>
        </section>

        {/* CORPO DO CASE: DETALHAMENTO COM MOCKUPS */}
        <div className="space-y-24 text-zinc-300 leading-relaxed">
          
          {/* Seção 1: SEO para Oceano Vermelho */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">SEO em Oceano Vermelho</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                O mercado de embalagens e sacolas personalizadas possui um dos CPCs (Custo Por Clique) mais caros do Brasil. Pagar por cada visita é insustentável. Aplicamos uma reestruturação de <strong>SEO On-Page e Arquitetura de Silos</strong> para blindar a Sacola Online organicamente.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Mapeamento de <em>Long Tails</em> comerciais (Ex: "Sacola Kraft Personalizada Atacado SP").</li>
                <li>Estruturação de <strong>Rich Snippets de Produto e Preço</strong> para esmagar a concorrência visualmente na SERP.</li>
                <li>Otimização técnica do tempo de carregamento para garantir a indexação imediata do Googlebot.</li>
              </ul>
            </div>
            
            {/* Mockup do Search Console / Rank Tracker */}
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">sacola-rank-tracker-seo.webp</span>
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

          {/* Seção 2: Google Ads B2B e Negativação */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              {/* Mockup do Google Ads */}
              <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
                <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">sacola-google-ads-roas.webp</span>
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
                <div className="p-2 bg-zinc-800 rounded-lg text-zinc-100">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Separando o Joio do Trigo nas Buscas</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                O maior erro no tráfego pago para sacolas é comprar cliques de quem procura "comprar 10 sacolas para presente". Nossa engenharia de campanhas focou exclusivamente em intenção corporativa.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Limpeza massiva de termos de pesquisa: negativação cirúrgica de buscas varejistas.</li>
                <li>Estruturação de lances baseada em conversões de alto ticket (Atacado).</li>
                <li>Campanhas de Google Shopping otimizadas com feed exclusivo para pacotes fechados (ex: lotes de 500 un).</li>
              </ul>
            </div>
          </section>

          {/* Seção 3: LTV, UX e GA4 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">O Segredo do LTV e GA4</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                Quem compra embalagem para o seu negócio, volta a comprar todo mês. O e-commerce precisava parar de tratar o cliente como "venda única". <strong>Parametrizamos o Google Analytics 4 (GA4)</strong> para entender o ciclo de vida desse comprador.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Mapeamento de <em>Cohorts</em> (retenção de usuários) no GA4 para prever recompras.</li>
                <li>Melhoria na UX (Experiência do Usuário) do carrinho para facilitar re-pedidos (reorder) de lotes grandes em poucos cliques.</li>
                <li>Dados concretos provando que o investimento focado em B2B se pagava até 4x no longo prazo.</li>
              </ul>
            </div>
            
            {/* Mockup do Google Analytics / GA4 LTV */}
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">sacola-ga4-retention.webp</span>
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
        <section className="mt-24 bg-gradient-to-br from-zinc-900 to-emerald-500/10 border border-zinc-800 rounded-2xl p-10 md:p-16 text-center shadow-2xl">
          <h4 className="text-3xl md:text-4xl font-black text-white mb-6">Pare de pagar caro por cliques curiosos.</h4>
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
            Se a sua indústria ou distribuidora sofre com tráfego desqualificado e altos custos de aquisição, você precisa de uma engenharia de SEO e Ads desenhada para o B2B.
          </p>
          <a href="/contato" className="inline-flex items-center gap-2 bg-[#f0815b] text-white font-bold py-4 px-10 rounded-full hover:bg-[#d96a45] transition-all hover:scale-105 shadow-[0_0_20px_rgba(240,129,91,0.3)]">
            Agendar Diagnóstico Gratuito
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </section>

      </article>
    </main>
  );
}