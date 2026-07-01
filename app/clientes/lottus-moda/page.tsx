import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case de Sucesso: Lottus Moda | EyAgencia",
  description: "Descubra como a EyAgencia dominou o mercado de moda feminina com SEO Técnico e Google Ads para a Lottus Moda, reduzindo o CPA drasticamente.",
  keywords: ["Case de Sucesso Moda", "SEO para Moda Feminina", "Tráfego Pago Vestuário", "Google Ads Moda", "EyAgencia Cases"],
};

export default function LottusModaCaseStudy() {
  const caseSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://eyagencia.com.br/clientes/lottusmoda" },
    "headline": "Lottus Moda: Escalando o E-commerce de Moda Feminina",
    "description": "Como resolvemos problemas de variação de tamanho, sazonalidade e abandono de carrinho na Lottus Moda.",
    "author": { "@type": "Organization", "name": "EyAgencia", "url": "https://eyagencia.com.br" },
    "publisher": { "@type": "Organization", "name": "EyAgencia", "logo": { "@type": "ImageObject", "url": "https://eyagencia.com.br/icon.png" } },
    "datePublished": "2024-08-10",
    "dateModified": "2024-12-01"
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema) }} />
      
      <article className="max-w-5xl mx-auto px-6 lg:px-8">
        
        {/* CABEÇALHO */}
        <header className="mb-16 border-b border-zinc-800 pb-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <span className="text-rose-500 font-bold tracking-wider uppercase text-sm px-4 py-1.5 bg-rose-500/10 rounded-full inline-block w-fit">
              Case de Sucesso: Moda & Vestuário
            </span>
            <span className="text-zinc-500 font-mono text-sm">Tempo de leitura: 4 min</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Lottus Moda: Dominando as coleções com <span className="text-rose-500">Performance Max</span>.
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-3xl">
            Como resolvemos problemas de variação de tamanhos, esgotamento do Crawl Budget e abandono de carrinho em um dos nichos mais sangrentos da internet.
          </p>
        </header>

        {/* RESULTADOS */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-3xl rounded-full pointer-events-none"></div>
          <h3 className="text-xl font-bold text-white mb-8 text-center relative z-10">Crescimento da Operação</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="flex flex-col items-center justify-center p-4">
              <span className="block text-5xl font-black text-rose-500 mb-2">+250%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Crescimento de Cliques</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-rose-500 mb-2">-40%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">CPA (Custo por Aquisição)</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-rose-500 mb-2">4.5x</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Aumento de ROAS Global</span>
            </div>
          </div>
        </section>

        {/* CONTEÚDO */}
        <div className="space-y-24 text-zinc-300 leading-relaxed">
          
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Gestão de SKUs (Filtros)</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                O e-commerce de moda tem um inimigo nativo: os filtros (P, M, G, Cores, Estilos). Eles criam URLs infinitas que confundem o Google e destroem o ranqueamento.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Otimizamos o <em>Crawl Budget</em> com Canonical Tags precisas, dizendo ao Googlebot qual era o vestido "mestre" a ser indexado.</li>
                <li>Correção de descrições duplicadas geradas automaticamente pela plataforma.</li>
                <li>Implementação de <strong>Product Schema</strong> atualizando preços e estoques em tempo real direto na busca orgânica.</li>
              </ul>
            </div>
            
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">search-console-index.webp</span>
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

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">google-ads-pmax-fashion.webp</span>
              </div>
              <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                <img 
  src="/Relatorio e-commerce eyagencia.png" 
  alt="Relatório de E-commerce EyAgencia" 
  className="w-full h-full object-cover rounded-b-lg" 
/>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">O Feed Perfeito para Moda</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                O Google Shopping para roupas não perdoa falhas. Ajustamos o XML enviando campos exatos de categoria que a maioria das lojas esquece.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Preenchimento rigoroso dos atributos obrigatórios: <em>Age Group, Gender, Color e Size System</em>.</li>
                <li>Isso alimentou o algoritmo de Performance Max (PMAX) de forma tão precisa que as roupas começaram a aparecer exatamente para as mulheres prontas para comprar.</li>
                <li>Derrubamos o Custo por Aquisição (CPA) em 40%.</li>
              </ul>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Retargeting no Carrinho</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                Moda feminina possui uma taxa natural alta de abandono (dúvida de tamanho, consulta ao marido, busca por cupons).
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Mapeamos via GA4 os pontos de fuga do checkout.</li>
                <li>Implementamos uma rede de Display Dinâmico que "perseguia" a usuária mostrando exatamente a peça que ela esqueceu no carrinho, associada a um gatilho de escassez (poucas unidades).</li>
              </ul>
            </div>
            
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">ga4-remarketing-events.webp</span>
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

        {/* CTA */}
        <section className="mt-24 bg-gradient-to-br from-zinc-900 to-rose-500/10 border border-zinc-800 rounded-2xl p-10 md:p-16 text-center shadow-2xl">
          <h4 className="text-3xl md:text-4xl font-black text-white mb-6">Pronto para dominar as próximas coleções?</h4>
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
            Não deixe que erros de SEO ou Google Ads mal configurado consumam a margem de lucro da sua marca de moda. Vamos escalar com dados reais.
          </p>
          <a href="/contato" className="inline-flex items-center gap-2 bg-[#f0815b] text-white font-bold py-4 px-10 rounded-full hover:bg-[#d96a45] transition-all hover:scale-105">
            Diagnóstico para E-commerce de Moda
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </section>
      </article>
    </main>
  );
}