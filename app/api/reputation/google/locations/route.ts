import { NextResponse } from "next/server";
import { getGoogleAccessToken } from "@/app/lib/reputation-google-session";

type GoogleLocation = {
  name?: string;
  title?: string;
  storeCode?: string;
  websiteUri?: string;
  categories?: {
    primaryCategory?: { displayName?: string };
  };
  storefrontAddress?: {
    addressLines?: string[];
    locality?: string;
    administrativeArea?: string;
    postalCode?: string;
  };
  metadata?: {
    mapsUri?: string;
    newReviewUri?: string;
  };
};

export async function GET() {
  try {
    const accessToken = await getGoogleAccessToken();
    const locations: GoogleLocation[] = [];
    let pageToken = "";

    for (let page = 0; page < 10; page += 1) {
      const url = new URL(
        "https://mybusinessbusinessinformation.googleapis.com/v1/accounts/-/locations"
      );
      url.searchParams.set(
        "readMask",
        "name,title,storeCode,websiteUri,categories,storefrontAddress,metadata"
      );
      url.searchParams.set("pageSize", "100");
      url.searchParams.set("orderBy", "title");
      if (pageToken) url.searchParams.set("pageToken", pageToken);

      const response = await fetch(url, {
        headers: { authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error?.message || "Falha ao listar Perfis da Empresa.");
      }

      locations.push(...(data.locations || []));
      pageToken = data.nextPageToken || "";
      if (!pageToken) break;
    }

    return NextResponse.json({
      connected: true,
      count: locations.length,
      locations: locations.map((location) => ({
        ...location,
        locationId: location.name?.replace(/^locations\//, "") || "",
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao consultar Google.";
    const status = message.includes("não conectado") ? 401 : 502;
    return NextResponse.json({ connected: false, error: message }, { status });
  }
}
