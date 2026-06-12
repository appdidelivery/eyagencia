'use client';

import { motion } from 'framer-motion';

export default function ServicesGrid() {
  const services = [
    {
      title: 'SEO, AEO e GEO',
      description: 'Otimização cirúrgica para Google e IAs. Estruturação avançada de marcação de dados (JSON-LD) e arquitetura de informação focada em indexação de alta performance.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#f0815b]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
    },
    {
      title: 'Tráfego Pago e Inbound',
      description: 'Campanhas de performance focadas em ROAS. Mapeamento de jornada de compra, automação de processos e captação qualificada para e-commerce e B2B.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#f0815b]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
    },
    {
      title: 'Setup e Migração',
      description: 'Implantação e refatoração técnica segura em ecossistemas como Vtex, Nuvemshop, Tray e Loja Integrada, garantindo integridade de dados e URLs.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#f0815b]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008z" />
        </svg>
      ),
    },
    {
      title: 'Social Media e Conteúdo',
      description: 'Posicionamento estratégico de marca. Criação de ativos digitais originais, gestão de comunidade e distribuição de conteúdo validado por especialistas (E-E-A-T).',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#f0815b]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.82 1.508-2.316a7.5 7.5 0 10-7.516 0c.85.496 1.508 1.333 1.508 2.316V18" />
        </svg>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section className="w-full bg-zinc-950 py-24 px-6 lg:px-8 border-t border-zinc-900" id="servicos">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Nossos Serviços
          </h2>
          <div className="w-16 h-1 bg-[#275c58] mt-4 rounded-full"></div>
          <p className="mt-6 text-zinc-400 max-w-2xl text-lg">
            Metodologias validadas e execução técnica de ponta para ecossistemas de vendas complexos.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group bg-zinc-900 border border-zinc-800/80 rounded-2xl p-8 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all duration-300 flex flex-col h-full"
            >
              <div className="bg-zinc-950 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-black/50">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                {service.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed flex-grow">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}