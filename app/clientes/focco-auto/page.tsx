import type { Metadata } from "next";

// METADADOS DE SEO APRIMORADOS PARA A FOCCO AUTO
export const metadata: Metadata = {
  title: "Case de Sucesso: Focco Auto | EyAgencia",
  description: "Descubra como a EyAgencia estruturou o SEO Técnico e escalou as vendas da Focco Auto, o e-commerce referência em Estética Automotiva e Car Care.",
  keywords: ["Case de Sucesso Estética Automotiva", "SEO para E-commerce Car Care", "Google Shopping Focco Auto", "Produtos de Detalhamento Automotivo", "Tráfego Pago Estética", "EyAgencia Cases"],
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
    "headline": "Focco Auto: Escalando o E-commerce de Estética Automotiva",
    "description": "Estudo de caso detalhando a estratégia de LTV, segmentação B2B (Detailers) vs B2C (Entusiastas) e Google Shopping.",
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
              Case de Sucesso: Estética Automotiva
            </span>
            <span className="text-zinc-500 font-mono text-sm">Tempo de leitura: 4 min</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Focco Auto: Performance de ponta para o mercado de <span className="text-red-500">Detailing</span>.
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-3xl">
            Como dividimos a jornada de compra entre "Estúdios de Estética (B2B)" e "Entusiastas (B2C)" para dobrar a taxa de conversão em produtos de Car Care.
          </p>
        </header>

        {/* DESTAQUE DE RESULTADOS */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-3xl rounded-full pointer-events-none"></div>
          <h3 className="text-xl font-bold text-white mb-8 text-center relative z-10">Desempenho Após a Implementação</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="flex flex-col items-center justify-center p-4">
              <span className="block text-5xl font-black text-red-500 mb-2">+185%</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Tráfego Qualificado</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-red-500 mb-2">Top 3</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Termos de Máquinas/Equipamentos</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-zinc-800">
              <span className="block text-5xl font-black text-red-500 mb-2">4.8x</span>
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">ROAS no Shopping</span>
            </div>
          </div>
        </section>

        {/* CORPO DO CASE: DETALHAMENTO COM MOCKUPS */}
        <div className="space-y-24 text-zinc-300 leading-relaxed">
          
          {/* Seção 1: SEO Educacional */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">SEO para Produtos Técnicos</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                A estética automotiva é um nicho técnico. Ninguém compra um "vitrificador 9H" ou uma "politriz roto-orbital" sem entender a aplicação. O tráfego orgânico da Focco Auto precisava educar para vender.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Otimização estrutural de categorias (Boina de Corte vs Refino vs Lustro) evitando canibalização de palavras.</li>
                <li>Implementação de <strong>FAQ Schema</strong> nas páginas de produto (ex: "Qual a diluição do APC?").</li>
                <li>As respostas passaram a dominar a "Posição Zero" do Google, capturando cliques de curiosos que se tornaram compradores.</li>
              </ul>
            </div>
            
            {/* Mockup do Search Console / Você pode usar sua imagem aqui também */}
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">focco-seo-resultados-ricos.webp</span>
              </div>
              <div className="relative aspect-video bg-zinc-900/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-zinc-900 transition-colors">
                
                {/* Você pode trocar a div abaixo pela sua <img src="/Relatorio e-commerce eyagencia.png" ... /> */}
                <img 
  src="/Relatorio e-commerce eyagencia.png" 
  alt="Relatório de E-commerce EyAgencia" 
  className="w-full h-full object-cover rounded-b-lg" 
/>

              </div>
            </div>
          </section>

          {/* Seção 2: Shopping / Produtos de Alto Ticket vs Recorrência */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
                <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">focco-merchant-center-roas.webp</span>
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
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Engenharia de Google Ads</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                Uma loja de car care vende desde um pincel de R$ 15 até uma extratora profissional de R$ 3.000. Misturar tudo na mesma campanha de Google Shopping é pedir para rasgar dinheiro.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Criamos <em>Custom Labels</em> (Rótulos Personalizados) no feed XML, dividindo "Máquinas/High Ticket" e "Consumíveis/Química".</li>
                <li>Campanhas exclusivas para captação de clientes profissionais (Detailers) que buscam marcas premium específicas.</li>
                <li>Redução do desperdício de cliques de "faça você mesmo" em produtos estritamente profissionais.</li>
              </ul>
            </div>
          </section>

          {/* Seção 3: LTV, GA4 e Retenção */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#f0815b]/10 rounded-lg text-[#f0815b]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">O Segredo do LTV e Recorrência</h2>
              </div>
              <p className="mb-4 text-zinc-400">
                Um estúdio de estética automotiva precisa comprar shampoo, desengraxante e APC todo mês. Configuramos o GA4 para rastrear exatamente quando o profissional atinge o fundo do frasco.
              </p>
              <ul className="space-y-3 list-disc pl-5 text-zinc-400">
                <li>Criação de listas de remarketing dinâmico baseadas em ciclos de uso de 30, 45 e 60 dias.</li>
                <li>Tagueamento avançado focando na adição de produtos de "Galão (5L)" ao carrinho, separando o amador do profissional.</li>
                <li>Relatórios claros que provam que o Custo de Aquisição (CAC) inicial se pagava três vezes mais ao longo do ano.</li>
              </ul>
            </div>
            
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-zinc-500 text-xs ml-2 font-mono flex-1">focco-ga4-ltv.webp</span>
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
        <section className="mt-24 bg-gradient-to-br from-zinc-900 to-red-500/10 border border-zinc-800 rounded-2xl p-10 md:p-16 text-center shadow-2xl">
          <h4 className="text-3xl md:text-4xl font-black text-white mb-6">Vendendo produtos técnicos para um público exigente?</h4>
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
            Assim como a Focco Auto, e-commerces de estética automotiva perdem milhares de reais por misturar amadores e profissionais na mesma estratégia. Vamos auditar a sua operação.
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