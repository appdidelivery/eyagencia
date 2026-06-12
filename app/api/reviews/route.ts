import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  // Isso vai aparecer no seu terminal do VS Code pra gente saber se ele leu o arquivo .env
  console.log("CHAVE LIDA PELO SISTEMA:", apiKey ? "OK, chave existe!" : "ERRO, chave em branco!");

  if (!apiKey || !placeId) {
    return NextResponse.json({ error: 'Faltam chaves de API no arquivo .env.local' }, { status: 500 });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&language=pt-BR&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    // Se o Google recusar a chave, a gente avisa na tela
    if (data.status !== "OK") {
      console.log("ERRO DO GOOGLE:", data.status, data.error_message);
      return NextResponse.json({ error: `O Google recusou o pedido: ${data.status}` }, { status: 500 });
    }

    if (data.result && data.result.reviews) {
      const validReviews = data.result.reviews
        .filter((r: any) => r.text && r.rating >= 4)
        .slice(0, 3);

      return Nex