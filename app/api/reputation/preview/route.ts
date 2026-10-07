import { NextResponse } from "next/server";
import { evaluateReview, type ReviewInput } from "@/app/reputacao/engine";
import { pattyProfile } from "@/app/reputacao/patty-data";

export async function POST(request: Request) {
  try {
    const review = (await request.json()) as ReviewInput;

    if (!review?.id || !Number.isFinite(review?.rating) || review.rating < 1 || review.rating > 5) {
      return NextResponse.json({ error: "Review inválido" }, { status: 400 });
    }

    return NextResponse.json({
      business: pattyProfile,
      review,
      decision: evaluateReview(review, pattyProfile),
      mode: "pilot",
      autopublish: false,
    });
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
}
