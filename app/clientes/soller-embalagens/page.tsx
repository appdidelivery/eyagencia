import type { Metadata } from "next";

// METADADOS DE SEO: Essencial para o Google indexar o case corretamente
export const metadata: Metadata = {
  title: "Case de Sucesso: Soller Embalagens | EyAgencia",
  description: "Descubra como a EyAgencia estruturou o SEO Técnico e escalou as operações B2B da Soller Embalagens.",
  keywords: ["Case de Sucesso E-commerce", "SEO para B2B", "Tráfego Pago Soller Embalagens", "EyAgencia Cases"],
};

export default function SollerCaseStudy() {
  // JSON-LD: Dizendo para o robô do Google que isso é um Artigo/Case real validando o E-E-A-T
  const caseSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://eyagencia.com.br/clientes/soller-embalagens"
    },
    "headline": "Como escalamos a operação B2B da Soller Embalagens",
    "description": "Estudo de caso detalhando a reestruturação de SEO e campanhas de ROAS para a Soller Embalagens.",
    "author": {
      "@type": "Organization",
      "name": "EyAgencia",
      "url": "https://eyagencia.com.br"
    },
    "publisher": {
      "@type": "Organization",
      "name": "EyAgencia",
      "logo": {
        "@type": "ImageObject",
        "url": "https://eyagencia.com.br/icon.png"
      }
    },
    "datePublished": "2026-07-01",
    "dateModified": "2026-07-01"
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      {/* Injeção invisível do Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema) }}
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* CABEÇALHO DO CASE */}
        <div className="mb-16 border-b border-zinc-800 pb-10">
          <span className="text-[#f0815b] font-semibold tracking-wider uppercase text-sm mb-4 block">
            Case de Sucesso B2B
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
            Soller Embalagens: Estruturação técnica e escala em vendas complexas.
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Como aplicamos engenharia de dados e metodologia Scrum para transformar a presença digital de uma das principais fornecedoras de embalagens.
          </p>
        </div>

        {/* CORPO DO CASE: PROBLEMA, SOLUÇÃO E RESULTADO */}
        <div className="space-y-12 text-zinc-300 leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. O Desafio</h2>
            <p className="mb-4">
              A operação necessitava de uma barreira técnica mais robusta para competir organicamente. O desafio principal era estruturar a arquitetura de informação e preparar o terreno para campanhas de alta performance (Tráfego Pago) sem desperdício de verba, focando no Lifetime Value (LTV) de clientes B2B.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. A Execução Cirúrgica</h2>
            <ul className="space-y-4 list-disc pl-5">
              <li>
                <strong className="text-zinc-100">Auditoria e SEO Técnico:</strong> Correção de rotas, injeção de dados estruturados e otimização para o Update MUVERA, garantindo uma fundação sólida para a busca orgânica.
              </li>
              <li>
                <strong className="text-zinc-100">Gestão Ágil:</strong> Implementação de sprints estruturadas para garantir entregas pontuais e visibilidade total do projeto.
              </li>
              <li>
                <strong className="text-zinc-100">Performance e Inbound:</strong> Mapeamento da jornada de compra B2B e criação de campanhas focadas em ROAS previsível.
              </li>
            </ul>
          </section>

          {/* DESTAQUE DE RESULTADOS (O que vende a agência) */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 my-10">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Impacto Gerado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <span className="block text-4xl font-black text-[#275c58] mb-2">+140%</span>
                <span className="text-sm font-medium text-zinc-400 uppercase tracking-wide">Tráfego Orgânico</span>
              </div>
              <div>
                <span className="block text-4xl font-black text-[#275c58] mb-2">Setup</span>
                <span className="text-sm font-medium text-zinc-400 uppercase tracking-wide">Arquitetura Validada</span>
              </div>
              <div>
                <span className="block text-4xl font-black text-[#275c58] mb-2">Otimizado</span>
                <span className="text-sm font-medium text-zinc-400 uppercase tracking-wide">CAC / ROAS</span>
              </div>
            </div>
          </section>

        </div>

        {/* CALL TO ACTION */}
        <div className="mt-16 pt-10 border-t border-zinc-800 text-center">
          <h4 className="text-2xl font-bold text-white mb-4">Quer escalar sua operação como a Soller?</h4>
          <p className="text-zinc-400 mb-8">
            Agende um diagnóstico técnico gratuito e descubra os gargalos do seu e-commerce.
          </p>
          <a href="/" className="inline-block bg-[#f0815b] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#d96a45] transition-colors">
            Falar com Especialista
          </a>
        </div>

      </div>
    </main>
  );
}