import { NextResponse } from "next/server";
import { replyToGoogleBusinessReview } from "@/app/lib/google-business-profile";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { reviewName?: string; comment?: string; confirm?: boolean };
    const mode = process.env.REPUTATION_REPLY_MODE || "dry-run";

    if (!body.reviewName || !body.comment) {
      return NextResponse.json({ error: "reviewName e comment são obrigatórios." }, { status: 400 });
    }

    if (mode === "dry-run") {
      return NextResponse.json({
        published: false,
        dryRun: true,
        message: "Resposta validada, mas publicação real está bloqueada no modo piloto.",
        reviewName: body.reviewName,
        comment: body.comment,
      });
    }

    if (!body.confirm) {
      return NextResponse.json(
        { error: "Confirmação explícita obrigatória para publicação no piloto." },
        { status: 409 }
      );
    }

    const result = await replyToGoogleBusinessReview(body.reviewName, body.comment);
    return NextResponse.json({ published: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao publicar resposta." },
      { status: 500 }
    );
  }
}
