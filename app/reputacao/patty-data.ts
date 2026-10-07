import type { BusinessProfile, ReviewInput } from "./engine";

export const pattyProfile: BusinessProfile = {
  id: "patty-centro-beleza",
  name: "Patty Centro de Beleza",
  category: "salão de beleza",
  city: "Forquilhinha",
  services: [
    "corte",
    "escova",
    "escova modelada",
    "progressiva",
    "alisamento",
    "luzes",
    "cachos",
    "transformação",
    "transformações",
    "sobrancelha",
    "sobrancelhas",
    "manicure",
    "unhas",
    "nails",
    "reflexologia",
    "maquiagem",
    "cílios",
    "lash",
    "estética",
  ],
  professionals: [
    "Patty",
    "Patrícia",
    "Allegra",
    "Gaby",
    "Geraldine",
    "Maíra",
    "Vaneza",
    "Michele",
    "Deime",
    "Héllen",
    "Ana Clara",
    "Ingrid",
  ],
};

export const pattyPilotReviews: ReviewInput[] = [
  {
    id: "fabia-maciel",
    reviewerName: "Fabia Maciel",
    rating: 5,
    comment: "Alegra maravilhosa! Amei o corte, o atendimento, o local, tudo❤️",
  },
  {
    id: "alan-pereira",
    reviewerName: "alan pereira",
    rating: 5,
    comment: "A melhor de Forquilhinhas 🔥",
  },
  {
    id: "jamily-melo",
    reviewerName: "Jamily Melo",
    rating: 5,
    comment:
      "excelentes profissionais! Gaby sempre faz minhas unhas ela me entrega profissionalismo, educação e atenção. Hoje pela primeira vez fiz minha sobrancelha com a paty, que ótima profissional, agilidade e eficiência são as palavras para ela!",
  },
  {
    id: "cristiane-santos",
    reviewerName: "Cristiane Santos",
    rating: 5,
    comment:
      "Ótimo atendimento, super atenciosas super recomendo! Nunca fui em um salão que uma escova no cabelo fosse feita tão rápido e com total dedicação!",
  },
  {
    id: "gracilda-pfleger",
    reviewerName: "Gracilda Pfleger",
    rating: 5,
    comment:
      "Atendimento excelente, ambiente aconchegante. Profissionais atenciosos e muito educados. Levei a minha filha para fazer uma transformação nos cabelos e o resultado ficou maravilhoso. O atendimento das manicure também é maravilhoso, sempre atendendo com total profissionalismo. Recomendo sem medo.",
  },
  {
    id: "edinalva-martins",
    reviewerName: "Edinalva Martins Domingues",
    rating: 1,
    comment:
      "Minha experiência foi fazer uma progressiva e o resultado não correspondeu ao que eu esperava.",
  },
];
