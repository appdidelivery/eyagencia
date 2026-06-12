import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Mantendo a fonte padrão otimizada do Next.js
const inter = Inter({ subsets: ["latin"] });

// O CORAÇÃO DO SEO GLOBAL DA EYAGENCIA
export const metadata: Metadata = {
  title: "EyAgencia | SEO Técnico, Tráfego Pago e E-commerce B2B",
  description: "Agência especialista em aceleração de lojas virtuais. Aumente seu ROAS e domine as buscas orgânicas com engenharia de marketing, Scrum e Inbound B2B.",
  keywords: ["Agência de E-commerce", "SEO Técnico", "Tráfego Pago", "Agência Vtex", "Inbound Marketing B2B", "Consultoria E-commerce"],
  
  // Forçando o seu Favicon em todos os formatos possíveis
  icons: {
    icon: '/eyagencia-logo-verde.png', 
    shortcut: '/eyagencia-logo-verde.png',
    apple: '/eyagencia-logo-verde.png',
  },
  
  // OpenGraph: É isso que aparece quando você manda o link do site no WhatsApp, LinkedIn ou Instagram
  openGraph: {
    title: 'EyAgencia | Alta Performance B2B',
    description: 'Escale seu E-commerce com engenharia de dados e metodologias validadas.',
    url: 'https://eyagencia.com.br',
    siteName: 'EyAgencia',
    images: [
      {
        url: '/eyagencia-logo-verde.png',
        width: 1200,
        height: 630,
        alt: 'Logo EyAgencia',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  
  // Configuração para robôs do Google indexarem tudo
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Definimos o idioma oficial e o comportamento de scroll suave (para os botões do menu funcionarem macios)
    <html lang="pt-BR" className="scroll-smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}