// app/page.tsx (Como deve ficar após a edição)

import HeroSection from "../components/HeroSection";
import LogoTicker from "../components/LogoTicker"; // <--- NOVO IMPORT

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <HeroSection />
      <LogoTicker /> {/* <--- NOVO COMPONENTE */}
    </main>
  );
}