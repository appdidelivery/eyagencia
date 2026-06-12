'use client';

import { motion } from 'framer-motion';

export default function BlogPreview() {
  const posts = [
    {
      category: "SEO Técnico",
      title: "Como preparar seu E-commerce para o Update MUVERA (2026)",
      desc: "Descubra como a densidade factual e o E-E-A-T rigoroso estão redefinindo o ranqueamento de lojas virtuais na nova era das buscas do Google.",
      date: "12 de Outubro"
    },
    {
      category: "Desenvolvimento",
      title: "JSON-LD para Lojas Virtuais: O Guia Definitivo",
      desc: "O impacto direto da marcação de dados estruturados na compreensão do Googlebot e no aumento da Taxa de Clique (CTR) orgânica.",
      date: "05 de Outubro"
    },
    {
      category: "Estratégia B2B",
      title: "Inbound Marketing: Como diminuir o CAC em ciclos de vendas longos",
      desc: "Metodologias práticas para nutrir leads complexos e aumentar o LTV através de fluxos de automação de alto nível.",
      date: "28 de Setembro"
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
          <a href="#blog" className="text-[#f0815b] font-bold hover:text-[#d96a45] transition-colors flex items-center gap-2">
            Acessar o Blog Completo <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
            >
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-[#f0815b] bg-[#f0815b]/10 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs font-medium text-slate-400">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-[#275c58] transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                  {post.desc}
                </p>
                <div className="text-sm font-bold text-[#275c58] flex items-center gap-1 group-hover:gap-2 transition-all">
                  Ler artigo completo <span aria-hidden="true">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}