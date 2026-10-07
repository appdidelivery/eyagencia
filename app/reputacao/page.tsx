import type { Metadata } from "next";
import { evaluateReview } from "./engine";
import { pattyPilotReviews, pattyProfile } from "./patty-data";
import ReviewPlayground from "./ReviewPlayground";
import GoogleConnectionPanel from "./GoogleConnectionPanel";

export const metadata: Metadata = {
  title: "Reputation AI | eYagencia",
  description: "Painel piloto de gestão inteligente de avaliações.",
  robots: { index: false, follow: false },
};

const actionLabel = {
  auto_publicar: "Auto",
  revisao_humana: "Aprovação",
  crise: "Crise",
};

const riskLabel = {
  elogio: "Elogio",
  positivo_com_ressalva: "Positivo c/ ressalva",
  neutro: "Neutro",
  insatisfacao: "Insatisfação",
  crise: "Crise",
};

export default function ReputationPage() {
  const items = pattyPilotReviews.map((review) => ({
    review,
    decision: evaluateReview(review, pattyProfile),
  }));

  const auto = items.filter((item) => item.decision.action === "auto_publicar").length;
  const approval = items.filter((item) => item.decision.action === "revisao_humana").length;
  const crisis = items.filter((item) => item.decision.action === "crise").length;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              Piloto • publicação automática desligada
            </div>
            <h1 className="text-3xl font-black tracking-tight md:text-5xl">Google Reputation AI</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 md:text-base">
              Classificação de reviews, geração de respostas com contexto local e regras de segurança para SEO, GEO e E-E-A-T.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Cliente piloto</p>
            <p className="mt-1 font-bold">{pattyProfile.name}</p>
            <p className="text-sm text-slate-400">{pattyProfile.category} • {pattyProfile.city}</p>
          </div>
        </div>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Reviews no piloto", items.length.toString(), "amostra real de cenários"],
            ["Automáticos", auto.toString(), "positivos e sem risco"],
            ["Aprovação", approval.toString(), "ressalvas ou 3 estrelas"],
            ["Crise", crisis.toString(), "1–2 estrelas ou risco"],
          ].map(([label, value, hint]) => (
            <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-3xl font-black">{value}</p>
              <p className="mt-1 text-xs text-slate-500">{hint}</p>
            </div>
          ))}
        </section>

        <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6">
          <h2 className="text-lg font-bold">Regras do piloto</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
            <div className="rounded-xl bg-slate-950/70 p-4">
              <b className="text-emerald-300">4–5 estrelas</b>
              <p className="mt-1 text-slate-400">Publicação automática apenas quando não existe sinal de reclamação ou risco.</p>
            </div>
            <div className="rounded-xl bg-slate-950/70 p-4">
              <b className="text-amber-300">3 estrelas / ressalva</b>
              <p className="mt-1 text-slate-400">A resposta é sugerida, mas passa por validação humana.</p>
            </div>
            <div className="rounded-xl bg-slate-950/70 p-4">
              <b className="text-rose-300">1–2 estrelas / crise</b>
              <p className="mt-1 text-slate-400">Nunca publica sozinha. Evita admissão de culpa e encaminha para tratamento humano.</p>
            </div>
          </div>
        </section>

        <GoogleConnectionPanel />

        <ReviewPlayground />

        <section className="space-y-4">
          {items.map(({ review, decision }) => (
            <article key={review.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{review.reviewerName}</h3>
                    <span className="text-amber-300">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                  </div>
                  <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">{review.comment || "Sem comentário."}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                    {riskLabel[decision.risk]}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-950">
                    {actionLabel[decision.action]}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_2fr]">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Leitura do motor</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {decision.detectedServices.map((service) => (
                      <span key={service} className="rounded-full bg-sky-400/10 px-2.5 py-1 text-xs text-sky-300">{service}</span>
                    ))}
                    {decision.detectedProfessionals.map((professional) => (
                      <span key={professional} className="rounded-full bg-violet-400/10 px-2.5 py-1 text-xs text-violet-300">{professional}</span>
                    ))}
                    {!decision.detectedServices.length && !decision.detectedProfessionals.length && (
                      <span className="text-xs text-slate-500">Sem entidade específica citada.</span>
                    )}
                  </div>
                  <ul className="mt-3 space-y-1 text-xs text-slate-500">
                    {decision.reasons.map((reason) => <li key={reason}>• {reason}</li>)}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Resposta sugerida</p>
                  <p className="mt-3 text-sm leading-6 text-slate-200">{decision.response}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-dashed border-slate-700 p-5 text-sm text-slate-400">
          <b className="text-slate-200">Status:</b> OAuth do Google Business Profile integrado. No piloto, a conta é conectada e os perfis/reviews podem ser consultados, enquanto respostas reais continuam bloqueadas por dry-run.
        </section>
      </div>
    </main>
  );
}
