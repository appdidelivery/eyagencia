import { NextResponse } from "next/server";
import { getGoogleAccessToken } from "@/app/lib/reputation-google-session";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      locationId?: string;
      reviewId?: string;
      comment?: string;
      confirm?: boolean;
    };

    const mode = process.env.REPUTATION_REPLY_MODE || "dry-run";
    const locationId = body.locationId?.replace(/^locations\//, "").trim();

    if (!locationId || !body.reviewId || !body.comment) {
      return NextResponse.json(
        { error: "locationId, reviewId e comment são obrigatórios." },
        { status: 400 }
      );
    }

    if (mode === "dry-run") {
      return NextResponse.json({
        published: false,
        dryRun: true,
        message: "Resposta validada, mas publicação real segue bloqueada no piloto.",
        locationId,
        reviewId: body.reviewId,
        comment: body.comment,
      });
    }

    if (!body.confirm) {
      return NextResponse.json(
        { error: "Confirmação explícita obrigatória para publicação no piloto." },
        { status: 409 }
      );
    }

    const accessToken = await getGoogleAccessToken();
    const endpoint =
      `https://mybusiness.googleapis.com/v4/accounts/-/locations/${encodeURIComponent(locationId)}/reviews/${encodeURIComponent(body.reviewId)}/reply`;

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ comment: body.comment }),
      cache: "no-store",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Falha ao publicar resposta.");
    }

    return NextResponse.json({ published: true, result: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao publicar resposta." },
      { status: 500 }
    );
  }
}
