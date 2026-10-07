import crypto from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "ey_rep_google";
const STATE_COOKIE = "ey_rep_google_state";
export const GOOGLE_REPUTATION_REDIRECT_URI =
  "https://eyagencia.com.br/api/reputation/google/callback";

type GoogleSession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
};

function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} não configurado.`);
  return value;
}

function encryptionKey() {
  return crypto
    .createHash("sha256")
    .update(requireEnv("GOOGLE_GBP_CLIENT_SECRET") + ":reputation-session-v1")
    .digest();
}

function encrypt(payload: GoogleSession) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const body = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, body]).toString("base64url");
}

function decrypt(value: string): GoogleSession {
  const raw = Buffer.from(value, "base64url");
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const body = raw.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);
  const clear = Buffer.concat([decipher.update(body), decipher.final()]);
  return JSON.parse(clear.toString("utf8")) as GoogleSession;
}

const secureCookie = (maxAge: number) => ({
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge,
});

export function googleClientId() {
  return requireEnv("GOOGLE_GBP_CLIENT_ID");
}

export function googleClientSecret() {
  return requireEnv("GOOGLE_GBP_CLIENT_SECRET");
}

export async function createGoogleOAuthState() {
  const state = crypto.randomBytes(24).toString("base64url");
  const store = await cookies();
  store.set(STATE_COOKIE, state, secureCookie(600));
  return state;
}

export async function validateGoogleOAuthState(state?: string | null) {
  if (!state) return false;
  const store = await cookies();
  const expected = store.get(STATE_COOKIE)?.value;
  store.delete(STATE_COOKIE);
  if (!expected || expected.length !== state.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(state));
}

export async function saveGoogleSession(input: {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}) {
  const store = await cookies();
  let previous: GoogleSession | undefined;

  const existing = store.get(SESSION_COOKIE)?.value;
  if (existing) {
    try {
      previous = decrypt(existing);
    } catch {
      previous = undefined;
    }
  }

  const session: GoogleSession = {
    accessToken: input.accessToken,
    refreshToken: input.refreshToken || previous?.refreshToken,
    expiresAt: Date.now() + Math.max(60, input.expiresIn || 3600) * 1000,
  };

  store.set(SESSION_COOKIE, encrypt(session), secureCookie(180 * 24 * 60 * 60));
}

async function readGoogleSession() {
  const store = await cookies();
  const value = store.get(SESSION_COOKIE)?.value;
  if (!value) return null;
  try {
    return decrypt(value);
  } catch {
    store.delete(SESSION_COOKIE);
    return null;
  }
}

export async function getGoogleAccessToken() {
  const session = await readGoogleSession();
  if (!session) throw new Error("Google Business Profile ainda não conectado.");

  if (session.accessToken && session.expiresAt > Date.now() + 90000) {
    return session.accessToken;
  }

  if (!session.refreshToken) {
    throw new Error("Sessão Google sem refresh token. Reconecte a conta.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: googleClientId(),
      client_secret: googleClientSecret(),
      refresh_token: session.refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || "Falha ao renovar token Google.");
  }

  await saveGoogleSession({
    accessToken: data.access_token,
    refreshToken: session.refreshToken,
    expiresIn: data.expires_in,
  });

  return data.access_token as string;
}
