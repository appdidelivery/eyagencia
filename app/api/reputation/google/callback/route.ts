import { NextResponse } from "next/server";
import {
  GOOGLE_REPUTATION_REDIRECT_URI,
  googleClientId,
  googleClientSecret,
  saveGoogleSession,
  validateGoogleOAuthState,
} from "@/app/lib/reputation-google-session";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const oauthError = requestUrl.searchParams.get("error");

  if (oauthError) {
    return NextResponse.redirect(
      new URL(`/reputacao?google=error&reason=${encodeURIComponent(oauthError)}`, requestUrl.origin)
    );
  }

  if (!code || !(await validateGoogleOAuthState(state))) {
    return NextResponse.redirect(
      new URL("/reputacao?google=error&reason=invalid_state", requestUrl.origin)
    );
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: googleClientId(),
        client_secret: googleClientSecret(),
        code,
        grant_type: "authorization_code",
        redirect_uri: GOOGLE_REPUTATION_REDIRECT_URI,
      }),
      cache: "no-store",
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || "Google não retornou access token.");
    }

    await saveGoogleSession({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
    });

    return NextResponse.redirect(new URL("/reputacao?google=connected", requestUrl.origin));
  } catch (error) {
    const reason = encodeURIComponent(
      error instanceof Error ? error.message : "Falha ao concluir OAuth."
    );
    return NextResponse.redirect(
      new URL(`/reputacao?google=error&reason=${reason}`, requestUrl.origin)
    );
  }
}
