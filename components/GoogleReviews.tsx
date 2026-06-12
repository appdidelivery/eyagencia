'use client';

import { motion } from 'framer-motion';

export default function GoogleReviews() {
  const reviews = [
    {
      name: "Ricardo S., CEO de E-commerce B2B",
      text: "A migração da nossa loja para a VTEX nos dava muito medo por causa da perda de tráfego. A EyAgencia fez um mapeamento de URLs em 301 perfeito. Não só mantivemos o tráfego, como aumentamos o ROAS em 45% nos primeiros 3 meses de Ads.",
    },
    {
      name: "Mariana L., Diretora de Marketing",
      text: "O trabalho de SEO Técnico deles é absurdo. Injetaram dados estruturados (JSON-LD) que nós nem sabíamos que existiam. Nossas páginas de categoria B2B agora dominam o topo do Google para os termos mais difíceis do nosso nicho.",
    },
    {
      name: "Felipe T., Founder (Nicho Industrial)",
      text: "Transparência total. Fomos de um CAC altíssimo para uma máquina previsível. A aplicação de Inbound com foco em LTV mudou o jogo. A equipe de gestão de performance realmente usa engenharia de dados e não achismos.",
    }
  ];

  const StarIcon = () => (
    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <section className="w-full bg-white py-24 px-6 lg:px-8 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Validação por <span className="text-[#275c58]">Quem Importa</span>
          </h2>
          <div className="w-16 h-1 bg-[#f0815b] mx-auto mt-6 rounded-full"></div>
          <p className="mt-6 text-slate-600 text-lg max-w-2xl mx-auto">
            Resultados auditáveis e crescimento previsível. Veja o que gestores de e-commerce dizem sobre a nossa execução.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
              </div>
              <p className="text-slate-700 italic mb-6 leading-relaxed">
                "{review.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#275c58]/10 flex items-center justify-center font-bold text-[#275c58]">
                  {review.name.charAt(0)}
                </div>
                <p className="font-semibold text-slate-900 text-sm">{review.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}