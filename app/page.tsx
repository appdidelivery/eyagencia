import HeroSection from "../components/HeroSection";
import LogoTicker from "../components/LogoTicker";
import ServicesGrid from "../components/ServicesGrid";
import Methodology from "../components/Methodology";
import ProcessTimeline from "../components/ProcessTimeline";
import ClientShowcase from "../components/ClientShowcase";
import GoogleReviews from "../components/GoogleReviews";
import BlogPreview from "../components/BlogPreview";
import WhatsAppForm from "../components/WhatsAppForm";
import Footer from "../components/Footer";

export default function Home() {
  // Configuração de SEO Técnico - JSON-LD Schema Markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "EyAgencia",
    "image": "https://eyagencia.com.br/logo.png", // Ajuste o link da logo depois
    "description": "Agência especializada em SEO Técnico, Tráfego Pago, Inbound Marketing e Gerenciamento de Mídias Sociais para E-commerce B2B e Lojistas.",
    "url": "https://eyagencia.com.br",
    "telephone": "+554832200260",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Florianópolis",
      "addressRegion": "SC",
      "addressCountry": "BR"
    },
    "taxID": "22.829.884/0001-24",
    "foundingDate": "2015",
    "sameAs": [
      "https://www.instagram.com/eyagencia", // Ajustar depois
      "https://www.facebook.com/eyagencia"  // Ajustar depois
    ],
    "offers": {
      "@type": "Offer",
      "name": "Consultoria em E-commerce e Marketing Digital"
    }
  };

  return (
    <main className="flex min-h-screen flex-col w-full bg-white">
      {/* Injeção Nativa do Schema Markup para o Googlebot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <HeroSection />
      <LogoTicker />
      <ServicesGrid />
      <Methodology />
      <ProcessTimeline />
      <ClientShowcase />
      <GoogleReviews />
      <BlogPreview />
      <WhatsAppForm />
      <Footer />
    </main>
  );
}