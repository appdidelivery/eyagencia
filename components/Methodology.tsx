'use client';

import { motion } from 'framer-motion';

export default function Methodology() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Efeito cascata: os itens aparecem um a um
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const steps = [
    {
      num: "1",
      title: "Diagnóstico e Auditoria Técnica.",
      desc: "Análise profunda de concorrência, Core Web Vitals e mapeamento de gargalos de conversão no seu ecossistema atual."
    },
    {
      num: "2",
      title: "Setup de Infraestrutura e Tração.",
      desc: "Implementação de tagueamento avançado, arquitetura de dados (JSON-LD) e alinhamento das plataformas (Vtex, Tray, etc)."
    },
    {
      num: "3",
      title: "Escala Orgânica (SEO/GEO) e Mídia Paga.",
      desc: "Sprints de crescimento contínuo com foco em ROAS, diminuição de CAC e indexação de alta performance no Google."
    }
  ];

  return (
    <section className="w-full bg-zinc-900 py-24 px-6 lg:px-8 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Esquerda: Conteúdo Textual (E-E-A-T) */}
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Execução Cirúrgica e <span className="text-[#f0815b]">Transparência Total.</span>
          </h2>
          <div className="w-16 h-1 bg-[#275c58] mt-6"></div>
          
          <p className="mt-8 text-lg text-zinc-400 leading-relaxed">
            Na EyAgencia, não trabalhamos com "achismos". Nossa operação é fundamentada em engenharia de dados e processos consolidados desde 2015.
          </p>
          
          <p className="mt-4 text-lg text-zinc-400 leading-relaxed">
            Adotamos uma gestão baseada na metodologia ágil <strong className="text-zinc-200">Scrum</strong> e entregas em Sprints. Isso significa que você não fica no escuro: você acompanha cada etapa, métrica e evolução do seu projeto em tempo real.
          </p>
        </div>

        {/* Direita: Infográfico de Passos (Framer Motion) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-6"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-start gap-6 bg-zinc-950/50 p-6 md:p-8 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 transition-colors shadow-lg"
            >
              {/* Círculo com o Número */}
              <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#275c58]/20 border border-[#275c58]/30 flex items-center justify-center text-[#275c58] font-black text-xl md:text-2xl shadow-inner">
                {step.num}
              </div>
              
              {/* Textos do Step */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}