"use client";
import { useEffect, useState } from "react";
import { challengePaths, missions, tracks, type Mission, type TrackId } from "./data";
import styles from "./academia.module.css";

type Stored = { proof: string; at: string };
type Progress = { completed: Record<string, Stored>; recommended?: TrackId; journey?: string };
type Page = "inicio" | "trilhas" | "progresso" | "missao";
type Level = "novo" | "uso" | "experiente";
type Goal = "aprender" | "negocio" | "renda";
const storageKey = "eyagencia-academia-ia-v1";
const initial: Progress = { completed: {} };

function record(event: string, fields: Record<string, string | number> = {}) {
  try {
    const w = window as Window & { dataLayer?: Array<Record<string, string | number>> };
    w.dataLayer ||= [];
    w.dataLayer.push({ event, area: "academia_ia", ...fields });
  } catch { /* Medição não deve impedir a experiência. */ }
}

export default function AcademiaExperience() {
  const [page, setPage] = useState<Page>("inicio");
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState<Progress>(initial);
  const [activeId, setActiveId] = useState("f01");
  const [filter, setFilter] = useState<TrackId | "todas">("todas");
  const [diagnosis, setDiagnosis] = useState(false);
  const [level, setLevel] = useState<Level>("novo");
  const [goal, setGoal] = useState<Goal>("aprender");
  const [answer, setAnswer] = useState<number | null>(null);
  const [checkedAnswer, setCheckedAnswer] = useState(false);
  const [checks, setChecks] = useState<number[]>([]);
  const [proof, setProof] = useState("");
  const [copied, setCopied] = useState(false);
  const [askReset, setAskReset] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Progress;
        const completed: Record<string, Stored> = {};
        for (const [id, item] of Object.entries(parsed.completed || {})) {
          if (missions.some(m => m.id === id) && item && typeof item.proof === "string" && typeof item.at === "string") {
            completed[id] = { proof: item.proof.slice(0, 1400), at: item.at };
          }
        }
        setProgress({
          completed,
          recommended: tracks.some(t => t.id === parsed.recommended) ? parsed.recommended : undefined,
          journey: challengePaths.some(j => j.id === parsed.journey) ? parsed.journey : undefined
        });
      }
      const requested = new URLSearchParams(window.location.search).get("missao");
      if (requested && missions.some(m => m.id === requested)) {
        setActiveId(requested);
        setPage("missao");
      }
    } catch { /* Funciona sem armazenamento permanente. */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch {}
  }, [loaded, progress]);

  const completed = progress.completed;
  const completedCount = Object.keys(completed).length;
  const xp = missions.reduce((sum, mission) => sum + (completed[mission.id] ? mission.xp : 0), 0);
  const percent = Math.round(100 * completedCount / missions.length);
  const lesson = missions.find(m => m.id === activeId) || missions[0];
  const track = tracks.find(t => t.id === lesson.track) || tracks[0];
  const journey = challengePaths.find(j => j.id === progress.journey);
  const recommended = tracks.find(t => t.id === progress.recommended);

  function move(next: Page) {
    if (next === "missao") return;
    setPage(next);
    try {
      const u = new URL(window.location.href);
      u.searchParams.delete("missao");
      window.history.replaceState({}, "", u.pathname + u.search + u.hash);
    } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function openMission(id: string) {
    const m = missions.find(x => x.id === id);
    if (!m) return;
    setActiveId(id);
    setPage("missao");
    setAnswer(null);
    setCheckedAnswer(false);
    setChecks([]);
    setProof(completed[id]?.proof || "");
    setCopied(false);
    try {
      const u = new URL(window.location.href);
      u.searchParams.set("missao", id);
      window.history.replaceState({}, "", u.pathname + u.search);
    } catch {}
    record("academy_mission_open", { mission_id: id, track_id: m.track });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function pickJourney(id: string) {
    const path = challengePaths.find(x => x.id === id);
    if (!path) return;
    setProgress(p => ({ ...p, journey: id }));
    record("academy_journey_start", { journey_id: id });
    openMission(path.ids.find(mid => !completed[mid]) || path.ids[0]);
  }
  function finishDiagnosis() {
    const recommendation: TrackId = goal === "renda" ? "renda" : goal === "negocio" || level === "experiente" ? "negocios" : "fundamentos";
    setProgress(p => ({ ...p, recommended: recommendation }));
    setFilter(recommendation);
    setDiagnosis(false);
    setPage("trilhas");
    record("academy_diagnostic_complete", { level, goal, recommended: recommendation });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(lesson.prompt);
      setCopied(true);
      record("academy_prompt_copy", { mission_id: lesson.id });
    } catch { setCopied(false); }
  }
  function finishMission() {
    if (completed[lesson.id] || answer !== lesson.quiz.correct || !checkedAnswer || checks.length !== lesson.checks.length || proof.trim().length < 20) return;
    setProgress(p => ({ ...p, completed: { ...p.completed, [lesson.id]: { proof: proof.trim().slice(0, 1400), at: new Date().toISOString() } } }));
    record("academy_mission_complete", { mission_id: lesson.id, track_id: lesson.track, xp: lesson.xp });
  }
  async function copyProgress() {
    const lines = [
      "EyAgencia · IA na Prática — meu progresso",
      "Missões: " + completedCount + "/" + missions.length,
      "Pontos: " + xp + " XP",
      ...missions.filter(m => completed[m.id]).map(m => "✓ " + m.title + " — " + new Date(completed[m.id].at).toLocaleDateString("pt-BR")),
      "Este resumo não comprova vendas nem substitui uma certificação."
    ];
    try { await navigator.clipboard.writeText(lines.join("\n")); } catch {}
  }
  const menu: { page: Page; title: string; icon: string }[] = [
    { page: "inicio", title: "Início", icon: "⌂" },
    { page: "trilhas", title: "Trilhas", icon: "◫" },
    { page: "progresso", title: "Progresso", icon: "✦" }
  ];
  function card(m: Mission, index: number) {
    const isDone = !!completed[m.id];
    return <button type="button" key={m.id} className={[styles.missionCard, isDone ? styles.missionDone : ""].join(" ")} onClick={() => openMission(m.id)}>
      <span className={styles.missionBadge}>{isDone ? "✓" : String(index + 1).padStart(2, "0")}</span>
      <span className={styles.missionInfo}><strong>{m.title}</strong><small>{m.subtitle}</small><span>{m.minutes} min · {m.xp} XP</span></span>
      <span className={styles.arrow} aria-hidden="true">↗</span>
    </button>;
  }
  return <div className={styles.site}>
    <header className={styles.header}><div className={styles.headerInner}>
      <a className={styles.brand} href="/"><span className={styles.brandIcon}>E</span><span><strong>EyAgencia</strong><small>ACADEMIA GRATUITA</small></span></a>
      <nav className={styles.topNav} aria-label="Navegação">{menu.map(m => <button type="button" key={m.page} className={page === m.page ? styles.navActive : ""} onClick={() => move(m.page)}>{m.title}</button>)}</nav>
      <button type="button" className={styles.score} onClick={() => move("progresso")}>✦ {xp} <small>XP</small></button>
    </div></header>
    {page !== "missao" && <div className={styles.statusBar}><div className={styles.statusInner}><span>100% GRATUITO · SEM CADASTRO</span><span>{completedCount} DE {missions.length} MISSÕES</span></div><div className={styles.progressBar}><span style={{ width: percent + "%" }}/></div></div>}
    <main className={styles.main}>
      {page === "inicio" && <>
        <section className={styles.hero}>
          <div className={styles.heroText}><span className={styles.eyebrow}>APRENDA FAZENDO · NÃO SÓ ASSISTINDO</span><h1>IA na prática.<br/><em>Conhecimento</em><br/>que vira entrega<span>.</span></h1><p>Do primeiro prompt a um serviço digital bem estruturado. Missões rápidas, ferramentas reais e desafios que viram portfólio — no seu ritmo.</p>
            <div className={styles.heroActions}><button type="button" className={styles.primary} onClick={() => setDiagnosis(true)}>Descobrir minha trilha →</button><button type="button" className={styles.secondary} onClick={() => openMission("f01")}>Experimentar uma missão ↗</button></div>
            <div className={styles.heroFacts}><span>✳ 15 missões</span><span>◷ 5–12 min por missão</span><span>✓ Sem cartão</span></div>
          </div>
          <div className={styles.demoVisual}><div className={styles.demoHeader}><span>SEU CAMINHO</span><span>✦ + XP</span></div><div className={styles.demoSteps}>
            <div><span className={styles.stepOrb} style={{background:"#8eecb2"}}>✳</span><span><strong>01. Comece com IA</strong><small>Crie seu primeiro resultado</small></span><b>✓</b></div>
            <div><span className={styles.stepOrb} style={{background:"#9dd8f5"}}>◈</span><span><strong>02. Resolva um problema</strong><small>Pratique no mundo real</small></span><b>↗</b></div>
            <div><span className={styles.stepOrb} style={{background:"#ffcf8c"}}>↗</span><span><strong>03. Monte sua oferta</strong><small>Mostre o que sabe entregar</small></span><b>✦</b></div>
          </div><div className={styles.demoBottom}><strong>{percent}%</strong><span>DO PERCURSO CONCLUÍDO</span><div className={styles.progressBar}><span style={{ width: percent + "%" }}/></div></div></div>
        </section>
        <section className={styles.section}><div className={styles.sectionHead}><div><span className={styles.eyebrow}>COMECE POR UM OBJETIVO</span><h2>Escolha a sua jornada.</h2></div><p>Você pode seguir o caminho sugerido ou explorar qualquer missão, sem bloqueios artificiais.</p></div><div className={styles.journeyGrid}>{challengePaths.map((j,i) => <article key={j.id} className={styles.journeyCard}><div className={styles.journeyTop}><span>{i === 0 ? "✳" : "↗"}</span><small>{i === 0 ? "IDEAL PARA INICIANTES" : "PARA CRIAR SEU PRIMEIRO SERVIÇO"}</small></div><h3>{j.name}</h3><p>{j.description}</p><div className={styles.journeyBottom}><span>{j.ids.length} missões</span><button onClick={() => pickJourney(j.id)} type="button">Começar ↗</button></div></article>)}</div></section>
        <section className={styles.section}><div className={styles.sectionHead}><div><span className={styles.eyebrow}>MAPA DE APRENDIZAGEM</span><h2>Três trilhas. Resultados concretos.</h2></div></div><div className={styles.trackGrid}>{tracks.map(t => <button type="button" className={styles.trackCard} key={t.id} onClick={() => {setFilter(t.id);move("trilhas");}}><span className={styles.trackIcon} style={{background:t.color}}>{t.symbol}</span><span className={styles.trackStatus}>{missions.filter(m => m.track === t.id && completed[m.id]).length} / 5 MISSÕES</span><strong>{t.title}</strong><small>{t.subtitle}</small><span className={styles.trackLink}>Explorar trilha ↗</span></button>)}</div></section>
        <div className={styles.notice}><strong>Projetos reais, sem promessas de renda fácil.</strong><p>As simulações servem para aprender. Um case só pode ser apresentado como resultado real com evidências, autorização e métricas verificáveis. As ferramentas externas podem ter planos pagos; as aulas são gratuitas.</p></div>
      </>}

      {page === "trilhas" && <>
        <section className={styles.pageIntro}><span className={styles.eyebrow}>SEU MAPA DE APRENDIZAGEM</span><h1>Escolha sua próxima missão.</h1><p>Cada tarefa ensina uma habilidade e termina com uma entrega prática. Faça na ordem que preferir.</p></section>
        {recommended && <div className={styles.recommend}><span>✳</span><div><strong>Recomendação do diagnóstico: {recommended.title}</strong><small>Você pode fazer todas as outras trilhas também.</small></div><button onClick={() => setDiagnosis(true)} type="button">Refazer teste</button></div>}
        <div className={styles.filters} role="group" aria-label="Filtrar trilhas"><button type="button" className={filter === "todas" ? styles.filterActive : ""} onClick={() => setFilter("todas")}>Todas · 15</button>{tracks.map(t => <button type="button" key={t.id} className={filter === t.id ? styles.filterActive : ""} onClick={() => setFilter(t.id)}>{t.title}</button>)}</div>
        {tracks.filter(t => filter === "todas" || t.id === filter).map(t => <section key={t.id} className={styles.missionSection}><div className={styles.missionSectionTitle}><span className={styles.trackIcon} style={{background:t.color}}>{t.symbol}</span><div><span className={styles.eyebrow}>TRILHA {tracks.indexOf(t)+1} · 5 MISSÕES</span><h2>{t.title}</h2><p>{t.subtitle}</p></div></div><div className={styles.missionList}>{missions.filter(m => m.track === t.id).map(card)}</div></section>)}
      </>}

      {page === "progresso" && <>
        <section className={styles.pageIntro}><span className={styles.eyebrow}>SEU ESPAÇO</span><h1>O que você já colocou em prática.</h1><p>Seu progresso está salvo neste navegador, sem precisar criar uma conta.</p></section>
        <div className={styles.stats}>{[[completedCount + " / " + missions.length,"Missões concluídas"],[String(xp),"Pontos de experiência"],[percent + "%","Caminho percorrido"]].map(([n,t]) => <div key={t}><strong>{n}</strong><small>{t}</small></div>)}</div>
        {journey && <div className={styles.journeyProgress}><strong>Jornada: {journey.name}</strong><span>{journey.ids.filter(id => completed[id]).length} de {journey.ids.length} missões concluídas</span><div className={styles.progressBar}><span style={{width:100 * journey.ids.filter(id => completed[id]).length / journey.ids.length + "%"}}/></div></div>}
        <section className={styles.section}><div className={styles.sectionHead}><div><span className={styles.eyebrow}>SEU PORTFÓLIO PESSOAL</span><h2>Missões concluídas</h2></div></div>{completedCount ? <div className={styles.missionList}>{missions.filter(m => completed[m.id]).map(card)}</div> : <div className={styles.empty}><span>✳</span><h3>A primeira conquista começa aqui.</h3><p>Complete uma missão curta, revise o resultado e registre o que produziu.</p><button type="button" className={styles.primary} onClick={() => openMission("f01")}>Fazer primeira missão →</button></div>}</section>
        <div className={styles.notice}><strong>Seus dados permanecem no aparelho</strong><p>As anotações são guardadas no armazenamento local deste navegador. Limpar os dados ou usar outro dispositivo pode apagar o progresso. Não inclua informações pessoais ou de clientes nas evidências.</p><button type="button" className={styles.secondary} onClick={copyProgress}>Copiar resumo do progresso</button></div>
        {completedCount > 0 && <div className={styles.reset}>{askReset ? <p>Apagar tudo deste navegador? <button type="button" onClick={() => {setProgress(initial);setAskReset(false);}}>Sim, apagar</button> <button type="button" onClick={() => setAskReset(false)}>Cancelar</button></p> : <button type="button" onClick={() => setAskReset(true)}>Apagar meu progresso local</button>}</div>}
      </>}

      {page === "missao" && <>
        <div className={styles.crumb}><button type="button" onClick={() => move("trilhas")}>← Todas as trilhas</button><span>/</span><span>{track.title}</span><span>/</span><strong>{lesson.id.toUpperCase()}</strong></div>
        <div className={styles.lessonLayout}><div className={styles.lessonBody}>
          <header className={styles.lessonHero}><span className={styles.eyebrow}>MISSÃO {lesson.id.toUpperCase()} · {track.title.toUpperCase()}</span><h1>{lesson.title}</h1><p>{lesson.subtitle}</p><div><span>◷ {lesson.minutes} min</span><span>✦ {lesson.xp} XP</span><span>✓ Entrega prática</span></div></header>
          {completed[lesson.id] && <div className={styles.doneAlert}>✓ Missão já concluída. Você pode revisar tudo e copiar o prompt novamente.</div>}
          <section className={styles.lessonPart}><div className={styles.partTitle}><span>01</span><h2>Entenda a ideia</h2></div><p>{lesson.concept}</p></section>
          <section className={styles.lessonPart}><div className={styles.partTitle}><span>02</span><h2>Faça o exercício</h2></div><ol className={styles.steps}>{lesson.steps.map(s => <li key={s}>{s}</li>)}</ol><div className={styles.prompt}><div><strong>PROMPT PARA ADAPTAR</strong><button type="button" onClick={copyPrompt}>{copied ? "✓ Copiado" : "Copiar prompt ↗"}</button></div><pre>{lesson.prompt}</pre></div><div className={styles.tools}><strong>Ferramentas da missão</strong><div>{lesson.tools.map(t => <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer" onClick={() => record("academy_tool_open",{mission_id:lesson.id,tool_name:t.name})}><b>{t.name} ↗</b><small>{t.why}</small></a>)}</div></div></section>
          <section className={styles.lessonPart}><div className={styles.partTitle}><span>03</span><h2>Macete de mercado</h2></div><div className={styles.tip}><strong>✦ DICA PRÁTICA</strong><p>{lesson.trick}</p></div></section>
          <section className={styles.lessonPart}><div className={styles.partTitle}><span>04</span><h2>Teste o que aprendeu</h2></div><h3 className={styles.question}>{lesson.quiz.question}</h3><fieldset className={styles.answers}><legend className={styles.screenReader}>Escolha uma alternativa</legend>{lesson.quiz.options.map((option, i) => <label key={option} className={answer === i ? styles.chosen : ""}><input type="radio" name="answer" checked={answer === i} onChange={() => {setAnswer(i);setCheckedAnswer(false);}}/><span className={styles.answerLetter}>{String.fromCharCode(65+i)}</span>{option}</label>)}</fieldset><button type="button" className={styles.secondary} disabled={answer === null} onClick={() => {setCheckedAnswer(true);record("academy_quiz_attempt",{mission_id:lesson.id,correct:answer===lesson.quiz.correct?1:0});}}>Conferir resposta</button>{checkedAnswer && <div className={answer === lesson.quiz.correct ? styles.correct : styles.wrong} role="status"><strong>{answer === lesson.quiz.correct ? "✓ Resposta correta!" : "Ainda não. Tente outra opção."}</strong><p>{answer === lesson.quiz.correct ? lesson.quiz.explanation : "Releia o conceito da missão antes de responder novamente."}</p></div>}</section>
          <section className={styles.lessonPart}><div className={styles.partTitle}><span>05</span><h2>Registre sua entrega</h2></div><div className={styles.deliverable}><strong>Resultado esperado</strong><p>{lesson.output}</p></div><fieldset className={styles.checklist}><legend>Checklist de qualidade</legend>{lesson.checks.map((check,i) => <label key={check}><input type="checkbox" checked={checks.includes(i)} onChange={e => setChecks(p => e.target.checked ? [...p,i] : p.filter(n => n !== i))}/>{check}</label>)}</fieldset><label className={styles.proofLabel} htmlFor="proof">O que você produziu? (mínimo 20 caracteres)</label><textarea id="proof" rows={4} maxLength={1400} value={proof} onChange={e => setProof(e.target.value)} placeholder="Ex.: Criei uma demonstração para uma loja fictícia e revisei todas as informações antes de finalizar. Não inclua dados de clientes."/><small className={styles.proofHelp}>Essa anotação fica neste dispositivo, não equivale a certificação ou receita comprovada.</small><button type="button" className={styles.primary} disabled={!!completed[lesson.id] || answer !== lesson.quiz.correct || !checkedAnswer || checks.length !== lesson.checks.length || proof.trim().length < 20} onClick={finishMission}>{completed[lesson.id] ? "✓ Missão concluída" : "Concluir missão · +" + lesson.xp + " XP →"}</button>{completed[lesson.id] && <button type="button" className={styles.secondary} onClick={() => {const i=missions.findIndex(m=>m.id===lesson.id);const next=missions.slice(i+1).find(m=>!completed[m.id]);if(next)openMission(next.id);else move("progresso");}}>Próxima missão ↗</button>}</section>
        </div><aside className={styles.lessonAside}><div className={styles.asideCard}><span className={styles.eyebrow}>SEU CAMINHO</span><strong>{completedCount} / {missions.length}</strong><span>MISSÕES CONCLUÍDAS</span><div className={styles.progressBar}><span style={{width:percent + "%"}}/></div><p>Aprenda no seu tempo. Você pode revisitar qualquer atividade.</p><button type="button" onClick={() => move("progresso")}>Ver progresso ↗</button></div><div className={styles.asideCard}><span className={styles.eyebrow}>NA MESMA TRILHA</span>{missions.filter(m=>m.track===lesson.track && m.id!==lesson.id).map(m=><button key={m.id} type="button" onClick={()=>openMission(m.id)}>{completed[m.id] ? "✓ " : "○ "}{m.title}</button>)}</div></aside></div>
      </>}
    </main>
    <footer className={styles.footer}><div><strong>EyAgencia · IA na Prática</strong><span>Aprenda. Execute. Comprove. Evolua.</span></div><p>Conteúdo educacional gratuito. Não há garantia de rendimentos, contratação ou resultados comerciais. Revise as respostas geradas por IA.</p><a href="/diego">Conheça o idealizador ↗</a></footer>
    <nav className={styles.mobileNav} aria-label="Navegação no celular">{menu.map(m=><button type="button" key={m.page} className={page===m.page?styles.mobileActive:""} onClick={()=>move(m.page)}><span>{m.icon}</span>{m.title}</button>)}</nav>

    {diagnosis && <div className={styles.modalBackdrop} onMouseDown={e=>{if(e.target===e.currentTarget)setDiagnosis(false);}}><div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="diagnosis-title"><div className={styles.modalTop}><span className={styles.eyebrow}>DIAGNÓSTICO RÁPIDO · 1 MINUTO</span><button type="button" aria-label="Fechar" onClick={()=>setDiagnosis(false)}>×</button></div><h2 id="diagnosis-title">Qual seu ponto de partida?</h2><fieldset><legend>Quanto você já usa IA?</legend>{([["novo","Nunca ou quase nunca usei"],["uso","Uso em tarefas simples"],["experiente","Já aplico em projetos"]] as [Level,string][]).map(([value,label])=><label key={value} className={level===value?styles.choiceSelected:styles.choice}><input type="radio" name="level" checked={level===value} onChange={()=>setLevel(value)}/>{label}</label>)}</fieldset><fieldset><legend>Qual é seu objetivo agora?</legend>{([["aprender","Aprender do zero"],["negocio","Aplicar no meu negócio"],["renda","Montar um serviço digital"]] as [Goal,string][]).map(([value,label])=><label key={value} className={goal===value?styles.choiceSelected:styles.choice}><input type="radio" name="goal" checked={goal===value} onChange={()=>setGoal(value)}/>{label}</label>)}</fieldset><button className={styles.primary} type="button" onClick={finishDiagnosis}>Ver trilha recomendada →</button><p>Não precisa criar conta nem informar dados pessoais.</p></div></div>}
  </div>;
}
