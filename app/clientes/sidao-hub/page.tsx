import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const title = "Sidão Hub: esporte, audiência e oportunidades | EyAgencia";
const description = "Conheça o Sidão Hub, projeto desenvolvido pela EyAgencia que conecta presença digital, autoridade no esporte e oportunidades de parceria.";
const url = "https://eyagencia.com.br/clientes/sidao-hub";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: "website", locale: "pt_BR" },
};

const pillars = [
  { number: "01", title: "Autoridade", text: "Uma presença construída no esporte como ponto de partida para o projeto." },
  { number: "02", title: "Audiência", text: "O público do Sidão no centro da proposta de uma plataforma própria." },
  { number: "03", title: "Parcerias", text: "A conexão com marcas como caminho para novas oportunidades comerciais." },
];

export default function SidaoHubCase() {
  return (
    <>
      <Header theme="dark" />
      <main className="min-h-screen bg-zinc-950 text-white">
        <article>
          <header className="relative overflow-hidden border-b border-zinc-800 px-6 pb-20 pt-36 lg:px-8 lg:pb-28 lg:pt-44">
            <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#275c58]/25 blur-3xl" />
            <div className="relative mx-auto max-w-7xl">
              <Link href="/clientes" className="text-sm text-zinc-400 transition-colors hover:text-white">← Todos os cases</Link>
              <div className="mt-12 grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
                <div>
                  <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-[#f0815b]">Case de cliente · Plataforma digital para creator</p>
                  <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">Sidão Hub.<br /><span className="text-[#f0815b]">O esporte conecta.</span><br />O digital aproxima.</h1>
                  <p className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-400">Um projeto da EYagencia para conectar a autoridade do Sidão no esporte, sua audiência e as oportunidades que nascem dessa relação.</p>
                  <a href="#projeto" className="mt-9 inline-flex rounded-full bg-[#f0815b] px-7 py-4 font-bold text-zinc-950 transition-colors hover:bg-[#ffa17f]">Conheça o projeto ↓</a>
                </div>
                <div className="relative rounded-3xl border border-zinc-700 bg-gradient-to-br from-[#275c58]/40 via-zinc-900 to-zinc-950 p-7 sm:p-10">
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-6 text-xs uppercase tracking-widest text-zinc-400"><span>Esporte & conexão</span><span className="text-[#f0815b]">EY × Sidão</span></div>
                  <div className="py-12 sm:py-16">
                    <p className="text-6xl font-black tracking-tighter sm:text-7xl">SIDÃO<span className="text-[#f0815b]">.</span></p>
                    <p className="mt-2 text-3xl font-light tracking-[0.3em] text-zinc-300">HUB</p>
                    <div className="my-8 h-1 w-16 bg-[#f0815b]" />
                    <p className="max-w-xs text-lg leading-relaxed text-zinc-300">Autoridade que inspira.<br />Conexões que abrem possibilidades.</p>
                  </div>
                  <div className="flex flex-wrap gap-2 border-t border-white/10 pt-6">{["Esporte", "Audiência", "Parcerias"].map((item) => <span key={item} className="rounded-full border border-white/15 px-4 py-2 text-xs text-zinc-300">{item}</span>)}</div>
                </div>
              </div>
            </div>
          </header>

          <section id="projeto" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-20 lg:px-8 lg:py-28">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
              <div><p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#f0815b]">O contexto</p><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Uma relação com o esporte que vai além do conteúdo.</h2></div>
              <div className="space-y-5 text-lg leading-relaxed text-zinc-400"><p>O Sidão tem uma presença forte no nicho esportivo e uma relação com marcas parceiras. O Sidão Hub é o projeto que desenvolvemos a partir desse universo.</p><p>A proposta é aproximar essa autoridade das possibilidades do digital: uma plataforma própria como ponto de conexão entre sua presença, seu público e oportunidades de negócio.</p></div>
            </div>
            <div className="mt-14 grid gap-5 md:grid-cols-3">{pillars.map((pillar) => <div key={pillar.number} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8"><span className="font-mono text-sm text-[#f0815b]">{pillar.number}</span><h3 className="mb-3 mt-7 text-2xl font-bold">{pillar.title}</h3><p className="leading-relaxed text-zinc-400">{pillar.text}</p></div>)}</div>
          </section>

          <section className="border-y border-zinc-800 bg-zinc-900/40 px-6 py-20 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-20">
              <div><p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#f0815b]">O projeto</p><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Sidão Hub:<br />uma presença digital própria.</h2><p className="mt-6 text-lg leading-relaxed text-zinc-400">Desenvolvido pela EYagencia, o hub coloca a marca pessoal do Sidão no centro da experiência. Este case apresenta a conexão entre o projeto e sua atuação no esporte.</p></div>
              <div className="rounded-2xl border border-[#275c58] bg-[#275c58]/15 p-8 sm:p-10"><p className="text-xs font-bold uppercase tracking-widest text-[#f0815b]">A conexão com o nosso trabalho</p><h3 className="mt-5 text-2xl font-bold">Da atenção à oportunidade comercial.</h3><p className="mt-5 leading-relaxed text-zinc-300">No e-commerce, conectamos marcas e consumidores. Neste projeto, o ponto de partida é a relação entre um creator, seu público e marcas parceiras. A experiência digital aproxima essas pontas e abre espaço para novas iniciativas.</p></div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
              <div><span className="inline-flex rounded-full border border-[#f0815b]/30 bg-[#f0815b]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#f0815b]">Próxima etapa · Prevista</span><h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">Parcerias e afiliados.</h2></div>
              <div><p className="text-lg leading-relaxed text-zinc-400">A evolução prevista é um microproduto voltado a parcerias e afiliados, conectado à atuação do Sidão com marcas do esporte. Essa frente amplia as possibilidades comerciais do hub.</p><p className="mt-5 leading-relaxed text-zinc-500">O microproduto faz parte dos próximos passos do projeto. Sua implementação e seus resultados serão apresentados em uma atualização deste case.</p></div>
            </div>
            <div className="mt-20 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#275c58]/20 px-6 py-14 text-center sm:px-12">
              <p className="text-xs font-bold uppercase tracking-widest text-[#f0815b]">Vamos conversar</p>
              <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">Qual é o próximo passo digital da sua marca?</h2>
              <p className="mx-auto mt-5 max-w-xl leading-relaxed text-zinc-400">Conte seu momento para a EYagencia. Vamos entender como conectar presença digital e oportunidades de negócio.</p>
              <a href="https://wa.me/554832200260" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex rounded-full bg-[#f0815b] px-8 py-4 font-bold text-zinc-950 transition-colors hover:bg-[#ffa17f]">Conversar com a EYagencia ↗</a>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
