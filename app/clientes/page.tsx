import Header from "../../components/Header";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Nossos Clientes e Cases de E-commerce | EyAgencia",
  description: "Conheça o portfólio de lojas virtuais e e-commerces B2B que aceleraram suas vendas e ranqueamento orgânico com a EyAgencia.",
};

export default function ClientesPage() {
  const allClients = [
    // Clientes Anteriores
    { name: "Soller Embalagens", url: "https://www.sollerembalagens.com.br/", internalRoute: "/clientes/soller-embalagens" },
    { name: "Mamedes Papéis", url: "https://loja.mamedes.com.br/", internalRoute: "/clientes/mamedes-papeis" },
    { name: "Sacola Online", url: "https://www.sacolaonline.com.br/", internalRoute: "/clientes/sacola-online" },
    { name: "Pitney Embalagens", url: "https://pitney.com.br/", internalRoute: "/clientes/pitney-embalagens" },
    { name: "Focco Auto", url: "https://foccoauto.com.br/", internalRoute: "/clientes/focco-auto" },
    { name: "Dona Mesa", url: "https://donamesa.com.br", internalRoute: "/clientes/dona-mesa" },
    { name: "Otávio Giora", url: "https://otaviogiora.com.br", internalRoute: "/clientes/otaviogiora" },
    { name: "Multicaixasnet", url: "https://multicaixasnet.com.br", internalRoute: "/clientes/multicaixasnet" },
    { name: "Mezzaliramix", url: "https://mezzaliramix.com.br", internalRoute: "/clientes/mezzaliramix" },
    { name: "Alcance Profissional", url: "https://alcanceprofissional.com.br", internalRoute: "/clientes/alcance-profissional" },
    { name: "Vispo Studio", url: "https://vispostudio.com.br", internalRoute: "/clientes/vispo-studio" },
    { name: "Badulake Festas", url: "https://badulakefestas.com.br", internalRoute: "/clientes/badulake-festas" },
    { name: "Bibi Brindes", url: "https://bibibrindes.com.br", internalRoute: "/clientes/bibi-brindes" },
    { name: "Multi Fantasias", url: "https://multifantasias.com.br", internalRoute: "/clientes/multi-fantasias" },
    { name: "Remile Baby", url: "https://remilebaby.com.br", internalRoute: "/clientes/remile-baby" },
    { name: "Lottus Moda", url: "https://lottusmoda.com.br", internalRoute: "/clientes/lottusmoda" },
    { name: "Compro", url: "https://compro.com.br", internalRoute: "/clientes/compro" },
    { name: "Rosa Bardo", url: "https://rosabardo.com.br", internalRoute: "/clientes/rosabardo" },
    { name: "Embalagens Original", url: "https://embalagensoriginal.com.br", internalRoute: "/clientes/embalagensoriginal" },

    // Nova Leva de Clientes
    { name: "Livewell", url: "https://livewell.com.br/", internalRoute: "/clientes/livewell" },
    { name: "Reserva Gourmet", url: "https://reservagourmet.com.br/", internalRoute: "/clientes/reserva-gourmet" },
    { name: "Casa do Borracheiro", url: "https://casadoborracheiro.com.br/", internalRoute: "/clientes/casa-do-borracheiro" },
    { name: "Gran Pneus", url: "https://granpneus.com.br/", internalRoute: "/clientes/gran-pneus" },
    { name: "Automação Curitiba", url: "https://automacaocuritiba.com.br/", internalRoute: "/clientes/automacao-curitiba" },
    { name: "Disk Etiquetas", url: "https://disketiquetas.com.br/", internalRoute: "/clientes/disk-etiquetas" },
    { name: "Pnuts", url: "https://pnuts.com.br/", internalRoute: "/clientes/pnuts" },
    { name: "Andanza", url: "https://andanza.com.br/", internalRoute: "/clientes/andanza" },
    { name: "Latitude 12", url: "https://latitute12.com.br/", internalRoute: "/clientes/latitude-12" },
    { name: "Bio Hair Shine", url: "https://biohairshine.com.br/", internalRoute: "/clientes/bio-hair-shine" },
    { name: "Pack Embalagens", url: "https://packembalagens.com.br/", internalRoute: "/clientes/pack-embalagens" },
    { name: "Modella", url: "https://modella.com.br/", internalRoute: "/clientes/modella" },
    { name: "Charlote Beauty", url: "https://charlotebeaty.com.br/", internalRoute: "/clientes/charlote-beauty" },
    { name: "Marka Sports", url: "https://markasports.com.br/", internalRoute: "/clientes/marka-sports" }
  ];

  return (
    <main className="flex min-h-screen flex-col w-full bg-zinc-950">
      {/* Forçamos o header a ficar em modo escuro aqui */}
      <Header theme="dark" />
      
      <section className="pt-40 pb-20 px-6 lg:px-8 text-center border-b border-zinc-900">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
          Nossos <span className="text-[#f0815b]">Parceiros de Escala</span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto">
          Mais de {allClients.length} operações de e-commerce já confiaram na nossa infraestrutura técnica para dominar as buscas e aumentar conversões.
        </p>
      </section>

      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allClients.map((client, i) => (
            <a 
              key={i} 
              href={client.internalRoute || client.url} 
              target={client.internalRoute ? "_self" : "_blank"} 
              rel={client.internalRoute ? "" : "noopener noreferrer"}
              className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center overflow-hidden hover:border-[#f0815b]/50 hover:bg-zinc-800/50 transition-all duration-500 group"
            >
              {/* Efeito de brilho de fundo no hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f0815b]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <h3 className="relative z-10 text-white font-bold text-xl group-hover:text-[#f0815b] transition-colors mb-2">
                {client.name}
              </h3>
              
              <span className="relative z-10 text-zinc-500 text-sm truncate w-full mb-8 group-hover:text-zinc-400 transition-colors">
                {client.url.replace('https://', '').replace('www.', '').replace(/\/$/, '')}
              </span>

              {/* Botão Interno de Destaque Condicional */}
              <div className="relative z-10 flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 px-6 py-2.5 rounded-full text-sm font-bold text-zinc-400 group-hover:text-white group-hover:border-[#f0815b] group-hover:bg-[#f0815b] transition-all duration-300 w-full">
                {client.internalRoute ? "Ver Case de Sucesso" : "Visitar Loja"}
                {client.internalRoute ? (
                  <span className="text-lg leading-none mb-[2px]">→</span>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
              </div>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}