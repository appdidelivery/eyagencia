type GoogleReview = {
  name: string;
  reviewId: string;
  reviewer?: { displayName?: string; profilePhotoUrl?: string; isAnonymous?: boolean };
  starRating: string;
  comment?: string;
  createTime?: string;
  updateTime?: string;
  reviewReply?: { comment?: string; updateTime?: string };
};

function env(name: string) {
  return process.env[name]?.trim();
}

export function isGoogleBusinessConfigured() {
  return Boolean(
    env("GOOGLE_GBP_CLIENT_ID") &&
    env("GOOGLE_GBP_CLIENT_SECRET") &&
    env("GOOGLE_GBP_REFRESH_TOKEN") &&
    env("GOOGLE_GBP_ACCOUNT_ID") &&
    env("GOOGLE_GBP_LOCATION_ID")
  );
}

async function getAccessToken() {
  const clientId = env("GOOGLE_GBP_CLIENT_ID");
  const clientSecret = env("GOOGLE_GBP_CLIENT_SECRET");
  const refreshToken = env("GOOGLE_GBP_REFRESH_TOKEN");

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("OAuth do Google Business Profile não configurado.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Falha ao renovar token GBP: ${response.status}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Google não retornou access_token.");
  return data.access_token;
}

function locationParent() {
  const accountId = env("GOOGLE_GBP_ACCOUNT_ID");
  const locationId = env("GOOGLE_GBP_LOCATION_ID");
  if (!accountId || !locationId) throw new Error("Conta/local GBP não configurados.");
  return `accounts/${accountId}/locations/${locationId}`;
}

export async function listGoogleBusinessReviews() {
  const accessToken = await getAccessToken();
  const parent = locationParent();
  const url = new URL(`https://mybusiness.googleapis.com/v4/${parent}/reviews`);
  url.searchParams.set("pageSize", "50");
  url.searchParams.set("orderBy", "update_time desc");

  const response = await fetch(url, {
    headers: { authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Falha ao listar reviews GBP (${response.status}): ${detail.slice(0, 300)}`);
  }

  return (await response.json()) as {
    reviews?: GoogleReview[];
    averageRating?: number;
    totalReviewCount?: number;
    nextPageToken?: string;
  };
}

export async function replyToGoogleBusinessReview(reviewName: string, comment: string) {
  const parent = locationParent();

  if (!reviewName.startsWith(`${parent}/reviews/`)) {
    throw new Error("Review não pertence à unidade configurada.");
  }

  const accessToken = await getAccessToken();
  const response = await fetch(`https://mybusiness.googleapis.com/v4/${reviewName}/reply`, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ comment }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Falha ao responder review GBP (${response.status}): ${detail.slice(0, 300)}`);
  }

  return response.json();
}
