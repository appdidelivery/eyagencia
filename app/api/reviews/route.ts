import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({ error: 'Faltam chaves de API' }, { status: 500 });
  }

  try {
    // Retornamos para a API Clássica que aceita a sua chave da Velo sem frescuras
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&language=pt-BR&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      console.log("ERRO DO GOOGLE CLOUD:", data.status, data.error_message);
      return NextResponse.json({ error: data.status }, { status: 500 });
    }

    if (data.result && data.result.reviews) {
      // Ajuste para o formato clássico
      const validReviews = data.result.reviews
        .filter((r: any) => r.text && r.rating >= 4)
        .slice(0, 3)
        .map((r: any) => ({
          author_name: r.author_name || "Cliente",
          rating: r.rating,
          text: r.text,
          profile_photo_url: r.profile_photo_url
        }));

      return NextResponse.json({
        rating: data.result.rating,
        total: data.result.user_ratings_total,
        reviews: validReviews
      });
    }

    return NextResponse.json({ error: 'Nenhuma avaliação encontrada' }, { status: 404 });
  } catch (error) {
    console.log("FALHA NA REDE:", error);
    return NextResponse.json({ error: 'Falha na comunicação com o Google' }, { status: 500 });
  }
}