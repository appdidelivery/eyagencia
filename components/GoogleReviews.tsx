'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Tipagem do que esperamos receber da sua API
interface ReviewData {
  id: string;
  author_name: string;
  text: string;
  rating: number;
}

export default function GoogleReviews() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoogleReviews() {
      try {
        // ==========================================
        // ATENÇÃO: COLOQUE A URL DA SUA API AQUI ABAIXO
        // Exemplo: const res = await fetch('https://api.velodelivery.../eyagencia/reviews');
        // ==========================================
        
        // Simulação de tempo de resposta da API (Remova isso quando conectar a API real)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados de fallback caso a API demore ou enquanto você não configura
        const fallbackData = [
          { id: "1", author_name: "Ricardo S.", rating: 5, text: "A migração da nossa loja nos dava muito medo por causa da perda de tráfego. A EyAgencia fez um mapeamento perfeito. Aumentamos o ROAS em 45% nos primeiros 3 meses." },
          { id: "2", author_name: "Mariana L.", rating: 5, text: "O trabalho de SEO Técnico deles é absurdo. Injetaram dados estruturados e nossas páginas de categoria B2B agora dominam o topo do Google." },
          { id: "3", author_name: "Felipe T.", rating: 5, text: "Transparência total. Fomos de um CAC altíssimo para uma máquina previsível. A equipe realmente usa engenharia de dados e não achismos." }
        ];

        // Quando plugar a API, use: const data = await res.json(); setReviews(data);
        setReviews(fallbackData);
      } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGoogleReviews();
  }, []);

  const StarIcon = () => (
    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <section className="w-full bg-white py-24 px-6 lg:px-8 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 flex flex-col items-center">
          {/* Badge oficial Google */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full px-4 py-2 mb-6">
            <svg className="w-6 h-6" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571c.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
            <span className="font-bold text-slate-800 text-sm">Avaliações Verificadas</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Validação por <span className="text-[#275c58]">Quem Importa</span>
          </h2>
          <div className="w-16 h-1 bg-[#f0815b] mx-auto mt-6 rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#275c58]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating || 5)].map((_, i) => <StarIcon key={i} />)}
                </div>
                <p className="text-slate-700 italic mb-6 leading-relaxed flex-grow">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-[#275c58]/10 flex items-center justify-center font-bold text-[#275c58]">
                    {review.author_name.charAt(0)}
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{review.author_name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}