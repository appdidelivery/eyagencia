import Header from "../../components/Header";
import Footer from "../../components/Footer";

// SEO Técnico Nativo para a página do Blog
export const metadata = {
  title: "Blog de E-commerce, SEO e Tráfego Pago | EyAgencia",
  description: "Aprenda estratégias avançadas de Inbound Marketing, automação B2B e engenharia de marketing para lojas virtuais.",
};

export default function BlogPage() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog EyAgencia",
    "url": "https://eyagencia.com.br/blog",
    "description": "Conteúdo especializado em engenharia de marketing e e-commerce.",
    "publisher": {
      "@type": "Organization",
      "name": "EyAgencia",
      "logo": {
        "@type": "ImageObject",
        "url": "https://eyagencia.com.br/eyagencia-logo-verde.png"
      }
    }
  };

  const categories = ["SEO Técnico", "Tráfego Pago", "E-commerce B2B", "Inbound Marketing", "Web Analytics"];
  const popularTags = ["Vtex", "ROAS", "Core Web Vitals", "LTV", "Automação", "JSON-LD"];

  const posts = [
    {
      category: "SEO Técnico",
      title: "Como preparar seu E-commerce para o Update MUVERA (2026)",
      desc: "Descubra como a densidade factual e o E-E-A-T rigoroso estão redefinindo o ranqueamento de lojas virtuais na nova era das buscas.",
      date: "12 de Outubro",
      readTime: "7 min de leitura"
    },
    {
      category: "Desenvolvimento",
      title: "JSON-LD para Lojas Virtuais: O Guia Definitivo",
      desc: "O impacto direto da marcação de dados estruturados na compreensão do Googlebot e no aumento da Taxa de Clique (CTR) orgânica.",
      date: "05 de Outubro",
      readTime: "5 min de leitura"
    },
    {
      category: "Estratégia B2B",
      title: "Inbound Marketing: Como diminuir o CAC em ciclos longos",
      desc: "Metodologias práticas para nutrir leads complexos e aumentar o LTV através de fluxos de automação de alto nível.",
      date: "28 de Setembro",
      readTime: "6 min de leitura"
    },
    {
      category: "Tráfego Pago",
      title: "Google Performance Max para B2B: Vale a pena?",
      desc: "Análise aprofundada sobre como o algoritmo da Meta e do Google Ads podem ser domesticados para captação de lojistas.",
      date: "15 de Setembro",
      readTime: "8 min de leitura"
    }
  ];

  return (
    <main className="flex min-h-screen flex-col w-full bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />

      {/* Header com theme light (Padrão) */}
      <Header />
      
      {/* Hero do Blog */}
      <section className="pt-40 pb-20 px-6 lg:px-8 text-center bg-white border-b border-slate-200">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Radar de <span className="text-[#275c58]">Conteúdo</span>
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
          Estratégias avançadas, atualizações de algoritmos e engenharia de vendas para profissionais de e-commerce.
        </p>
      </section>

      {/* Container Principal (Grid com Sidebar) */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow flex flex-col lg:flex-row gap-12">
        
        {/* Coluna Esquerda: Grid de Artigos */}
        <div className="lg:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post, i) => (
              <article key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col group">
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase tracking-wider text-[#f0815b] bg-[#f0815b]/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#275c58] transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 text-base leading-relaxed mb-6 flex-grow">
                    {post.desc}
                  </p>
                  
                  {/* Rodapé do Card */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div className="text-xs font-medium text-slate-500 flex flex-col">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <div className="text-sm font-bold text-[#275c58] flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ler <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {/* Paginação */}
          <div className="mt-12 flex justify-center gap-2">
            <button className="w-10 h-10 rounded-lg bg-[#275c58] text-white font-bold flex items-center justify-center">1</button>
            <button className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold flex items-center justify-center">2</button>
            <button className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold flex items-center justify-center">3</button>
          </div>
        </div>

        {/* Coluna Direita: Sidebar B2B */}
        <aside className="lg:w-1/3 space-y-10">
          
          {/* Widget de Busca */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Buscar Artigo</h3>
            <div className="relative">
              <input type="text" placeholder="Ex: SEO Técnico..." className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#275c58] transition-all" />
              <button className="absolute right-3 top-3 text-slate-400 hover:text-[#275c58]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
            </div>
          </div>

          {/* Widget de Categorias */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Categorias</h3>
            <ul className="space-y-3">
              {categories.map((cat, i) => (
                <li key={i}>
                  <a href="#" className="text-slate-600 hover:text-[#f0815b] hover:translate-x-1 flex items-center gap-2 transition-all font-medium text-sm">
                    <svg className="w-4 h-4 text-[#275c58]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Widget de Tags */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Tags Populares</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, i) => (
                <a key={i} href="#" className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-[#275c58] hover:text-white transition-colors">
                  #{tag}
                </a>
              ))}
            </div>
          </div>

        </aside>

      </section>

      <Footer />
    </main>
  );
}