import { client } from "../../../sanity/lib/client";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

// Definindo que o params agora é uma Promise (Regra do Next.js 15+)
type Props = {
  params: Promise<{ slug: string }>;
};

// 1. Metadados dinâmicos para SEO
export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  
  const post = await client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]{ title, "desc": seoDescription }`,
    { slug: resolvedParams.slug }
  );
  
  if (!post) return { title: "Página não encontrada | EyAgencia" };
  
  return {
    title: `${post.title} | EyAgencia`,
    description: post.desc,
  };
}

// 2. Renderização da Página do Artigo
export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;

  // Busca o post específico e AGORA Pede a URL da imagem principal
  const post = await client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]{
      title,
      "date": publishedAt,
      body,
      "authorName": author->name,
      "imageUrl": mainImage.asset->url,
      "imageAlt": mainImage.alt
    }`,
    { slug: resolvedParams.slug }
  );

  // Se o post não existir no banco, dispara o 404
  if (!post) {
    notFound();
  }

  // Dados da Sidebar (Iguais aos da página principal do blog)
  const categories = ["SEO Técnico", "Tráfego Pago", "E-commerce B2B", "Inbound Marketing", "Web Analytics"];
  const popularTags = ["Vtex", "ROAS", "Core Web Vitals", "LTV", "Automação", "JSON-LD"];

  return (
    <main className="flex min-h-screen flex-col w-full bg-slate-50">
      <Header />
      
      {/* Header minimalista do artigo */}
      <section className="pt-40 pb-12 px-6 lg:px-8 text-center bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-slate-500 font-medium">
            <span>Por {post.authorName || "Equipe EyAgencia"}</span>
            <span>•</span>
            <span>{post.date ? new Date(post.date).toLocaleDateString('pt-BR') : "Artigo Recente"}</span>
          </div>
        </div>
      </section>

      {/* Container Principal (Grid com Sidebar) */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow flex flex-col lg:flex-row gap-12">
        
        {/* Coluna Esquerda: O Artigo em si */}
        <div className="lg:w-2/3 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
          
          {/* Renderização da Imagem Principal (se existir no Sanity) */}
          {post.imageUrl && (
            <div className="mb-10 w-full overflow-hidden rounded-xl border border-slate-100">
              <img 
                src={post.imageUrl} 
                alt={post.imageAlt || post.title} 
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          )}

          {/* Corpo do Texto formatado */}
          <article className="text-slate-700 text-lg leading-relaxed">
            <PortableText 
              value={post.body} 
              components={{
                block: {
                  h2: ({children}) => <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6 leading-snug">{children}</h2>,
                  h3: ({children}) => <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 leading-snug">{children}</h3>,
                  normal: ({children}) => <p className="mb-6">{children}</p>,
                },
                list: {
                  bullet: ({children}) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
                  number: ({children}) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
                },
                marks: {
                  strong: ({children}) => <strong className="font-bold text-slate-900">{children}</strong>,
                },
              }}
            />
          </article>
        </div>

        {/* Coluna Direita: Sidebar B2B */}
        <aside className="lg:w-1/3 space-y-10">
          
          {/* Widget de Busca */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Buscar Artigo</h3>
            <div className="relative">
              <input type="text" placeholder="Ex: SEO Técnico..." className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#275c58] transition-all" />
              <button className="absolute right-3 top-3 text-slate-400 hover:text-[#275c58]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
            </div>
          </div>

          {/* Widget de Categorias */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Categorias</h3>
            <ul className="space-y-3">
              {categories.map((cat, i) => (
                <li key={i}>
                  <a href="#" className="text-slate-600 hover:text-[#f0815b] hover:translate-x-1 flex items-center gap-2 transition-all font-medium text-sm">
                    <svg className="w-4 h-4 text-[#275c58]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Widget de Tags */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Tags Populares</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, i) => (
                <a key={i} href="#" className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-[#275c58] hover:text-white transition-colors">
                  #{tag}
                </a>
              ))}
            </div>
          </div>

        </aside>

      </section>

      <Footer />
    </main>
  );
}