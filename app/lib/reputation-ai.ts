import type { BusinessProfile, ReviewDecision, ReviewInput } from "@/app/reputacao/engine";

type GatewayResponse = {
  model?: string;
  choices?: Array<{ message?: { content?: string } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
};

export type AiReviewResult = {
  response: string;
  aiUsed: boolean;
  model?: string;
  usage?: GatewayResponse["usage"];
  fallbackReason?: string;
};

function cleanModelText(value: string) {
  return value
    .trim()
    .replace(/^["“”']+|["“”']+$/g, "")
    .replace(/^Resposta:\s*/i, "")
    .trim();
}

export async function generateAiReviewResponse(
  review: ReviewInput,
  business: BusinessProfile,
  decision: ReviewDecision
): Promise<AiReviewResult> {
  // Reviews de crise ficam deliberadamente fora do LLM no piloto.
  if (decision.action === "crise") {
    return {
      response: decision.response,
      aiUsed: false,
      fallbackReason: "crise_bloqueada_para_revisao_humana",
    };
  }

  const apiKey = process.env.AI_GATEWAY_API_KEY?.trim();
  if (!apiKey) {
    return {
      response: decision.response,
      aiUsed: false,
      fallbackReason: "ai_gateway_nao_configurado",
    };
  }

  const model = process.env.REPUTATION_AI_MODEL?.trim() || "alibaba/qwen3.5-flash";

  const system = [
    "Você escreve respostas a avaliações do Google Business Profile para negócios locais brasileiros.",
    "Objetivo: resposta humana, curta, específica e útil, com SEO local/GEO/E-E-A-T natural, nunca keyword stuffing.",
    "Regras obrigatórias:",
    "- escreva em português do Brasil;",
    "- não invente fatos, serviços, profissionais, resultados, promoções ou localização;",
    "- só cite profissional se o nome apareceu no review;",
    "- só cite serviço se ele apareceu no review;",
    "- a cidade fornecida no contexto é verdadeira, mas use localização com parcimônia;",
    "- nunca prometa compensação, reembolso ou solução não autorizada;",
    "- não admita culpa;",
    "- não use 'melhor salão' ou outro superlativo como afirmação da empresa, mesmo que o cliente tenha usado;",
    "- varie vocabulário e estrutura; evite respostas genéricas repetidas;",
    "- use no máximo 2 emojis;",
    "- produza apenas a resposta final, sem título, aspas, markdown ou explicações.",
    "Tamanho ideal: 2 a 4 frases, aproximadamente 250 a 600 caracteres.",
  ].join("\n");

  const payload = {
    business: {
      name: business.name,
      category: business.category,
      city: business.city,
    },
    review: {
      reviewerName: review.reviewerName || "Cliente",
      rating: review.rating,
      comment: review.comment || "",
    },
    safetyDecision: {
      risk: decision.risk,
      action: decision.action,
      detectedServices: decision.detectedServices,
      detectedProfessionals: decision.detectedProfessionals,
    },
    deterministicDraft: decision.response,
  };

  try {
    const response = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.45,
        max_tokens: 220,
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content:
              "Gere uma resposta obedecendo integralmente às regras. Contexto JSON:\n" +
              JSON.stringify(payload),
          },
        ],
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        response: decision.response,
        aiUsed: false,
        model,
        fallbackReason: `gateway_http_${response.status}`,
      };
    }

    const data = (await response.json()) as GatewayResponse;
    const generated = cleanModelText(data.choices?.[0]?.message?.content || "");

    if (!generated || generated.length < 40) {
      return {
        response: decision.response,
        aiUsed: false,
        model: data.model || model,
        usage: data.usage,
        fallbackReason: "resposta_ai_invalida",
      };
    }

    return {
      response: generated,
      aiUsed: true,
      model: data.model || model,
      usage: data.usage,
    };
  } catch {
    return {
      response: decision.response,
      aiUsed: false,
      model,
      fallbackReason: "falha_gateway",
    };
  }
}
