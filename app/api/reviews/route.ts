import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({ error: 'Faltam chaves de API' }, { status: 500 });
  }

  try {
    // Nova URL oficial do Google Places API
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=reviews,rating,userRatingCount&key=${apiKey}&languageCode=pt-BR`;
    
    const response = await fetch(url);
    const data = await response.json();

    // Se o Google devolver erro, logamos no terminal
    if (data.error) {
      console.log("ERRO DO GOOGLE CLOUD:", data.error.message);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    if (data.reviews) {
      // Filtra e formata para o formato que a nossa tela espera
      const validReviews = data.reviews
        .filter((r: any) => r.text?.text && r.rating >= 4)
        .slice(0, 3)
        .map((r: any) => ({
          author_name: r.authorAttribution?.displayName || "Cliente",
          rating: r.rating,
          text: r.text.text,
          profile_photo_url: r.authorAttribution?.photoUri
        }));

      return NextResponse.json({
        rating: data.rating,
        total: data.userRatingCount,
        reviews: validReviews
      });
    }

    return NextResponse.json({ error: 'Nenhuma avaliação encontrada' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Falha na comunicação' }, { status: 500 });
  }
}