'use client';

import { motion } from 'framer-motion';

export default function LogoTicker() {
  // Lista de parceiros extraída da sua tela anterior
  const partners = [
    { name: 'VTEX', color: 'text-pink-600 font-black tracking-tighter' },
    { name: 'Tray', color: 'text-teal-700 font-bold tracking-tight' },
    { name: 'Linx', color: 'text-orange-500 font-black' },
    { name: 'Jet Commerce', color: 'text-orange-600 font-bold' },
    { name: 'Flexy', color: 'text-blue-900 font-black italic tracking-wider' },
    { name: 'DOOCA', color: 'text-blue-500 font-bold tracking-widest' },
    { name: 'Betalabs', color: 'text-sky-500 font-semibold' },
  ];

  // Duplicamos o array para criar a ilusão de loop infinito (seamless)
  const tickerItems = [...partners, ...partners, ...partners];

  return (
    <section className="w-full bg-white py-12 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8 flex items-center gap-4">
        {/* Detalhe visual da marca (Linha Teal) */}
        <div className="w-12 h-1 bg-[#275c58]"></div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Somos Parceiros de serviços
        </h2>
      </div>

      {/* Máscara de gradiente nas bordas para dar efeito de entrada/saída suave */}
      <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        
        {/* Container da Animação do Framer Motion */}
        <motion.div
          className="flex w-max"
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            ease: 'linear',
            duration: 30, // Velocidade do carrossel (aumente para mais lento)
            repeat: Infinity,
          }}
        >
          {tickerItems.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center w-[200px] md:w-[250px] flex-shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
            >
              {/* SUBSTITUA AQUI: Quando tiver as imagens, troque esse <span> pela tag <Image src="..." alt="..." /> */}
              <span className={`text-3xl md:text-4xl ${partner.color}`}>
                {partner.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}