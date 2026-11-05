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
const query='*[_type=="diegoBook" && published==true && readConfirmed==true && defined(title) && defined(author) && defined(about) && defined(review) && length(about)>0 && length(review)>0] | order(sortOrder asc, _createdAt desc) {"id":_id,"slug":slug.current,title,author,category,about,review,lessons,recommendFor,rating,readYear,affiliateUrl,"imageUrl":cover.asset->url,"imageAlt":cover.alt}'
export default async function Page(){
 let approvedBooks:BookEntry[]=[]
 try{approvedBooks=await client.fetch<BookEntry[]>(query,{}, {cache:'no-store'})}
 catch(error){console.error('[diego-books] erro ao consultar catalogo',error)}
 const approvedSlugs=new Set(approvedBooks.map(book=>book.slug).filter(Boolean))
 const books:BookEntry[]=[...approvedBooks,...photographedBooks.filter(book=>!approvedSlugs.has(book.slug))]

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
