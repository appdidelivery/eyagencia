import { NextResponse } from "next/server";
import {
  GOOGLE_REPUTATION_REDIRECT_URI,
  createGoogleOAuthState,
  googleClientId,
} from "@/app/lib/reputation-google-session";

export async function GET() {
  try {
    const state = await createGoogleOAuthState();
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", googleClientId());
    url.searchParams.set("redirect_uri", GOOGLE_REPUTATION_REDIRECT_URI);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "https://www.googleapis.com/auth/business.manage");
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent");
    url.searchParams.set("include_granted_scopes", "true");
    url.searchParams.set("state", state);
    return NextResponse.redirect(url);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao iniciar OAuth." },
      { status: 500 }
    );
  }
}
