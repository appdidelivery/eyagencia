'use client';

import { motion } from 'framer-motion';

export default function ProcessTimeline() {
  // Dados enriquecidos com densidade factual B2B
  const steps = [
    {
      number: '01',
      title: 'Inbound Marketing & CRM',
      description: 'Mapeamento da jornada de compra, automação de funis e nutrição de leads para aumentar o Lifetime Value (LTV) da sua base de clientes.',
    },
    {
      number: '02',
      title: 'SEO & Otimização Técnica',
      description: 'Auditoria avançada, correção de Core Web Vitals e arquitetura de dados (JSON-LD) para indexação rápida e domínio orgânico no Google.',
    },
    {
      number: '03',
      title: 'Social Media Estratégico',
      description: 'Gestão de comunidade, posicionamento de marca e criação de ativos visuais de alta conversão para Instagram, TikTok e LinkedIn.',
    },
    {
      number: '04',
      title: 'Tráfego Pago (Google & Meta Ads)',
      description: 'Gestão de verba focada em ROAS. Campanhas de alta performance cobrindo fundo de funil, remarketing e captação de novas contas.',
    },
    {
      number: '05',
      title: 'Implantação de E-commerce',
      description: 'Setup e migração segura de lojas virtuais (B2B/B2C), integrações de ERP e arquitetura de conversão nas plataformas líderes do mercado.',
    },
  ];

  return (
    <section className="w-full bg-slate-50 py-24 px-6 lg:px-8" id="nossos-processos">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-16">
        
        {/* Lado Esquerdo: Título Fixo (Sticky) */}
        <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Nosso <br className="hidden lg:block" />
            Fluxograma <br className="hidden lg:block" />
            de Trabalho
          </h2>
          <div className="w-16 h-1 bg-[#275c58] mt-6"></div>
          <p className="mt-6 text-slate-600 text-lg leading-relaxed">
            Aplicamos engenharia de processos e metodologias ágeis para garantir entregas pontuais e crescimento escalável.
          </p>
        </div>

        {/* Lado Direito: Timeline Vertical */}
        <div className="lg:w-2/3 relative">
          {/* Linha vertical de conexão */}
          <div className="absolute left-[27px] md:left-[39px] top-2 bottom-2 w-0.5 bg-slate-200"></div>

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex items-start gap-6 md:gap-10"
              >
                {/* Número / Ponto na Linha */}
                <div className="relative z-10 flex-shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-full bg-white border-4 border-slate-50 shadow-sm flex items-center justify-center font-black text-xl md:text-3xl text-[#275c58]">
                  {step.number}
                </div>

                {/* Conteúdo do Passo */}
                <div className="pt-2 md:pt-4">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}