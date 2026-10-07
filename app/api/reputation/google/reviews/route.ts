import { NextResponse } from "next/server";
import { evaluateReview, type ReviewInput } from "@/app/reputacao/engine";
import { pattyProfile } from "@/app/reputacao/patty-data";
import { isGoogleBusinessConfigured, listGoogleBusinessReviews } from "@/app/lib/google-business-profile";

const starToNumber: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

export async function GET() {
  if (!isGoogleBusinessConfigured()) {
    return NextResponse.json({
      configured: false,
      mode: "pilot",
      message: "OAuth do Google Business Profile ainda não configurado.",
    });
  }

  try {
    const data = await listGoogleBusinessReviews();
    const reviews = (data.reviews || []).map((item) => {
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
      configured: true,
      mode: "pilot",
      autopublish: false,
      averageRating: data.averageRating,
      totalReviewCount: data.totalReviewCount,
      reviews,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao consultar avaliações." },
      { status: 502 }
    );
  }
}
