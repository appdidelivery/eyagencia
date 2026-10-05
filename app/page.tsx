import Header from "../components/Header";
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
  return (
    <main className="flex min-h-screen flex-col w-full bg-white">
      <Header />
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