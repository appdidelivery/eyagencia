'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-slate-50 overflow-hidden px-6 py-20 lg:px-8">
      {/* Background Effect - Clean, Light mode com leve gradiente para o Verde da marca */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-[#275c58]/5 pointer-events-none"></div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge de Autoridade (E-E-A-T) - Usando as cores da marca */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center rounded-full bg-[#275c58]/10 px-4 py-1.5 text-sm font-semibold text-[#275c58] ring-1 ring-inset ring-[#275c58]/20 shadow-sm">
            Acelerando Negócios B2B desde 2015
          </span>
        </motion.div>

        {/* Headline Focada em SEO e Conversão - Contraste alto */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
        >
          Escale o seu E-commerce com{' '}
          <span className="text-[#275c58]">
            SEO Técnico e Tráfego Pago
          </span>
        </motion.h1>

        {/* Subheadline Focada em Fatos e Resultados - Cor neutra para leitura */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto"
        >
          Esqueça achismos. Aplicamos engenharia de dados, Inbound Marketing e frameworks ágeis (Scrum) para transformar a sua operação em uma máquina de aquisição previsível e de alto LTV.
        </motion.p>

        {/* CTA (Call to Action) - Botão Laranja/Coral para alta conversão */}
        <motion.div variants={itemVariants} className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#diagnostico"
            className="rounded-md bg-[#f0815b] px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-[#d96a45] hover:-translate-y-1 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0815b]"
            aria-label="Agendar diagnóstico gratuito para o seu E-commerce"
          >
            Fale Conosco
          </a>
          <a
            href="#nossos-processos"
            className="text-base font-semibold leading-6 text-slate-700 hover:text-[#275c58] transition-colors duration-200"
          >
            Ver nossos processos <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}