'use client';

import { motion } from 'framer-motion';

export default function WhatsAppForm() {
  const handleWhatsAppRedirect = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulação da API do WhatsApp. Na prática, você pode pegar os valores do form e montar a URL.
    const phone = "554832200260";
    const text = encodeURIComponent("Olá! Vim pela Landing Page da EyAgencia e gostaria de agendar um diagnóstico B2B focado em crescimento.");
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  return (
    <section className="w-full bg-zinc-900 py-24 px-6 lg:px-8 border-t border-zinc-800" id="diagnostico">
      <div className="max-w-5xl mx-auto bg-zinc-950 rounded-3xl border border-zinc-800 p-8 md:p-12 lg:p-16 shadow-2xl flex flex-col lg:flex-row items-center gap-12">
        
        {/* Esquerda: Textos */}
        <div className="lg:w-1/2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Chegou a hora de escalar o seu negócio.
          </h2>
          <p className="mt-6 text-zinc-400 text-lg leading-relaxed mb-8">
            Fale diretamente com um especialista da nossa equipe técnica. Vamos analisar sua estrutura atual e desenhar um plano de ação para aumento de LTV e ROAS.
          </p>
          <ul className="space-y-4">
            {['Diagnóstico rápido sem compromisso', 'Acesso a metodologias validadas', 'Estratégia focada em faturamento'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-zinc-300">
                <svg className="w-6 h-6 text-[#275c58] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Direita: Formulário Focado em WhatsApp */}
        <motion.div 
          className="lg:w-1/2 w-full bg-zinc-900 rounded-2xl p-6 md:p-8 border border-zinc-800"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <form onSubmit={handleWhatsAppRedirect} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">Seu Nome / Empresa</label>
              <input type="text" id="name" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#275c58] transition-all" placeholder="Ex: João - LojaTech B2B" />
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-zinc-400 mb-2">URL do seu E-commerce</label>
              <input type="url" id="url" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#275c58] transition-all" placeholder="https://www..." />
            </div>
            
            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-lg px-6 py-4 rounded-lg shadow-lg hover:-translate-y-1 transition-all duration-300 mt-4"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.064 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Falar no WhatsApp
            </button>
          </form>
        </motion.div>

      </div>
    </section>
  );
}