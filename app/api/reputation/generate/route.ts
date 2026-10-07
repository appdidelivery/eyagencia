import { NextResponse } from "next/server";
import { evaluateReview, type ReviewInput } from "@/app/reputacao/engine";
import { pattyProfile } from "@/app/reputacao/patty-data";
import { generateAiReviewResponse } from "@/app/lib/reputation-ai";

export async function POST(request: Request) {
  try {
    const review = (await request.json()) as ReviewInput;

    if (!review?.id || !Number.isFinite(review?.rating) || review.rating < 1 || review.rating > 5) {
      return NextResponse.json({ error: "Review inválido" }, { status: 400 });
    }

    const decision = evaluateReview(review, pattyProfile);
    const ai = await generateAiReviewResponse(review, pattyProfile, decision);

    return NextResponse.json({
      business: {
        id: pattyProfile.id,
        name: pattyProfile.name,
        category: pattyProfile.category,
        city: pattyProfile.city,
      },
      review,
      decision,
      finalResponse: ai.response,
      ai: {
        used: ai.aiUsed,
        model: ai.model,
        usage: ai.usage,
        fallbackReason: ai.fallbackReason,
      },
      publishing: {
        allowedByPolicy: decision.action === "auto_publicar",
        liveEnabled: false,
      },
    });
  } catch {
    return NextResponse.json({ error: "JSON inválido ou falha na geração." }, { status: 400 });
  }
}
