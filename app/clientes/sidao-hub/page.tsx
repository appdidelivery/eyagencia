import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const title = "Sidão Hub: esporte, audiência e oportunidades | EyAgencia";
const description = "Conheça o Sidão Hub, projeto desenvolvido pela EyAgencia que conecta presença digital, autoridade no esporte e oportunidades de parceria.";
const url = "https://eyagencia.com.br/clientes/sidao-hub";
const officialSite = "https://sidao12.com.br/";

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
                  <div className="mt-9 flex flex-wrap gap-3">
                    <a href={officialSite} target="_blank" rel="noopener" className="inline-flex rounded-full bg-[#f0815b] px-7 py-4 font-bold text-zinc-950 transition-colors hover:bg-[#ffa17f]">Visitar o site do Sidão ↗</a>
                    <a href="#projeto" className="inline-flex rounded-full border border-zinc-700 px-7 py-4 font-bold text-white transition-colors hover:bg-zinc-800">Conheça o projeto ↓</a>
                  </div>
                </div>
                <figure className="relative overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-900">
                  <Image src="/cases/sidao-hub/retrato.png" alt="Retrato de Sidão usando blazer preto" width={1086} height={1448} sizes="(max-width: 1023px) calc(100vw - 48px), 520px" preload className="aspect-[3/4] w-full object-cover" />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent px-7 pb-7 pt-24 sm:px-10 sm:pb-10">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f0815b]">Esporte · Audiência · Parcerias</p>
                    <p className="mt-3 text-4xl font-black tracking-tight">SIDÃO HUB<span className="text-[#f0815b]">.</span></p>
                    <a href={officialSite} target="_blank" rel="noopener" className="mt-3 inline-flex text-sm text-zinc-300 underline decoration-zinc-500 underline-offset-4 transition-colors hover:text-white">sidao12.com.br ↗</a>
                  </figcaption>
                </figure>
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

          <section aria-labelledby="galeria-sidao" className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28">
            <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#f0815b]">Dentro e fora de campo</p>
                <h2 id="galeria-sidao" className="text-3xl font-bold tracking-tight sm:text-4xl">Uma trajetória em imagens.</h2>
              </div>
              <a href={officialSite} target="_blank" rel="noopener" className="shrink-0 text-sm font-semibold text-[#f0815b] underline underline-offset-4 hover:text-white">Conheça o Sidão no site oficial ↗</a>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <figure className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 md:row-span-2">
                <Image src="/cases/sidao-hub/poker.jpeg" alt="Sidão segurando uma bola e usando luvas da Poker" width={916} height={1600} sizes="(max-width: 767px) calc(100vw - 48px), 600px" className="aspect-[3/4] w-full object-cover object-top md:absolute md:inset-0 md:h-full" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-6 pb-6 pt-20"><p className="text-xs font-bold uppercase tracking-widest text-[#f0815b]">Conexões com marcas</p><p className="mt-2 text-xl font-bold">Sidão com equipamentos Poker</p></figcaption>
              </figure>
              <figure className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                <Image src="/cases/sidao-hub/sao-paulo.webp" alt="Sidão em ação no gol, com uniforme do São Paulo" width={640} height={392} sizes="(max-width: 767px) calc(100vw - 48px), 600px" className="aspect-[16/10] w-full object-cover" />
                <figcaption className="px-6 py-5"><p className="text-xs font-bold uppercase tracking-widest text-[#f0815b]">Dentro de campo</p><p className="mt-2 font-semibold">Um registro da trajetória no São Paulo</p></figcaption>
              </figure>
              <figure className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                <Image src="/cases/sidao-hub/vasco.webp" alt="Sidão durante entrevista diante de um painel de patrocinadores" width={640} height={320} sizes="(max-width: 767px) calc(100vw - 48px), 600px" className="aspect-[2/1] w-full object-cover" />
                <figcaption className="px-6 py-5"><p className="text-xs font-bold uppercase tracking-widest text-[#f0815b]">Além do jogo</p><p className="mt-2 font-semibold">A presença e a voz do atleta</p></figcaption>
              </figure>
            </div>
            <p className="mt-5 text-sm text-zinc-500">Imagens do <a href={officialSite} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-zinc-300">site oficial do Sidão</a>.</p>
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
