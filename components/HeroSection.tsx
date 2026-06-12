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
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center bg-zinc-950 overflow-hidden px-6 py-20 lg:px-8">
      {/* Background Effect - Gradient sutil para profundidade visual B2B */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-950 to-zinc-950 pointer-events-none"></div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge de Autoridade (E-E-A-T) */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center rounded-full bg-zinc-800/50 px-4 py-1.5 text-sm font-medium text-zinc-300 ring-1 ring-inset ring-zinc-700">
            Acelerando Negócios B2B desde 2015
          </span>
        </motion.div>

        {/* Headline Focada em SEO e Conversão */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Escale o seu E-commerce B2B com{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            SEO Técnico e Tráfego Pago
          </span>
        </motion.h1>

        {/* Subheadline Focada em Fatos e Resultados */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-lg leading-8 text-zinc-400 max-w-2xl mx-auto"
        >
          Esqueça achismos. Aplicamos engenharia de dados, Inbound Marketing e frameworks ágeis (Scrum) para transformar a sua operação em uma máquina de aquisição previsível e de alto LTV.
        </motion.p>

        {/* CTA (Call to Action) */}
        <motion.div variants={itemVariants} className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#diagnostico"
            className="rounded-md bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-500 hover:scale-105 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            aria-label="Agendar diagnóstico gratuito para o seu E-commerce"
          >
            Agendar Diagnóstico
          </a>
          <a
            href="#nossos-processos"
            className="text-base font-semibold leading-6 text-zinc-300 hover:text-white transition-colors duration-200"
          >
            Ver nossos processos <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}