'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
      
      {/* IMAGEM DE FUNDO: Equipe trabalhando. 
          Você pode trocar o src por uma foto real do seu escritório colocando na pasta public */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2850&auto=format&fit=crop" 
          alt="Equipe da EyAgencia trabalhando no escritório" 
          fill 
          className="object-cover object-center opacity-40 grayscale"
          priority
        />
        {/* Máscara clara para garantir a leitura do texto */}
        <div className="absolute inset-0 bg-slate-50/90"></div>
      </div>

      {/* A logo duplicada foi removida daqui, pois o Header agora cuida disso globalmente */}

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center px-6 mt-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge de Autoridade */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center rounded-full bg-[#275c58]/10 px-4 py-1.5 text-sm font-semibold text-[#275c58] ring-1 ring-inset ring-[#275c58]/20 shadow-sm backdrop-blur-sm">
            Acelerando Negócios B2B desde 2015
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-7xl drop-shadow-sm"
        >
          Escale o seu E-commerce com{' '}
          <span className="text-[#275c58]">
            SEO Técnico e Tráfego Pago
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-lg md:text-xl leading-8 text-slate-700 max-w-2xl mx-auto font-medium"
        >
          Esqueça achismos. Aplicamos engenharia de dados, Inbound Marketing e frameworks ágeis (Scrum) para transformar a sua operação em uma máquina de aquisição previsível e de alto LTV.
        </motion.p>

        {/* CTA */}
        <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-4">
          <a
            href="#diagnostico"
            className="rounded-md bg-[#f0815b] px-8 py-4 text-base font-black text-slate-900 shadow-xl hover:bg-[#d96a45] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
          >
            Fale Conosco
          </a>
          <a
            href="#nossos-processos"
            className="text-base font-bold leading-6 text-slate-800 hover:text-[#275c58] transition-colors duration-200"
          >
            Ver nossos processos <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}