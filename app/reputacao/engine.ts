export type ReviewRisk = "elogio" | "positivo_com_ressalva" | "neutro" | "insatisfacao" | "crise";
export type ReviewAction = "auto_publicar" | "revisao_humana" | "crise";

export type BusinessProfile = {
  id: string;
  name: string;
  category: string;
  city?: string;
  neighborhood?: string;
  services: string[];
  professionals: string[];
  responseSignature?: string;
};

export type ReviewInput = {
  id: string;
  reviewerName?: string;
  rating: number;
  comment?: string;
};

export type ReviewDecision = {
  risk: ReviewRisk;
  action: ReviewAction;
  reasons: string[];
  detectedServices: string[];
  detectedProfessionals: string[];
  response: string;
};

const CRISIS_TERMS = [
  "advogado",
  "processo",
  "procon",
  "policia",
  "denuncia",
  "discriminacao",
  "racismo",
  "assedio",
  "queimou",
  "queimadura",
  "feriu",
  "machucou",
  "alergia",
  "reembolso",
  "estorno",
  "cobranca indevida",
  "fraude",
  "golpe",
  "hospital",
];

const COMPLAINT_TERMS = [
  "ruim",
  "pessimo",
  "péssimo",
  "demora",
  "atraso",
  "nao gostei",
  "não gostei",
  "decepcion",
  "problema",
  "insatisfeit",
  "mal atend",
  "nao recomendo",
  "não recomendo",
  "resultado diferente",
  "estrag",
];

const PRAISE_TERMS = [
  "amei",
  "adorei",
  "maravilh",
  "excelente",
  "perfeito",
  "recomendo",
  "otimo",
  "ótimo",
  "top",
  "impecavel",
  "impecável",
];

function normalize(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function includesAny(text: string, terms: string[]) {
  const normalized = normalize(text);
  return terms.some((term) => normalized.includes(normalize(term)));
}

function findMentions(text: string, items: string[]) {
  const normalized = normalize(text);
  return items.filter((item) => normalized.includes(normalize(item)));
}

function firstName(fullName?: string) {
  return fullName?.trim().split(/\s+/)[0] || "Cliente";
}

function stableVariant(seed: string, options: string[]) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return options[hash % options.length];
}

export function classifyReview(review: ReviewInput, business: BusinessProfile) {
  const comment = review.comment || "";
  const reasons: string[] = [];
  const detectedServices = findMentions(comment, business.services);
  const detectedProfessionals = findMentions(comment, business.professionals);
  const crisisTerm = includesAny(comment, CRISIS_TERMS);
  const complaintTerm = includesAny(comment, COMPLAINT_TERMS);
  const praiseTerm = includesAny(comment, PRAISE_TERMS);

  if (crisisTerm) reasons.push("termo sensível/crise detectado");
  if (complaintTerm) reasons.push("sinal de insatisfação no texto");
  if (praiseTerm) reasons.push("elogio explícito no texto");
  if (detectedServices.length) reasons.push("serviço citado pelo cliente");
  if (detectedProfessionals.length) reasons.push("profissional citada pelo cliente");

  let risk: ReviewRisk;
  let action: ReviewAction;

  if (crisisTerm || review.rating <= 2) {
    risk = "crise";
    action = "crise";
    reasons.push(review.rating <= 2 ? "nota de 1 ou 2 estrelas" : "requer contenção de risco");
  } else if (review.rating === 3) {
    risk = complaintTerm ? "insatisfacao" : "neutro";
    action = "revisao_humana";
    reasons.push("3 estrelas exige validação humana");
  } else if (complaintTerm) {
    risk = "positivo_com_ressalva";
    action = "revisao_humana";
    reasons.push("nota positiva com ressalva textual");
  } else {
    risk = "elogio";
    action = "auto_publicar";
    reasons.push("review positivo e sem sinal de risco");
  }

  return { risk, action, reasons, detectedServices, detectedProfessionals };
}

export function generateReviewResponse(review: ReviewInput, business: BusinessProfile) {
  const classification = classifyReview(review, business);
  const name = firstName(review.reviewerName);
  const comment = (review.comment || "").trim();
  const service = classification.detectedServices[0];
  const professional = classification.detectedProfessionals[0];
  const geo = business.city ? ` em ${business.city}` : "";
  const useGeo = Boolean(business.city) && ((review.id.length + comment.length) % 3 === 0);
  const localContext = useGeo ? geo : "";

  if (classification.action === "crise") {
    return `${name}, agradecemos por compartilhar sua experiência. Sentimos que o atendimento não tenha correspondido às suas expectativas. No ${business.name}, levamos esse tipo de relato a sério e queremos entender o caso com cuidado, sem tirar conclusões antes de verificar todos os detalhes. Pedimos que entre em contato diretamente conosco para que possamos analisar o atendimento e buscar a melhor orientação para a situação.`;
  }

  if (classification.action === "revisao_humana") {
    return `${name}, muito obrigada pela sua avaliação. Seu retorno é importante para o ${business.name} e nos ajuda a aperfeiçoar continuamente nosso atendimento e nossos serviços. Queremos entender melhor os pontos que você percebeu para cuidar da sua experiência com toda a atenção. Esperamos ter a oportunidade de receber você novamente.`;
  }

  if (!comment) {
    const middle = stableVariant(review.id, [
      `Sua avaliação é muito importante para toda a equipe do ${business.name}.`,
      `Ficamos muito felizes com a sua confiança no ${business.name}.`,
      `É muito bom saber que sua experiência no ${business.name} foi positiva.`,
    ]);
    return `${name}, muito obrigada pelas ${review.rating} estrelas! ✨ ${middle} Trabalhamos para oferecer atendimento profissional, cuidado e uma ótima experiência em cada visita${localContext}. Esperamos receber você novamente em breve! 💖`;
  }

  const professionalSentence = professional
    ? `A ${professional} vai ficar muito feliz com o seu reconhecimento. `
    : "";

  const serviceSentence = service
    ? `Ficamos muito felizes em saber que você gostou do atendimento de ${service}. `
    : "Ficamos muito felizes em saber que você teve uma ótima experiência. ";

  const closing = stableVariant(review.id + comment, [
    "Seguimos trabalhando com técnica, atenção e cuidado em cada atendimento.",
    "Nosso objetivo é unir profissionalismo, atenção e uma experiência acolhedora em cada visita.",
    "Cuidamos de cada detalhe para entregar qualidade e uma experiência especial a cada cliente.",
  ]);

  return `${name}, muito obrigada pelo carinho e pela avaliação! 💖 ${serviceSentence}${professionalSentence}No ${business.name}${localContext}, ${closing.charAt(0).toLowerCase() + closing.slice(1)} Esperamos receber você novamente em breve! ✨`;
}

export function evaluateReview(review: ReviewInput, business: BusinessProfile): ReviewDecision {
  const classification = classifyReview(review, business);
  return {
    ...classification,
    response: generateReviewResponse(review, business),
  };
}
