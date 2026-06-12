'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LogoTicker() {
  // Lista de parceiros mapeada com os nomes exatos dos seus arquivos na pasta public
  const partners = [
    { name: 'VTEX', src: '/vtex-300x300.jpg' },
    { name: 'Tray', src: '/tray-300x300.jpg' },
    { name: 'Linx', src: '/linx-300x300.jpg' },
    { name: 'Jet Commerce', src: '/jet-300x300.jpg' },
    { name: 'Flexy', src: '/flexy-300x300.jpg' },
    { name: 'DOOCA', src: '/dooca-300x300.jpg' },
    { name: 'Betalabs', src: '/betalabs-300x300.jpg' },
    { name: 'Loja Integrada', src: '/lojaintegrada-300x300.jpg' },
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

      {/* Máscara de gradiente nas bordas para dar efeito de fade nas pontas da tela */}
      <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        
        {/* Container da Animação do Framer Motion */}
        <motion.div
          className="flex w-max items-center"
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            ease: 'linear',
            duration: 35, // Velocidade suave
            repeat: Infinity,
          }}
        >
          {tickerItems.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center w-[180px] md:w-[220px] flex-shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
            >
              <Image
                src={partner.src}
                alt={`Logo da plataforma de e-commerce ${partner.name}`} // Alt tag rica para SEO
                width={150}
                height={150}
                className="object-contain w-auto h-16 md:h-20 mix-blend-multiply"
                quality={85}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}