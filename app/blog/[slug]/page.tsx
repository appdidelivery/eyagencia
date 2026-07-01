import { client } from "../../../sanity/lib/client";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

// 1. Metadados dinâmicos para SEO (Puxa o título e descrição que a Sophia preencheu)
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]{ title, "desc": seoDescription }`,
    { slug: params.slug }
  );
  
  if (!post) return { title: "Página não encontrada | EyAgencia" };
  
  return {
    title: `${post.title} | EyAgencia`,
    description: post.desc,
  };
}

// 2. Renderização da Página do Artigo
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Busca o post específico baseado na URL
  const post = await client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]{
      title,
      "date": publishedAt,
      body,
      "authorName": author->name
    }`,
    { slug: params.slug }
  );

  // Se o post não existir no banco, dispara o 404 real do Next.js
  if (!post) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col w-full bg-white">
      <Header />
      
      {/* Cabeçalho do Artigo */}
      <section className="pt-40 pb-12 px-6 lg:px-8 max-w-4xl mx-auto w-full text-center border-b border-slate-100">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-slate-500 font-medium">
          <span>Por {post.authorName || "Equipe EyAgencia"}</span>
          <span>•</span>
          <span>{post.date ? new Date(post.date).toLocaleDateString('pt-BR') : "Artigo Recente"}</span>
        </div>
      </section>

      {/* Conteúdo Rico do Artigo (Texto do Sanity) */}
      <article className="py-12 px-6 lg:px-8 max-w-3xl mx-auto w-full text-slate-700 text-lg leading-relaxed">
        <PortableText 
          value={post.body} 
          components={{
            block: {
              h2: ({children}) => <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-4 leading-snug">{children}</h2>,
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

      <Footer />
    </main>
  );
}