import Link from 'next/link';
import {client} from '../sanity/lib/client';
import {groq} from 'next-sanity';
import {blogCoverUrl} from '../sanity/lib/blogCover';

export const dynamic = 'force-dynamic';

function formatDate(value?: string) {
  if (!value) return 'Artigo recente';
  return new Intl.DateTimeFormat('pt-BR', {day: '2-digit', month: 'long', year: 'numeric'}).format(new Date(value));
}

export default async function BlogPreview() {
  const posts = await client.fetch(groq`
    *[_type == "post" && defined(publishedAt) && defined(slug.current)]
      | order(publishedAt desc)[0...3]{
        _id,
        title,
        "desc": coalesce(seoDescription, excerpt),
        "date": publishedAt,
        "category": categories[0]->title,
        "slug": slug.current,
        "imageUrl": mainImage.asset->url,
        "imageSource": mainImage.generationSource,
        "imageAlt": mainImage.alt
      }
  `);

  if (!posts?.length) return null;

  return (
    <section className="w-full bg-slate-50 py-24 px-6 lg:px-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b54d24] mb-3">Últimas postagens</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Radar de <span className="text-[#275c58]">Conteúdo</span>
            </h2>
            <div className="w-16 h-1 bg-[#275c58] mt-6 rounded-full"></div>
          </div>
          <Link href="/blog" className="text-[#b54d24] font-bold hover:text-[#933d1b] transition-colors flex items-center gap-2">
            Acessar o Blog Completo <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {posts.map((post: any, index: number) => {
            const featured = index === 0;
            return (
              <article
                key={post._id}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 group ${featured ? 'lg:row-span-2' : ''}`}
              >
                <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                  <div className={`w-full overflow-hidden relative bg-gradient-to-br from-[#163d3a] via-[#275c58] to-slate-900 border-b border-slate-100 ${featured ? 'h-72 lg:h-[420px]' : 'h-52'}`}>
                    {blogCoverUrl(post) ? (
                      <img
                        src={blogCoverUrl(post)}
                        alt={post.imageAlt || post.title}
                        loading={featured ? 'eager' : 'lazy'}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                        <span className="text-white/90 text-2xl font-black">EyAgencia · Radar de Conteúdo</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {featured && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#163d3a] bg-white px-3 py-1.5 rounded-full shadow-sm">
                          Destaque
                        </span>
                      )}
                      <span className="text-[10px] font-black uppercase tracking-wider text-white bg-[#275c58]/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                        {post.category || 'Conteúdo'}
                      </span>
                    </div>
                  </div>

                  <div className={`p-8 flex flex-col flex-grow ${featured ? 'lg:p-10' : ''}`}>
                    <span className="text-xs font-medium text-slate-400 mb-3 block">{formatDate(post.date)}</span>
                    <h3 className={`font-bold text-slate-900 mb-3 group-hover:text-[#275c58] transition-colors leading-snug ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6 flex-grow">
                      {post.desc}
                    </p>
                    <div className="text-sm font-bold text-[#b54d24] flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                      Ler artigo completo <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
