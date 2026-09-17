"use client";

import { useState } from "react";

// Tipagem para os dados do projeto
type Task = { id: string; title: string; description: string };
type Epic = { title: string; tasks: Task[] };
type ProjectData = { title: string; description: string; epics: Epic[] };

// Dicionário de projetos (Mock inicial - futuramente puxar do Firebase/Sanity)
const projectsDb: Record<string, ProjectData> = {
  "mvp-academias12": {
    title: "Onboarding: MVP Academia S12",
    description: "Setup Multi-tenant, Integração de Operação (PDV) e Tração. Acompanhe as etapas exatas que executaremos para colocar sua máquina no ar.",
    epics: [
      {
        title: "1. Infraestrutura & Core",
        tasks: [
          { id: "1a", title: "Provisionamento Multi-tenant", description: "Ambiente criado no Firebase Firestore e deploy Vercel." },
          { id: "1b", title: "Configuração de Domínio e Cloudinary", description: "DNS apontado, SSL ativo e pastas de mídia estruturadas." },
          { id: "1c", title: "Integração VeloPay & Crypto", description: "Efí Bank, Stripe, MP + Checkout Binance Pay validado." }
        ]
      },
      {
        title: "2. Catálogo & Operação",
        tasks: [
          { id: "2a", title: "Setup de Produtos e Preços", description: "Catálogo importado e variações validadas." },
          { id: "2b", title: "Configuração do PDV", description: "Módulo Modo Garçom ativado e testado." },
          { id: "2c", title: "Logística e Impressão", description: "Roteamento e integração Focus API para NFC-e." }
        ]
      },
      {
        title: "3. Automação & Retenção",
        tasks: [
          { id: "3a", title: "Ativação WhatsApp Cloud API", description: "Bot de atendimento e recuperação de carrinho." },
          { id: "3b", title: "Motor de Gamificação", description: "Tiers VIP, Cashback e roleta de prêmios." }
        ]
      },
      {
        title: "4. SEO, GEO & Tracking",
        tasks: [
          { id: "4a", title: "Blindagem de Densidade Factual", description: "Copys E-E-A-T sem spam de IA." },
          { id: "4b", title: "Dados Estruturados JSON-LD", description: "Marcação implementada no catálogo." },
          { id: "4c", title: "Setup de Analytics e GMN", description: "GA4, Search Console e Meu Negócio conectados." }
        ]
      },
      {
        title: "5. Tração & Go-Live",
        tasks: [
          { id: "5a", title: "Campanhas de Performance", description: "Google Ads (PMax) e Meta Ads prontas." },
          { id: "5b", title: "Auditoria de Dependências", description: "Webhooks e rotas validadas sem conflito." }
        ]
      }
    ]
  }
};

export default function OnboardingProjectPage({ params }: { params: { projetoId: string } }) {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  
  const project = projectsDb[params.projetoId];

  // Se a URL não bater com o banco de dados, exibe erro 404 customizado
  if (!project) {
    return (
      <div className="min-h-screen bg-[#0B1121] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Projeto não encontrado</h1>
          <p className="text-slate-400">Verifique a URL e tente novamente.</p>
        </div>
      </div>
    );
  }

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const totalTasks = project.epics.reduce((acc, epic) => acc + epic.tasks.length, 0);
  const progressPercent = Math.round((completedTasks.length / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-[#0B1121] text-white font-sans selection:bg-blue-500/30 pb-20">
      {/* Header Imitação VeloDelivery */}
      <header className="border-b border-white/5 bg-[#0B1121]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-sm">
              EY
            </div>
            <span className="font-semibold tracking-wide">EYAGÊNCIA <span className="text-slate-500">|</span> DASHBOARD</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-emerald-400">{progressPercent}% Concluído</span>
            <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-sm font-bold border border-white/10">
              S12
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 mt-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Setup de Growth & Tráfego
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{project.title}</h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
            {project.description}
          </p>
        </div>

        {/* Card Roadmap */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Brilho de fundo (Glow effect) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          
          <div className="flex items-center gap-3 mb-10">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            <h2 className="text-2xl font-bold">Roadmap de Implantação</h2>
          </div>

          <div className="space-y-12">
            {project.epics.map((epic, index) => (
              <div key={index} className="relative">
                <h3 className="text-xl font-semibold mb-5 text-white/90 border-b border-white/5 pb-2">{epic.title}</h3>
                
                <div className="space-y-4">
                  {epic.tasks.map((task, tIndex) => {
                    const isChecked = completedTasks.includes(task.id);
                    // Linha conectora (timeline)
                    const isLastTask = tIndex === epic.tasks.length - 1;

                    return (
                      <div 
                        key={task.id} 
                        className={`group relative flex gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border ${isChecked ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'}`}
                        onClick={() => toggleTask(task.id)}
                      >
                        {/* Linha vertical da timeline (se não for o último) */}
                        {!isLastTask && (
                           <div className={`absolute left-[31px] top-12 bottom-[-16px] w-[2px] ${isChecked ? 'bg-emerald-500/30' : 'bg-slate-700/50'}`}></div>
                        )}

                        <div className="flex-shrink-0 mt-0.5 relative z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${isChecked ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-800 border border-slate-600 text-transparent group-hover:border-slate-500'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className={`text-base font-medium transition-colors ${isChecked ? 'text-emerald-400' : 'text-slate-200'}`}>
                            {task.title}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1">
                            {task.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}