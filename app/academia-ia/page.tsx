import type { Metadata } from "next";
import AcademiaExperience from "./AcademiaExperience";
import { academyUrl, missions, tracks } from "./data";

export const metadata: Metadata = {
  title: "IA na Prática | Academia gratuita de IA da EyAgencia",
  description: "Aprenda IA do zero, aplique em negócios e construa um serviço digital. 15 missões gratuitas com exercícios, prompts, ferramentas e progresso salvo, sem cadastro obrigatório.",
  alternates: { canonical: academyUrl },
  keywords: ["curso gratuito de inteligência artificial", "IA na prática", "curso de IA para iniciantes", "IA para e-commerce", "IA para negócios", "aprender ChatGPT", "IA para gerar renda com serviços"],
  openGraph: {
    title: "IA na Prática — aprenda, execute e evolua | EyAgencia",
    description: "15 missões gratuitas para aprender a usar IA em trabalhos e negócios com responsabilidade. Do primeiro prompt à apresentação de um serviço.",
    url: academyUrl,
    siteName: "EyAgencia",
    locale: "pt_BR",
    type: "website"
  },
  robots: { index: true, follow: true }
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": academyUrl + "#page",
      name: "IA na Prática — academia gratuita de inteligência artificial",
      url: academyUrl,
      description: "Trilhas gratuitas e práticas de IA para iniciantes, negócios e criação de serviços digitais.",
      inLanguage: "pt-BR",
      isAccessibleForFree: true,
      publisher: { "@type": "Organization", name: "EyAgencia", url: "https://www.eyagencia.com.br/" }
    },
    {
      "@type": "ItemList",
      itemListElement: tracks.map((track, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Course",
          name: track.title,
          description: track.subtitle,
          provider: { "@type": "Organization", name: "EyAgencia", url: "https://www.eyagencia.com.br/" },
          isAccessibleForFree: true,
          inLanguage: "pt-BR",
          educationalLevel: track.id === "fundamentos" ? "Iniciante" : track.id === "negocios" ? "Intermediário" : "Intermediário e avançado",
          url: academyUrl + "#trilhas",
          timeRequired: "PT" + missions.filter(m => m.track === track.id).reduce((n, m) => n + m.minutes, 0) + "M"
        }
      }))
    }
  ]
};

export default function AcademyPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <AcademiaExperience />
  </>;
}
