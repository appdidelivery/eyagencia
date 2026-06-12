import Header from "../../components/Header";
import Footer from "../../components/Footer";

// SEO Técnico Nativo para a página de Clientes
export const metadata = {
  title: "Nossos Clientes e Cases de E-commerce | EyAgencia",
  description: "Conheça o portfólio de lojas virtuais e e-commerces B2B que aceleraram suas vendas e ranqueamento orgânico com a EyAgencia.",
};

export default function ClientesPage() {
  const allClients = [
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
    { name: "Embalagens Original", url: "https://embalagensoriginal.com.br" }
  ];

  return (
    <main className="flex min-h-screen flex-col w-full bg-zinc-950">
      <Header />
      
      {/* Hero da Página de Clientes */}
      <section className="pt-40 pb-20 px-6 lg:px-8 text-center border-b border-zinc-900">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
          Nossos <span className="text-[#f0815b]">Parceiros de Escala</span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto">
          Mais de 100 operações de e-commerce já confiaram na nossa infraestrutura técnica para dominar as buscas e aumentar conversões.
        </p>
      </section>

      {/* Grid de Todos os Clientes */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allClients.map((client, i) => (
            <a 
              key={i} 
              href={client.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-zinc-800 hover:border-[#275c58] transition-all duration-300 group"
            >
              <h3 className="text-white font-bold text-lg group-hover:text-[#f0815b] transition-colors mb-2">
                {client.name}
              </h3>
              <span className="text-zinc-500 text-sm truncate w-full group-hover:text-zinc-300 transition-colors">
                {client.url.replace('https://', '').replace('www.', '')}
              </span>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}