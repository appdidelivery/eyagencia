import { NextResponse } from "next/server";
import { evaluateReview, type ReviewInput } from "@/app/reputacao/engine";
import { pattyProfile } from "@/app/reputacao/patty-data";
import { getGoogleAccessToken } from "@/app/lib/reputation-google-session";

const starToNumber: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locationId = url.searchParams.get("locationId")?.replace(/^locations\//, "").trim();

  if (!locationId) {
    return NextResponse.json({ error: "locationId é obrigatório." }, { status: 400 });
  }

  try {
    const accessToken = await getGoogleAccessToken();
    const endpoint = new URL(
      `https://mybusiness.googleapis.com/v4/accounts/-/locations/${encodeURIComponent(locationId)}/reviews`
    );
    endpoint.searchParams.set("pageSize", "50");
    endpoint.searchParams.set("orderBy", "update_time desc");

    const response = await fetch(endpoint, {
      headers: { authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Falha ao listar avaliações.");
    }

    const items = (data.reviews || []).map((item: any) => {
      const review: ReviewInput = {
        id: item.reviewId,
        reviewerName: item.reviewer?.displayName || "Cliente",
        rating: starToNumber[item.starRating] || 0,
        comment: item.comment || "",
      };

      return {
        source: item,
        review,
        decision: evaluateReview(review, pattyProfile),
      };
    });

    return NextResponse.json({
      connected: true,
      mode: "pilot",
      autopublish: false,
      locationId,
      averageRating: data.averageRating,
      totalReviewCount: data.totalReviewCount,
      reviews: items,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao consultar avaliações." },
      { status: 502 }
    );
  }
}
