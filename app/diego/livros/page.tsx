import type {Metadata} from 'next'
import {client} from '../../../sanity/lib/client'
import BookCatalog,{type BookEntry} from './BookCatalog'
import {photographedBooks} from './seedBooks'

const url='https://www.eyagencia.com.br/diego/livros'
export const dynamic='force-dynamic'
export const metadata:Metadata={
 title:'Livros que eu li | Diego Lemes',
 description:'Minha biblioteca de leituras: sobre o que é cada livro, o que achei, aprendizados e indicações pessoais.',
 alternates:{canonical:url},
 openGraph:{title:'Livros que eu li | Diego Lemes',description:'Minhas leituras e resenhas pessoais.',url,siteName:'Diego Lemes',locale:'pt_BR',type:'website'}
}
// Consultar também documentos despublicados evita que o fallback os exiba novamente.
const query='*[_type=="diegoBook" && defined(slug.current)] | order(sortOrder asc, _createdAt desc) {"id":_id,"slug":slug.current,title,author,category,about,review,lessons,recommendFor,rating,readYear,affiliateUrl,amazonAffiliateUrl,shopeeAffiliateUrl,published,readConfirmed,"imageUrl":coalesce(cover.asset->url,coverUrl),"imageAlt":cover.alt}'

export default async function Page(){
 type CmsEntry=BookEntry&{published?:boolean;readConfirmed?:boolean}
 let cmsBooks:CmsEntry[]=[]
 try{cmsBooks=await client.fetch<CmsEntry[]>(query,{}, {cache:'no-store'})}
 catch(error){console.error('[diego-books] erro ao consultar catalogo',error)}
 const cmsSlugs=new Set(cmsBooks.map(book=>book.slug).filter(Boolean))
 const publishedCms=cmsBooks.filter(book=>book.published===true&&book.readConfirmed===true&&book.title&&book.author&&book.about?.trim()&&book.review?.trim())
 // Affiliate links in approved editorial seed remain available until the same title is edited in Sanity.
 // CMS values always take precedence when supplied.
 const seedBySlug=new Map(photographedBooks.map(book=>[book.slug,book]))
 const resolvedCms:BookEntry[]=publishedCms.map(book=>({...book,
  affiliateUrl:book.affiliateUrl||seedBySlug.get(book.slug)?.affiliateUrl||null,
  amazonAffiliateUrl:book.amazonAffiliateUrl||seedBySlug.get(book.slug)?.amazonAffiliateUrl||null,
  shopeeAffiliateUrl:book.shopeeAffiliateUrl||seedBySlug.get(book.slug)?.shopeeAffiliateUrl||null
 }))
 const books:BookEntry[]=[...resolvedCms,...photographedBooks.filter(book=>!cmsSlugs.has(book.slug))]

 const personUrl='https://www.eyagencia.com.br/diego#person'
 const person={'@type':'Person',name:'Diego Lemes','@id':personUrl,url:'https://www.eyagencia.com.br/diego'}
 const bookItems=books.map((b,index)=>{
  const book={'@type':'Book','@id':url+'#'+encodeURIComponent(b.slug||b.id),name:b.title,author:{'@type':'Person',name:b.author},
   inLanguage:'pt-BR',description:b.about,url:url+'#'+encodeURIComponent(b.slug||b.id),
   ...(b.imageUrl?{image:b.imageUrl}:{}),
   review:{'@type':'Review',author:{'@id':personUrl},reviewBody:b.review,
    ...(b.rating&&b.rating>=1&&b.rating<=5?{reviewRating:{'@type':'Rating',ratingValue:b.rating,bestRating:5,worstRating:1}}:{})}
  }
  return {'@type':'ListItem',position:index+1,item:book}
 })
 const schema={'@context':'https://schema.org','@graph':[
  {'@type':'CollectionPage','@id':url+'#webpage',name:'Biblioteca pessoal de Diego Lemes — Livros que li',
   url,description:'Resenhas de livros lidos por Diego Lemes e reflexões aplicadas a tecnologia, negócios, gestão, fé e desenvolvimento pessoal.',
   isPartOf:{'@type':'WebSite','@id':'https://www.eyagencia.com.br/#website',url:'https://www.eyagencia.com.br/',name:'EyAgencia'},
   about:{'@id':personUrl},creator:{'@id':personUrl},inLanguage:'pt-BR',
   mainEntity:{'@type':'ItemList','@id':url+'#livros',name:'Livros que li',numberOfItems:bookItems.length,itemListElement:bookItems}},
   person
 ]}

 return <>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  <BookCatalog books={books}/>
 </>
}
