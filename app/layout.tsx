import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EyAgencia | SEO Técnico, Tráfego Pago e E-commerce B2B",
  description: "Agência especialista em aceleração de lojas virtuais. Aumente seu ROAS e domine as buscas orgânicas com engenharia de marketing, Scrum e Inbound B2B.",
  keywords: ["Agência de E-commerce", "SEO Técnico", "Tráfego Pago", "Agência Vtex", "Inbound Marketing B2B", "Consultoria E-commerce"],
  
  openGraph: {
    title: 'EyAgencia | Alta Performance B2B',
    description: 'Escale seu E-commerce com engenharia de dados e metodologias validadas.',
    url: 'https://eyagencia.com.br',
    siteName: 'EyAgencia de E-commerce, Marketing Social e Digital',
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
  
  // MASTER SCHEMA MARKUP: Arquitetura aninhada (Nested) exigida pelo Google
  const masterSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness", // Mudamos de MarketingAgency para LocalBusiness (o Google prefere para locais físicos com nota)
    "@id": "https://eyagencia.com.br/#business",
    "name": "EyAgencia de E-commerce, Marketing Social e Digital",
    "url": "https://eyagencia.com.br",
    "logo": "https://eyagencia.com.br/icon.png",
    "image": "https://eyagencia.com.br/icon.png",
    "description": "Agência especializada em E-commerce, Marketing Social e Digital, focada em SEO Técnico e Tráfego Pago.",
    "telephone": "+554832200260",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "R. Ver. Arthur Manoel Mariano, SL01 - Forquilhinhas",
      "addressLocality": "São José",
      "addressRegion": "SC",
      "postalCode": "88106-500",
      "addressCountry": "BR"
    },
    // Aqui está a cura: O AggregateRating agora é perfeitamente válido dentro de um LocalBusiness
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "24"
    },
    "sameAs": [
      "https://www.instagram.com/eyagencia",
      "https://www.facebook.com/eyagencia",
      "https://www.tiktok.com/@eyagenciamkt",
      "https://www.youtube.com/@eyagenciadee-commercemktso5161"
    ],
    "department": [
      {
        "@type": "ProfessionalService",
        "name": "SEO Técnico e Consultoria"
      },
      {
        "@type": "ProfessionalService",
        "name": "Setup e Migração de E-commerce"
      }
    ]
  };

  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={inter.className}>
        {/* Injeção invisível dos dados para o Robô do Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(masterSchema) }}
        />
        {children}
      </body>
    </html>
  );
}