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
        "description": "Agência especialista em setup de e-commerce B2B, estratégias avançadas de SEO Técnico e Tráfego Pago.",
        "sameAs": [
          "https://www.facebook.com/eyagencia",
          "https://www.instagram.com/eyagencia",
          "https://www.youtube.com/@eyagenciadee-commercemktso5161",
          "https://www.tiktok.com/@eyagenciamkt"
        ]
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://eyagencia.com.br/#localbusiness",
        "name": "EyAgencia",
        "url": "https://eyagencia.com.br",
        "telephone": "+554832200260",
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
          
          {/* Coluna 1: Marca e Redes */}
          <div>
            <a href="#" className="text-2xl font-black text-white tracking-tight flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-[#275c58]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
              EyAgencia
            </a>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mb-6">
              Alta Performance B2B. Acelerando ecossistemas de e-commerce com engenharia de dados, SEO e Inbound Marketing.
            </p>
            
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/eyagencia" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-pink-500 transition-colors" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.facebook.com/eyagencia" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-blue-600 transition-colors" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@eyagenciamkt" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" aria-label="TikTok">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.96-.5 3.96-1.72 5.39-1.14 1.36-2.8 2.18-4.59 2.3-1.85.1-3.7-.35-5.1-1.46-1.35-1.09-2.14-2.73-2.31-4.43-.17-1.86.3-3.77 1.37-5.26 1.05-1.45 2.65-2.36 4.39-2.6.21-.03.42-.04.64-.04v4.13c-1.33-.1-2.63.49-3.4 1.51-.76 1.01-.89 2.45-.3 3.58.55 1.06 1.64 1.74 2.84 1.77 1.18.04 2.3-.5 2.98-1.45.64-.89.92-2.02.94-3.11v-15.6h4.3v.01z"/></svg>
              </a>
              <a href="https://www.youtube.com/@eyagenciadee-commercemktso5161" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-red-600 transition-colors" aria-label="YouTube">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Coluna 2: Links Rápidos com Âncoras */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Links Rápidos</h4>
            <ul className="space-y-3">
              <li><a href="#servicos" className="text-zinc-400 hover:text-[#f0815b] transition-colors text-sm font-medium">Nossos Serviços</a></li>
              <li><a href="#nossos-processos" className="text-zinc-400 hover:text-[#f0815b] transition-colors text-sm font-medium">Processo de Trabalho</a></li>
              <li><a href="#clientes" className="text-zinc-400 hover:text-[#f0815b] transition-colors text-sm font-medium">Clientes e Cases</a></li>
              <li><a href="#diagnostico" className="text-zinc-400 hover:text-[#f0815b] transition-colors text-sm font-medium">Agendar Diagnóstico</a></li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Contato e Base Operacional</h4>
            <ul className="space-y-3 text-sm text-zinc-400 font-medium">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#275c58] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>São José, Santa Catarina<br/>Brasil</span>
              </li>
              <li className="flex items-center gap-3">
                <a href="mailto:contato@eyagencia.com.br" className="hover:text-white transition-colors flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#275c58] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  contato@eyagencia.com.br
                </a>
              </li>
              <li className="flex items-center gap-3">
                <a href="https://wa.me/554832200260" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#275c58] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  +55 48 3220-0260
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* SELOS DE CREDIBILIDADE (CÓDIGO PURO - NÃO QUEBRAM NUNCA MAIS) */}
        <div className="py-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest text-center md:text-left">
            Credibilidade e Segurança
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            
            {/* Google Safe Browsing */}
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded px-4 py-2 hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
              <span className="text-sm font-bold text-zinc-300">Safe Browsing</span>
            </div>

            {/* Google Partner */}
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded px-4 py-2 hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <span className="text-sm font-bold text-zinc-300">Partner</span>
            </div>

            {/* Meta Business Partner */}
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded px-4 py-2 hover:bg-zinc-800 transition-colors">
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c-1.3 0-2.4-.6-3-1.6-1.5 2.5-4 4.1-7 4.1-3.9 0-7-3.1-7-7s3.1-7 7-7c3 0 5.5 1.6 7 4.1 1.5-2.5 4-4.1 7-4.1 3.9 0 7 3.1 7 7s-3.1 7-7 7c-3 0-5.5-1.6-7-4.1-.6 1-1.7 1.6-3 1.6z"/></svg>
              <span className="text-sm font-bold text-zinc-300">Business Partner</span>
            </div>

            {/* ABComm */}
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded px-4 py-2 hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className="text-sm font-bold text-zinc-300">Associado ABComm</span>
            </div>

          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600 font-medium">
            © {currentYear} EyAgencia. Todos os direitos reservados. CNPJ: 22.829.884/0001-24.
          </p>
        </div>
        
      </div>
    </footer>
  );
}