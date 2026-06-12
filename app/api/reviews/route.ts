import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({ error: 'Faltam chaves de API no .env' }, { status: 500 });
  }

  try {
    // Chama o Google Places API (Endpoint de Detalhes do Local)
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&language=pt-BR&key=${apiKey}`
    );
    
    const data = await response.json();

    if (data.result && data.result.reviews) {
      // Pega as avaliações, filtra apenas as que tem texto e são 4 ou 5 estrelas, e pega as 3 primeiras
      const validReviews = data.result.reviews
        .filter((r: any) => r.text && r.rating >= 4)
        .slice(0, 3);

      return NextResponse.json({
        rating: data.result.rating, // A nota geral real (ex: 4.9)
        total: data.result.user_ratings_total, // O total de reviews real (ex: 24)
        reviews: validReviews
      });
    }

    return NextResponse.json({ error: 'Nenhuma avaliação encontrada' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar dados do Google' }, { status: 500 });
  }
}