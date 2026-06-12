'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const seoSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://eyagencia.com.br/#organization",
        "name": "EyAgencia",
        "url": "https://eyagencia.com.br",
        "logo": "https://eyagencia.com.br/eyagencia-logo.png",
        "description": "Agência especialista em setup de e-commerce B2B, estratégias avançadas de SEO Técnico e Tráfego Pago."
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://eyagencia.com.br/#localbusiness",
        "name": "EyAgencia",
        "url": "https://eyagencia.com.br",
        "telephone": "+554832200260",
        "description": "Agência de e-commerce e SEO focada em alta performance e aceleração de lojistas.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "São José",
          "addressRegion": "SC",
          "addressCountry": "BR"
        }
      }
    ]
  };

  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-900 pt-16 pb-8 px-6 lg:px-8 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seoSchema) }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <span className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <svg className="w-6 h-6 text-[#275c58]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
              EyAgencia
            </span>
            <p className="mt-4 text-zinc-400 text-sm leading-relaxed max-w-xs">
              Alta Performance B2B. Acelerando ecossistemas de e-commerce com engenharia de dados, SEO e Inbound Marketing.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Links Rápidos</h4>
            <ul className="space-y-3">
              <li><a href="/servicos" className="text-zinc-400 hover:text-[#f0815b] transition-colors text-sm font-medium">Nossos Serviços</a></li>
              <li><a href="/sobre" className="text-zinc-400 hover:text-[#f0815b] transition-colors text-sm font-medium">Sobre a Agência</a></li>
              <li><a href="/clientes" className="text-zinc-400 hover:text-[#f0815b] transition-colors text-sm font-medium">Clientes e Cases</a></li>
              <li><a href="/blog" className="text-zinc-400 hover:text-[#f0815b] transition-colors text-sm font-medium">Blog & Conteúdo</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Contato e Base Operacional</h4>
            <ul className="space-y-3 text-sm text-zinc-400 font-medium">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#275c58] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>São José, Santa Catarina<br/>Brasil</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#275c58] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span>contato@eyagencia.com.br</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#275c58] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>+55 48 3220-0260</span>
              </li>
            </ul>
          </div>
        </div>

        {/* SELOS DE CREDIBILIDADE (ATUALIZADOS CONFORME SEU PEDIDO) */}
        <div className="py-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest text-center md:text-left">
            Credibilidade e Segurança
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            
            {/* Google Safe Browsing */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded px-3 py-1.5">
              <span className="text-xs font-bold text-zinc-300">Google Safe Browsing</span>
            </div>

            {/* Google Partner */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded px-3 py-1.5">
              <span className="text-xs font-bold text-blue-400">Google Partner</span>
            </div>

            {/* Meta Business Partner */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded px-3 py-1.5">
              <span className="text-xs font-bold text-blue-600">Meta Business Partner</span>
            </div>

            {/* Instagram Ads */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded px-3 py-1.5">
              <span className="text-xs font-bold text-pink-500">Instagram Ads</span>
            </div>

            {/* ABComm */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded px-3 py-1.5">
              <span className="text-xs font-bold text-green-500">Associado ABComm</span>
            </div>

          </div>
        </div>

        <div className="pt-6 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600 font-medium">
            © {currentYear} EyAgencia. Todos os direitos reservados. CNPJ: 22.829.884/0001-24.
          </p>
          <div className="text-xs text-zinc-500 flex gap-4 font-medium">
            <a href="/privacidade" className="hover:text-zinc-300 transition-colors">Política de Privacidade</a>
            <a href="/termos" className="hover:text-zinc-300 transition-colors">Termos de Uso</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}