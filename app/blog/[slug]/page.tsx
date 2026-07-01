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

// 1. Metadados dinâmicos para SEO e Redes Sociais (Open Graph)
export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  
  const post = await client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]{ 
      title, 
      "desc": seoDescription,
      "imageUrl": mainImage.asset->url,
      "date": publishedAt,
      "authorName": author->name
    }`,
    { slug: resolvedParams.slug }
  );
  
  if (!post) return { title: "Página não encontrada | EyAgencia" };
  
  const postUrl = `https://eyagencia.com.br/blog/${resolvedParams.slug}`;

  return {
    title: `${post.title} | EyAgencia`,
    description: post.desc,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.desc,
      url: postUrl,
      siteName: 'EyAgencia',
      images: [
        {
          url: post.imageUrl || 'https://eyagencia.com.br/eyagencia-logo-verde.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'pt_BR',
      type: 'article',
      publishedTime: post.date,
      authors: [post.authorName || 'EyAgencia'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.desc,
      images: [post.imageUrl || 'https://eyagencia.com.br/eyagencia-logo-verde.png'],
    },
  };
}

// 2. Renderização da Página do Artigo
export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;

  // Busca o post específico com TODAS as informações, incluindo Resumo e Áudio
  const post = await client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]{
      title,
      "date": publishedAt,
      body,
      "authorName": author->name,
      "imageUrl": mainImage.asset->url,
      "imageAlt": mainImage.alt,
      excerpt,
      audioUrl
    }`,
    { slug: resolvedParams.slug }
  );

  // Se o post não existir no banco, dispara o 404
  if (!post) {
    notFound();
  }

  // Preparação de Dados para o JSON-LD (Schema.org - Update MUVERA)
  const postUrl = `https://eyagencia.com.br/blog/${resolvedParams.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || post.title,
    "image": post.imageUrl ? [post.imageUrl] : [],
    "datePublished": post.date,
    "dateModified": post.date,
    "author": [{
        "@type": "Person",
        "name": post.authorName || "Equipe EyAgencia",
        "url": "https://eyagencia.com.br"
    }],
    "publisher": {
        "@type": "Organization",
        "name": "EyAgencia",
        "logo": {
            "@type": "ImageObject",
            "url": "https://eyagencia.com.br/eyagencia-logo-verde.png"
        }
    },
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": postUrl
    }
  };

  // Dados da Sidebar
  const categories = ["SEO Técnico", "Tráfego Pago", "E-commerce B2B", "Inbound Marketing", "Web Analytics"];
  const popularTags = ["Vtex", "ROAS", "Core Web Vitals", "LTV", "Automação", "JSON-LD"];

  return (
    <main className="flex min-h-screen flex-col w-full bg-slate-50">
      {/* Script JSON-LD Injetado no DOM para Leitura do Algoritmo */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          
          {/* Renderização da Imagem Principal */}
          {post.imageUrl && (
            <div className="mb-10 w-full overflow-hidden rounded-xl border border-slate-100">
              <img 
                src={post.imageUrl} 
                alt={post.imageAlt || post.title} 
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          )}

          {/* Box de Resumo Executivo (E-E-A-T / UX) */}
          {post.excerpt && (
            <div className="mb-10 bg-[#275c58]/5 border-l-4 border-[#275c58] p-6 rounded-r-xl">
              <h4 className="text-sm font-black uppercase tracking-wider text-[#275c58] mb-2">Resumo Executivo</h4>
              <p className="text-slate-700 font-medium leading-relaxed">{post.excerpt}</p>
            </div>
          )}

          {/* Player de Áudio (Aumenta o Dwell Time / Retenção) */}
          {post.audioUrl && (
            <div className="mb-10 bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-[#f0815b] rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <div className="w-full flex-grow">
                <p className="text-sm font-bold text-slate-900 mb-1">Ouvir versão em áudio</p>
                <audio controls className="w-full h-8 outline-none">
                  <source src={post.audioUrl} type="audio/mpeg" />
                  Seu navegador não suporta o elemento de áudio.
                </audio>
              </div>
            </div>
          )}

          {/* Corpo do Texto formatado (Com tipagem corrigida) */}
          <article className="text-slate-700 text-lg leading-relaxed">
            <PortableText 
              value={post.body} 
              components={{
                block: {
                  h2: ({children}: any) => <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6 leading-snug">{children}</h2>,
                  h3: ({children}: any) => <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 leading-snug">{children}</h3>,
                  normal: ({children}: any) => <p className="mb-6">{children}</p>,
                },
                list: {
                  bullet: ({children}: any) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
                  number: ({children}: any) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
                },
                marks: {
                  strong: ({children}: any) => <strong className="font-bold text-slate-900">{children}</strong>,
                  link: ({children, value}: any) => {
                    const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
                    return (
                      <a 
                        href={value?.href} 
                        target={target} 
                        rel={target === '_blank' ? 'noopener noreferrer' : undefined} 
                        className="text-[#f0815b] font-semibold hover:text-[#275c58] underline decoration-2 underline-offset-4 transition-colors"
                      >
                        {children}
                      </a>
                    );
                  },
                },
              }}
            />
          </article>

          {/* Social Signals: Botões de Compartilhamento B2B */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Compartilhe este artigo</h4>
            <div className="flex items-center gap-4">
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Leitura recomendada: " + post.title + " " + postUrl)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                WhatsApp
              </a>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#0077b5] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
            </div>
          </div>
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