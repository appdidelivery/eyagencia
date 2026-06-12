'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LogoTicker() {
  // Lista de parceiros mapeada com URLs de cadastro/planos
  const partners = [
    { name: 'VTEX', src: '/vtex-300x300.jpg', url: 'https://vtex.com/br-pt/pricing/' },
    { name: 'Tray', src: '/tray-300x300.jpg', url: 'https://tray.com.br/planos/' },
    { name: 'Linx', src: '/linx-300x300.jpg', url: 'https://www.linx.com.br/linx-commerce/' },
    { name: 'Jet Commerce', src: '/jet-300x300.jpg', url: 'https://www.jet.com.br/' },
    { name: 'Flexy', src: '/flexy-300x300.jpg', url: 'https://www.flexy.com.br/' },
    { name: 'DOOCA', src: '/dooca-300x300.jpg', url: 'https://dooca.com.br/planos' },
    { name: 'Betalabs', src: '/betalabs-300x300.jpg', url: 'https://betalabs.com.br/' },
    { name: 'Loja Integrada', src: '/lojaintegrada-300x300.jpg', url: 'https://lojaintegrada.com.br/planos/' },
  ];

  // Duplicamos o array para criar a ilusão de loop infinito
  const tickerItems = [...partners, ...partners, ...partners];

  return (
    <section className="w-full bg-white py-12 border-b border-slate-100 overflow-hidden" id="parceiros">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-1 bg-[#275c58]"></div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Somos Parceiros de serviços
          </h2>
        </div>
        {/* Link para a nova página de parceiros */}
        <a href="/parceiros" className="text-[#f0815b] font-bold hover:text-[#d96a45] transition-colors flex items-center gap-2 text-sm md:text-base">
          Ver todas as plataformas <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <motion.div
          className="flex w-max items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ ease: 'linear', duration: 40, repeat: Infinity }}
        >
          {tickerItems.map((partner, index) => (
            <a
              key={index}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-[180px] md:w-[220px] flex-shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
              title={`Cadastre-se na ${partner.name}`}
            >
              <Image
                src={partner.src}
                alt={`Logo da plataforma ${partner.name}`}
                width={150}
                height={150}
                className="object-contain w-auto h-16 md:h-20 mix-blend-multiply"
                quality={85}
              />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}