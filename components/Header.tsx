'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Adicionamos uma "prop" para definir se o fundo da página é claro (light) ou escuro (dark)
export default function Header({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' }, // Adicionado link para voltar pra Home
    { name: 'Serviços', href: '/#servicos' },
    { name: 'Processos', href: '/#nossos-processos' },
    { name: 'Clientes', href: '/clientes' },
    { name: 'Blog', href: '/blog' },
  ];

  // Regras de cor inteligentes
  const textColor = isScrolled || theme === 'light' ? 'text-slate-800' : 'text-zinc-300';
  const logoSrc = isScrolled || theme === 'light' ? '/eyagencia-logo-verde.png' : '/eyagencia-logo-branca.png';

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-slate-100' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo que muda de cor dependendo do fundo */}
        <a href="/" className="flex items-center gap-2 relative w-[160px] h-[45px]">
          <Image 
            src={logoSrc} 
            alt="EyAgencia Logo" 
            fill
            className="object-contain"
            onError={(e) => {
              // Fallback se você não tiver a logo branca/verde nomeada corretamente
              e.currentTarget.src = '/eyagencia logo.png';
            }}
          />
        </a>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className={`text-sm font-bold hover:text-[#f0815b] transition-colors ${textColor}`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* CTA Botão Desktop */}
        <div className="hidden md:flex items-center">
          <a 
            href="/#diagnostico"
            className="bg-[#275c58] text-white px-5 py-2.5 rounded-md text-sm font-bold hover:bg-[#1f4a46] transition-all shadow-md hover:-translate-y-0.5"
          >
            Falar com Especialista
          </a>
        </div>

        {/* Botão Menu Mobile */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className={`w-6 h-6 ${textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

      </div>

      {/* Menu Mobile Aberto */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl py-4 px-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-base font-bold text-slate-800 py-2 border-b border-slate-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a 
            href="/#diagnostico"
            className="bg-[#275c58] text-white px-5 py-3 rounded-md text-center text-base font-bold mt-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Falar com Especialista
          </a>
        </div>
      )}
    </header>
  );
}