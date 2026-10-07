"use client";

import { FormEvent, useState } from "react";

type Result = {
  decision?: {
    risk: string;
    action: string;
    reasons: string[];
    detectedServices: string[];
    detectedProfessionals: string[];
  };
  finalResponse?: string;
  ai?: {
    used?: boolean;
    model?: string;
    fallbackReason?: string;
    usage?: { total_tokens?: number };
  };
  error?: string;
};

export default function ReviewPlayground() {
  const [name, setName] = useState("Cliente teste");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("Amei o atendimento e o corte, equipe muito atenciosa!");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/reputation/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: `playground-${Date.now()}`,
          reviewerName: name,
          rating,
          comment,
        }),
      });
      const data = (await response.json()) as Result;
      setResult(data);
    } catch {
      setResult({ error: "Falha ao chamar o motor." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Teste ao vivo</p>
          <h2 className="mt-1 text-xl font-black">Simule um review da Patty</h2>
          <p className="mt-1 text-sm text-slate-400">
            O motor de segurança classifica primeiro; a IA só redige dentro das regras aprovadas.
          </p>
        </div>
        <span className="text-xs text-slate-500">Sem publicação no Google</span>
      </div>

      <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-[1fr_160px]">
        <label className="text-sm text-slate-300">
          Nome
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-500"
          />
        </label>
        <label className="text-sm text-slate-300">
          Estrelas
          <select
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-500"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>{value} estrelas</option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-300 md:col-span-2">
          Avaliação
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
            className="mt-2 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-500"
          />
        </label>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-emerald-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-200 disabled:opacity-50"
          >
            {loading ? "Analisando..." : "Analisar e gerar resposta"}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/80 p-4">
          {result.error ? (
            <p className="text-sm text-rose-300">{result.error}</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-slate-800 px-3 py-1">Risco: {result.decision?.risk}</span>
                <span className="rounded-full bg-slate-800 px-3 py-1">Ação: {result.decision?.action}</span>
                <span className="rounded-full bg-slate-800 px-3 py-1">
                  {result.ai?.used ? `IA: ${result.ai.model}` : "Fallback seguro"}
                </span>
                {result.ai?.usage?.total_tokens ? (
                  <span className="rounded-full bg-slate-800 px-3 py-1">{result.ai.usage.total_tokens} tokens</span>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-200">{result.finalResponse}</p>
              {result.ai?.fallbackReason ? (
                <p className="mt-3 text-xs text-slate-500">Motivo do fallback: {result.ai.fallbackReason}</p>
              ) : null}
            </>
          )}
        </div>
      )}
    </section>
  );
}
