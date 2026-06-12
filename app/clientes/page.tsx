import Header from "../../components/Header";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Nossos Clientes e Cases de E-commerce | EyAgencia",
  description: "Conheça o portfólio de lojas virtuais e e-commerces B2B que aceleraram suas vendas e ranqueamento orgânico com a EyAgencia.",
};

export default function ClientesPage() {
  const allClients = [
    // Clientes Anteriores
    { name: "Soller Embalagens", url: "https://www.sollerembalagens.com.br/" },
    { name: "Mamedes Papéis", url: "https://loja.mamedes.com.br/" },
    { name: "Sacola Online", url: "https://www.sacolaonline.com.br/" },
    { name: "Pitney Embalagens", url: "https://pitney.com.br/" },
    { name: "Focco Auto", url: "https://foccoauto.com.br/" },
    { name: "Dona Mesa", url: "https://donamesa.com.br" },
    { name: "Otávio Giora", url: "https://otaviogiora.com.br" },
    { name: "Multicaixasnet", url: "https://multicaixasnet.com.br" },
    { name: "Mezzaliramix", url: "https://mezzaliramix.com.br" },
    { name: "Alcance Profissional", url: "https://alcanceprofissional.com.br" },
    { name: "Vispo Studio", url: "https://vispostudio.com.br" },
    { name: "Badulake Festas", url: "https://badulakefestas.com.br" },
    { name: "Bibi Brindes", url: "https://bibibrindes.com.br" },
    { name: "Multi Fantasias", url: "https://multifantasias.com.br" },
    { name: "Remile Baby", url: "https://remilebaby.com.br" },
    { name: "Lottus Moda", url: "https://lottusmoda.com.br" },
    { name: "Compro", url: "https://compro.com.br" },
    { name: "Rosa Bardo", url: "https://rosabardo.com.br" },
    { name: "Embalagens Original", url: "https://embalagensoriginal.com.br" },
    
    // Nova Leva de Clientes (Adicionados com formatação)
    { name: "Livewell", url: "https://livewell.com.br/" },
    { name: "Reserva Gourmet", url: "https://reservagourmet.com.br/" },
    { name: "Casa do Borracheiro", url: "https://casadoborracheiro.com.br/" },
    { name: "Gran Pneus", url: "https://granpneus.com.br/" },
    { name: "Automação Curitiba", url: "https://automacaocuritiba.com.br/" },
    { name: "Disk Etiquetas", url: "https://disketiquetas.com.br/" },
    { name: "Pnuts", url: "https://pnuts.com.br/" },
    { name: "Andanza", url: "https://andanza.com.br/" },
    { name: "Latitude 12", url: "https://latitute12.com.br/" },
    { name: "Bio Hair Shine", url: "https://biohairshine.com.br/" },
    { name: "Pack Embalagens", url: "https://packembalagens.com.br/" },
    { name: "Modella", url: "https://modella.com.br/" },
    { name: "Charlote Beauty", url: "https://charlotebeaty.com.br/" },
    { name: "Marka Sports", url: "https://markasports.com.br/" }
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
              href={client.url} 
              target="_blank" 
              rel="noopener noreferrer"
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

              {/* Botão Interno de Destaque */}
              <div className="relative z-10 flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 px-6 py-2.5 rounded-full text-sm font-bold text-zinc-400 group-hover:text-white group-hover:border-[#f0815b] group-hover:bg-[#f0815b] transition-all duration-300 w-full">
                Visitar Loja
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}