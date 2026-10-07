"use client";

import { useEffect, useMemo, useState } from "react";

type GoogleLocation = {
  locationId: string;
  title?: string;
  storeCode?: string;
  categories?: { primaryCategory?: { displayName?: string } };
  storefrontAddress?: { locality?: string; administrativeArea?: string };
};

type ReviewItem = {
  review: { id: string; reviewerName?: string; rating: number; comment?: string };
  decision: { risk: string; action: string; response: string };
};

export default function GoogleConnectionPanel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locations, setLocations] = useState<GoogleLocation[]>([]);
  const [query, setQuery] = useState("Patty");
  const [selected, setSelected] = useState<GoogleLocation | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewMeta, setReviewMeta] = useState<{ count?: number; average?: number; error?: string }>({});
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/reputation/google/locations", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Google ainda não conectado.");
        setLocations(data.locations || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Google ainda não conectado.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return locations;
    return locations.filter((item) =>
      [item.title, item.storeCode, item.categories?.primaryCategory?.displayName]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [locations, query]);

  async function selectLocation(location: GoogleLocation) {
    setSelected(location);
    setReviews([]);
    setReviewMeta({});
    setReviewsLoading(true);
    try {
      const res = await fetch(
        `/api/reputation/google/reviews?locationId=${encodeURIComponent(location.locationId)}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao carregar avaliações.");
      setReviews(data.reviews || []);
      setReviewMeta({ count: data.totalReviewCount, average: data.averageRating });
    } catch (err) {
      setReviewMeta({ error: err instanceof Error ? err.message : "Falha ao carregar avaliações." });
    } finally {
      setReviewsLoading(false);
    }
  }

  return (
    <section className="mb-8 rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-5 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">
            Google Business Profile
          </p>
          <h2 className="mt-1 text-xl font-black">Perfis gerenciados pela conta</h2>
          <p className="mt-1 text-sm text-slate-400">
            Conexão oficial OAuth. Publicação automática permanece bloqueada no piloto.
          </p>
        </div>
        <a
          href="/api/reputation/google/auth"
          className="inline-flex justify-center rounded-xl bg-blue-500 px-5 py-3 text-sm font-black text-white hover:bg-blue-400"
        >
          Conectar / reconectar Google
        </a>
      </div>

      {loading ? (
        <p className="mt-5 text-sm text-slate-400">Verificando conexão...</p>
      ) : error ? (
        <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
          {error}
        </div>
      ) : (
        <>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="text-sm text-emerald-300">
              Conectado • {locations.length} perfil(is) acessível(is)
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar perfil, ex.: Patty"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-blue-400 sm:ml-auto sm:max-w-sm"
            />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {filtered.slice(0, 20).map((location) => (
              <button
                key={location.locationId}
                type="button"
                onClick={() => selectLocation(location)}
                className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-left transition hover:border-blue-500/50"
              >
                <p className="font-bold text-slate-100">{location.title || location.locationId}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {location.categories?.primaryCategory?.displayName || "Perfil da Empresa"}
                  {location.storefrontAddress?.locality ? ` • ${location.storefrontAddress.locality}` : ""}
                </p>
              </button>
            ))}
          </div>

          {selected && (
            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Perfil selecionado</p>
              <p className="mt-1 font-bold">{selected.title}</p>
              {reviewsLoading ? (
                <p className="mt-3 text-sm text-slate-400">Carregando avaliações reais...</p>
              ) : reviewMeta.error ? (
                <p className="mt-3 text-sm text-rose-300">{reviewMeta.error}</p>
              ) : (
                <>
                  <p className="mt-3 text-sm text-slate-300">
                    {reviewMeta.count ?? reviews.length} avaliações
                    {reviewMeta.average ? ` • média ${reviewMeta.average}` : ""}
                  </p>
                  <div className="mt-3 space-y-2">
                    {reviews.slice(0, 5).map((item) => (
                      <div key={item.review.id} className="rounded-lg bg-slate-900 p-3 text-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <b>{item.review.reviewerName || "Cliente"}</b>
                          <span className="text-amber-300">{"★".repeat(item.review.rating)}</span>
                          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase text-slate-400">
                            {item.decision.action}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-slate-400">
                          {item.review.comment || "Sem comentário."}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
