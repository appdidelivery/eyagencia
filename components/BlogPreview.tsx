'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BlogPreview() {
  const posts = [
    {
      category: "SEO Técnico",
      title: "Como preparar seu E-commerce para o Update MUVERA (2026)",
      desc: "Descubra como a densidade factual e o E-E-A-T rigoroso estão redefinindo o ranqueamento de lojas virtuais na nova era das buscas.",
      date: "12 de Outubro",
      // Imagem que você já tem na pasta public
      image: "/Relatorio e-commerce eyagencia.png",
      // Rota para onde o post vai apontar
      url: "/blog/update-muvera" 
    },
    {
      category: "Desenvolvimento",
      title: "JSON-LD para Lojas Virtuais: O Guia Definitivo",
      desc: "O impacto direto da marcação de dados estruturados na compreensão do Googlebot e no aumento da Taxa de Clique (CTR) orgânica.",
      date: "05 de Outubro",
      // Imagem genérica provisória (basta trocar o nome depois)
      image: "/vtex-300x300.jpg", 
      url: "/blog/guia-json-ld"
    },
    {
      category: "Estratégia B2B",
      title: "Como diminuir o CAC em ciclos de vendas longos",
      desc: "Metodologias práticas para nutrir leads complexos e aumentar o LTV através de fluxos de automação de alto nível.",
      date: "28 de Setembro",
      // Imagem genérica provisória (basta trocar o nome depois)
      image: "/linx-300x300.jpg",
      url: "/blog/reduzir-cac-b2b"
    }
  ];

  return (
    <section className="w-full bg-slate-50 py-24 px-6 lg:px-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Radar de <span className="text-[#275c58]">Conteúdo</span>
            </h2>
            <div className="w-16 h-1 bg-[#275c58] mt-6 rounded-full"></div>
          </div>
          <Link href="/blog" className="text-[#f0815b] font-bold hover:text-[#d96a45] transition-colors flex items-center gap-2">
            Acessar o Blog Completo <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              {/* O Link agora envolve o card inteiro, melhorando a UX (clicabilidade) */}
              <Link href={post.url} className="flex flex-col h-full">
                
                {/* ÁREA DA IMAGEM */}
                <div className="w-full h-52 overflow-hidden relative bg-slate-100 border-b border-slate-100">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                  />
                  {/* Badge de Categoria flutuando na imagem */}
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-white bg-[#275c58]/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* ÁREA DE TEXTO */}
                <div className="p-8 flex flex-col flex-grow">
                  <span className="text-xs font-medium text-slate-400 mb-3 block">{post.date}</span>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#275c58] transition-colors leading-snug">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                    {post.desc}
                  </p>
                  
                  <div className="text-sm font-bold text-[#f0815b] flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                    Ler artigo completo <span aria-hidden="true">→</span>
                  </div>
                </div>
                
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}