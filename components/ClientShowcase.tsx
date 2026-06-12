'use client';

import { motion } from 'framer-motion';

export default function ClientShowcase() {
  const clients = [
    {
      name: "Soller Embalagens",
      url: "https://www.sollerembalagens.com.br/",
      src: "/logo soller embalagens.webp", 
      niche: "E-commerce B2B/B2C"
    },
    {
      name: "Mamedes Papéis",
      url: "https://loja.mamedes.com.br/",
      src: "/logo mamedes papeis.webp",
      niche: "E-commerce"
    },
    {
      name: "Sacola Online",
      url: "https://www.sacolaonline.com.br/",
      src: "/logo sacola online.webp",
      niche: "E-commerce Embalagens"
    },
    {
      name: "Pitney Embalagens",
      url: "https://pitney.com.br/",
      src: "/pitney logo marca.webp",
      niche: "E-commerce B2B"
    },
    {
      name: "Focco Auto",
      url: "https://foccoauto.com.br/",
      src: "/logo focco auto.png",
      niche: "E-commerce Automotivo"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <section className="w-full bg-zinc-950 py-24 px-6 lg:px-8 border-t border-zinc-900" id="clientes">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Nossos <span className="text-[#f0815b]">Clientes em Destaque</span>
          </h2>
          <div className="w-16 h-1 bg-[#275c58] mt-6 rounded-full"></div>
          <p className="mt-6 text-zinc-400 text-lg max-w-2xl mx-auto">
            Operações que escalaram faturamento e dominaram as buscas orgânicas através da nossa engenharia de marketing.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {clients.map((client, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-between hover:bg-zinc-800/80 hover:border-zinc-700 hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
              onClick={() => window.open(client.url, "_blank")}
            >
              {/* Fallback Inteligente e Fundo Escuro para destacar logos brancas */}
              <div className="w-24 h-24 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center p-3 mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300 overflow-hidden relative">
                <img 
                  src={client.src} 
                  alt={`Logo ${client.name}`}
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = `<span class="text-3xl font-black text-[#275c58]">${client.name.charAt(0)}</span>`;
                  }}
                />
              </div>

              <div className="text-center">
                <h3 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-[#f0815b] transition-colors">
                  {client.name}
                </h3>
                <span className="text-[#275c58] text-xs font-semibold uppercase tracking-wider">
                  {client.niche}
                </span>
              </div>

              <div className="mt-6 text-zinc-500 flex items-center gap-2 text-sm group-hover:text-white transition-colors">
                Visitar loja
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Novo Botão CTA: Ver todos os Projetos */}
        <div className="mt-16 flex justify-center">
          <a 
            href="/clientes"
            className="rounded-md bg-transparent border-2 border-[#f0815b] text-[#f0815b] px-8 py-3.5 text-base font-bold shadow-sm hover:bg-[#f0815b] hover:text-white hover:-translate-y-1 transition-all duration-300"
          >
            Ver todos os projetos e cases →
          </a>
        </div>

      </div>
    </section>
  );
}