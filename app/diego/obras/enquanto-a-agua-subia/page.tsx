import type {Metadata} from 'next'
import {client} from '../../../../sanity/lib/client'
import LivroVivo from './LivroVivo'
import {bookUrl,bookTitle,bookSubtitle,type PublishedChapter,type PublishedMedia} from './data'

export const dynamic='force-dynamic'
export const metadata:Metadata={
 title:'Enquanto a Água Subia — Livro Vivo | Diego Lemes',
 description:'Projeto do segundo livro de Diego Lemes sobre a enchente de 2024 em Porto Alegre, solidariedade e memória familiar. Edição digital preliminar em construção.',
 alternates:{canonical:bookUrl},
 // A versão de pesquisa é acessível pelo link, mas ainda não é um livro final para indexação.
 robots:{index:false,follow:true},
 openGraph:{title:bookTitle+' — Livro Vivo',description:bookSubtitle,url:bookUrl,type:'website',locale:'pt_BR'}
}
const chaptersQuery='*[_type=="diegoFloodChapter" && published==true && authorApproved==true && !(_id in path("drafts.**"))] | order(order asc) {"code":chapterCode,"title":title,"body":body,"revisedAt":_updatedAt}'
const mediaQuery='*[_type=="diegoFloodMedia" && published==true && approvedForPublic==true && rightsCleared==true && !(_id in path("drafts.**"))] | order(_createdAt asc) {"code":mediaCode,title,caption,credit,alt,chapterCode,eventDate,locationPublic,"imageUrl":image.asset->url,videoUrl}'

export default async function FloodBookPage(){
 let publishedChapters:PublishedChapter[]=[]
 let approvedMedia:PublishedMedia[]=[]
 try{[publishedChapters,approvedMedia]=await Promise.all([
   client.fetch<PublishedChapter[]>(chaptersQuery,{}, {cache:'no-store'}),
   client.fetch<PublishedMedia[]>(mediaQuery,{}, {cache:'no-store'})
  ])}catch(error){console.error('[diego-ebook] falha no CMS',error instanceof Error?error.message:'erro')}
 const personUrl='https://www.eyagencia.com.br/diego'
 const structuredData={'@context':'https://schema.org','@graph':[
  {'@type':'CreativeWork','@id':bookUrl+'#work',name:bookTitle,description:bookSubtitle,inLanguage:'pt-BR',url:bookUrl,creativeWorkStatus:'Draft',author:{'@type':'Person',name:'Diego Lemes',url:personUrl},about:[{'@type':'Event',name:'Enchentes no Rio Grande do Sul em 2024'},{'@type':'Place',name:'Porto Alegre, Rio Grande do Sul'}]},
  {'@type':'WebPage','@id':bookUrl+'#page',url:bookUrl,name:bookTitle+' — edição digital de trabalho',mainEntity:{'@id':bookUrl+'#work'},isPartOf:{'@type':'WebSite',url:personUrl}}
 ]}
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,'\\u003c')}}/><LivroVivo approvedMedia={approvedMedia.filter(m=>/^([mv]\d{3})$/.test(m.code||''))} publishedChapters={publishedChapters.filter(c=>/^c\d{2}$/.test(c.code||'')&&!!c.body?.trim())}/></>
}
