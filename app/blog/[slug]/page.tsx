import { client } from "../../../sanity/lib/client";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Header from "../../../components/Header";
import BlogEngagement from "../../../components/BlogEngagement";
import Footer from "../../../components/Footer";
import {blogCoverUrl} from "../../../sanity/lib/blogCover";

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
      "imageSource": mainImage.generationSource,
      "date": publishedAt,
      "authorName": author->name
    }`,
    { slug: resolvedParams.slug }
  );
  
  if (!post) return { title: "Página não encontrada | EyAgencia" };
  
  const postUrl = `https://www.eyagencia.com.br/blog/${resolvedParams.slug}`;
  const cover = blogCoverUrl({...post, slug: resolvedParams.slug});
  const ogCover = cover?.startsWith('/') ? 'https://www.eyagencia.com.br' + cover : cover;

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
          url: ogCover || 'https://www.eyagencia.com.br/eyagencia-logo-verde.png',
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
      images: [ogCover || 'https://www.eyagencia.com.br/eyagencia-logo-verde.png'],
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
      "_updatedAt": _updatedAt,
      body,
      "authorName": author->name,
      "imageUrl": mainImage.asset->url,
      "imageSource": mainImage.generationSource,
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
  const displayImage = blogCoverUrl({...post, slug: resolvedParams.slug});
  const feedbackRaw = await client.fetch(groq`{
    "likes": count(*[_type == "blogFeedback" && postSlug == $slug && kind == "like"]),
    "ratings": *[_type == "blogFeedback" && postSlug == $slug && kind == "rating"].rating,
    "comments": *[_type == "blogFeedback" && postSlug == $slug && kind == "comment" && status == "approved"] | order(createdAt desc)[0...20]{name,message,createdAt},
    "commentCount": count(*[_type == "blogFeedback" && postSlug == $slug && kind == "comment" && status == "approved"])
  }`, {slug: resolvedParams.slug});
  const ratingValues: number[] = (feedbackRaw.ratings || []).filter((value: unknown) => Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 5);
  const feedback = {
    likes: feedbackRaw.likes || 0,
    ratingCount: ratingValues.length,
    ratingAverage: ratingValues.length ? Math.round(10 * ratingValues.reduce((sum:number, value:number) => sum + value, 0) / ratingValues.length) / 10 : null,
    commentCount: feedbackRaw.commentCount || 0,
    comments: feedbackRaw.comments || []
  };
  const byline = post.authorName || "Equipe EyAgencia";
  const isEditorialTeam = /^equipe|^reda[cç][aã]o/i.test(byline);
  const structuredAuthor = isEditorialTeam
    ? {"@type":"Organization","name":"EyAgencia","url":"https://www.eyagencia.com.br"}
    : {"@type":"Person","name":byline};


  // Preparação de Dados para o JSON-LD (Schema.org - Update MUVERA)
  const postUrl = `https://www.eyagencia.com.br/blog/${resolvedParams.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || post.title,
    "image": displayImage ? [displayImage.startsWith("/") ? "https://www.eyagencia.com.br" + displayImage : displayImage] : [],
    "datePublished": post.date,
    "dateModified": post._updatedAt || post.date,
    "inLanguage": "pt-BR",
    "url": postUrl,
    "author": structuredAuthor,
    "publisher": {
        "@type": "Organization",
        "name": "EyAgencia",
        "logo": {
            "@type": "ImageObject",
            "url": "https://www.eyagencia.com.br/eyagencia-logo-verde.png"
        }
    },
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": postUrl
    },
    "interactionStatistic": [
      ...(feedback.likes ? [{"@type":"InteractionCounter","interactionType":{"@type":"LikeAction"},"userInteractionCount":feedback.likes}] : []),
      ...(feedback.commentCount ? [{"@type":"InteractionCounter","interactionType":{"@type":"CommentAction"},"userInteractionCount":feedback.commentCount}] : [])
    ],
    ...(feedback.ratingCount ? {"aggregateRating":{"@type":"AggregateRating","ratingValue":feedback.ratingAverage,"ratingCount":feedback.ratingCount,"bestRating":5,"worstRating":1}} : {}),
    ...(feedback.comments.length ? {"comment":feedback.comments.map((item:{name?:string,message:string,createdAt?:string},index:number)=>({
      "@type":"Comment",
      "@id":postUrl+"#comment-"+(index+1),
      "text":item.message,
      "author":{"@type":"Person","name":item.name||"Leitor"},
      "dateCreated":item.createdAt
    }))} : {})
  };

  const breadcrumbJsonLd = {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Início","item":"https://www.eyagencia.com.br/"},
      {"@type":"ListItem","position":2,"name":"Blog","item":"https://www.eyagencia.com.br/blog"},
      {"@type":"ListItem","position":3,"name":post.title,"item":postUrl}
    ]
  };
  // Dados da Sidebar
  const categories = ["SEO Técnico", "Tráfego Pago", "E-commerce B2B", "Inbound Marketing", "Web Analytics"];
  const popularTags = ["Vtex", "ROAS", "Core Web Vitals", "LTV", "Automação", "JSON-LD"];

  return (
    <main className="flex min-h-screen flex-col w-full bg-slate-50">
      {/* Script JSON-LD Injetado no DOM para Leitura do Algoritmo */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c")}} />
      <Header />
      
      {/* Header minimalista do artigo */}
      <section className="pt-40 pb-12 px-6 lg:px-8 text-center bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Caminho de navegação" className="text-sm text-slate-500 mb-5">
            <a href="/" className="hover:text-[#275c58]">Início</a><span className="mx-2">›</span>
            <a href="/blog" className="hover:text-[#275c58]">Blog</a>
          </nav>
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
          {displayImage && (
            <div className="mb-10 w-full overflow-hidden rounded-xl border border-slate-100">
              <img 
                src={displayImage} 
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

          {/* Interações acessíveis com persistência e moderação */}
          <BlogEngagement slug={resolvedParams.slug} title={post.title} initialData={feedback} />
        </div>

        {/* Coluna Direita: Sidebar B2B */}
        <aside className="lg:w-1/3 space-y-10">
          
          {/* Widget de Busca */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Buscar Artigo</h3>
            <form action="/blog" method="get" className="flex gap-2">
              <label htmlFor="article-blog-search" className="sr-only">Buscar artigos</label>
              <input id="article-blog-search" type="search" name="q" placeholder="Ex.: SEO Técnico" className="min-w-0 flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#275c58]"/>
              <button type="submit" className="bg-[#275c58] text-white px-4 py-3 rounded-lg font-bold" aria-label="Pesquisar">Buscar</button>
            </form>
          </div>

          {/* Widget de Categorias */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Categorias</h3>
            <ul className="space-y-3">
              {categories.map((cat, i) => (
                <li key={i}>
                  <a href={`/blog?category=${encodeURIComponent(cat)}`} className="text-slate-600 hover:text-[#f0815b] hover:translate-x-1 flex items-center gap-2 transition-all font-medium text-sm">
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
                <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md text-xs font-semibold">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

        </aside>

      </section>

      <Footer />
    </main>
  );
}