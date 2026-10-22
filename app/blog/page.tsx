import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {client} from "../../sanity/lib/client";
import {groq} from "next-sanity";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Blog de E-commerce, SEO e Tráfego Pago | EyAgencia",
  description: "Aprenda estratégias avançadas de Inbound Marketing, automação B2B e engenharia de marketing para lojas virtuais.",
};

function formatDate(value?: string) {
  if (!value) return 'Artigo recente';
  return new Intl.DateTimeFormat('pt-BR', {day: '2-digit', month: 'long', year: 'numeric'}).format(new Date(value));
}

export default async function BlogPage() {
  const posts = await client.fetch(groq`
    *[_type == "post" && defined(publishedAt) && defined(slug.current)]
      | order(publishedAt desc){
        _id,
        title,
        "desc": coalesce(seoDescription, excerpt),
        "date": publishedAt,
        "category": categories[0]->title,
        "readTime": "5 min de leitura",
        "slug": slug.current,
        "imageUrl": mainImage.asset->url,
        "imageAlt": mainImage.alt
      }
  `);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog EyAgencia",
    "url": "https://eyagencia.com.br/blog",
    "description": "Conteúdo especializado em engenharia de marketing e e-commerce.",
    "publisher": {
      "@type": "Organization",
      "name": "EyAgencia",
      "logo": {"@type": "ImageObject", "url": "https://eyagencia.com.br/eyagencia-logo-verde.png"}
    }
  };

  const categories = ["SEO Técnico", "Tráfego Pago", "E-commerce B2B", "Inbound Marketing", "Web Analytics"];
  const popularTags = ["Vtex", "ROAS", "Core Web Vitals", "LTV", "Automação", "JSON-LD"];

  return (
    <main className="flex min-h-screen flex-col w-full bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(blogSchema)}} />
      <Header />

      <section className="pt-40 pb-20 px-6 lg:px-8 text-center bg-white border-b border-slate-200">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Radar de <span className="text-[#275c58]">Conteúdo</span>
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
          Estratégias avançadas, atualizações de algoritmos e engenharia de vendas para profissionais de e-commerce.
        </p>
      </section>

      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post: any) => (
              <Link key={post._id} href={`/blog/${post.slug}`} className="block h-full">
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col group h-full">
                  <div className="w-full h-52 overflow-hidden relative bg-gradient-to-br from-[#163d3a] via-[#275c58] to-slate-900">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.imageAlt || post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        quality={82}
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-white font-extrabold">
                        EyAgencia · Conteúdo
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="text-xs font-black uppercase tracking-wider text-white bg-[#275c58]/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        {post.category || "Conteúdo"}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <span className="text-xs font-medium text-slate-400 mb-3">{formatDate(post.date)}</span>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#275c58] transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 text-base leading-relaxed mb-6 flex-grow">{post.desc}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <span className="text-xs font-medium text-slate-500">{post.readTime}</span>
                      <span className="text-sm font-bold text-[#275c58]">Ler →</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        <aside className="lg:w-1/3 space-y-10">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Buscar Artigo</h3>
            <div className="relative">
              <input type="text" placeholder="Ex: SEO Técnico..." className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#275c58] transition-all" />
              <span className="absolute right-3 top-3 text-slate-400">⌕</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Categorias</h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat}><span className="text-slate-600 font-medium text-sm">{cat}</span></li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Tags Populares</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <span key={tag} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md text-xs font-semibold">#{tag}</span>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <Footer />
    </main>
  );
}
