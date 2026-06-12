import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";

export const metadata = {
  title: "Plataformas Parceiras | Setup de E-commerce | EyAgencia",
  description: "Conheça as plataformas de e-commerce líderes de mercado que a EyAgencia domina. Implantação e migração em VTEX, Tray, Nuvemshop e mais.",
};

export default function ParceirosPage() {
  const partnersData = [
    {
      name: "VTEX",
      src: "/vtex-300x300.jpg",
      url: "https://vtex.com/br-pt/pricing/",
      desc: "A plataforma global focada em Enterprise e arquitetura MACH. Ideal para operações complexas B2B/B2C que precisam de escalabilidade infinita, omnichannel nativo e alta customização.",
      tags: ["Enterprise", "Omnichannel", "B2B Complexo"]
    },
    {
      name: "Tray",
      src: "/tray-300x300.jpg",
      url: "https://tray.com.br/planos/",
      desc: "Um dos ecossistemas mais completos do Brasil. Excelente custo-benefício com integrações nativas para marketplaces, ERPs e robustez ideal para PMEs em franca expansão.",
      tags: ["PME", "Marketplaces", "Custo-Benefício"]
    },
    {
      name: "Loja Integrada",
      src: "/lojaintegrada-300x300.jpg",
      url: "https://lojaintegrada.com.br/planos/",
      desc: "O setup mais rápido do mercado. A Loja Integrada é perfeita para quem quer validar produtos e começar a tracionar vendas com um ecossistema amigável e de fácil gestão.",
      tags: ["Iniciantes", "Setup Rápido", "Validação"]
    },
    {
      name: "DOOCA Commerce",
      src: "/dooca-300x300.jpg",
      url: "https://dooca.com.br/planos",
      desc: "Foco absoluto em design e experiência do usuário (UX). A Dooca possui templates nativos belíssimos focados em conversão, ideal para nichos de moda, cosméticos e design.",
      tags: ["Design Premium", "Moda", "UX"]
    },
    {
      name: "Linx Commerce",
      src: "/linx-300x300.jpg",
      url: "https://www.linx.com.br/linx-commerce/",
      desc: "A escolha definitiva para quem possui lojas físicas e quer unificar o estoque (Prateleira Infinita). Integração total entre o mundo offline e o digital (Phygital).",
      tags: ["Lojas Físicas", "Omnichannel", "Phygital"]
    },
    {
      name: "Betalabs",
      src: "/betalabs-300x300.jpg",
      url: "https://betalabs.com.br/",
      desc: "A melhor solução nativa do Brasil para Clubes de Assinatura e Vendas Recorrentes. Inclui sistema de gestão (ERP) embarcado para facilitar faturamentos automáticos.",
      tags: ["Clubes de Assinatura", "Recorrência", "ERP Nativo"]
    }
  ];

  return (
    <main className="flex min-h-screen flex-col w-full bg-slate-50">
      <Header />
      
      {/* Hero da Página */}
      <section className="pt-40 pb-20 px-6 lg:px-8 text-center bg-white border-b border-slate-200">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          A base sólida para a sua <span className="text-[#f0815b]">Escala</span>
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto">
          Somos certificados e parceiros das maiores plataformas de E-commerce do mercado. 
          Escolha a tecnologia ideal para o seu momento e deixe o setup técnico com a gente.
        </p>
      </section>

      {/* Grid de Parceiros e Plataformas */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {partnersData.map((partner, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col">
              
              {/* Header do Card (Logo e Tags) */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                <div className="w-32 h-16 relative bg-white flex items-center">
                  <Image 
                    src={partner.src} 
                    alt={`Logo ${partner.name}`}
                    fill
                    className="object-contain object-left mix-blend-multiply"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {partner.tags.map((tag, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Descrição Forte (Densidade Factual) */}
              <h2 className="text-2xl font-bold text-slate-900 mb-3">{partner.name}</h2>
              <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                {partner.desc}
              </p>

              {/* Botão de Cadastro (CTA) */}
              <a 
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center inline-flex justify-center items-center gap-2 bg-slate-900 text-white font-bold py-4 px-6 rounded-xl hover:bg-[#275c58] hover:-translate-y-1 transition-all duration-300"
              >
                Cadastre-se na {partner.name}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>

            </div>
          ))}

        </div>
      </section>

      <Footer />
    </main>
  );
}