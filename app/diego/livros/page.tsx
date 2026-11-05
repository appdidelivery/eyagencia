import type {Metadata} from 'next'
import {client} from '../../../sanity/lib/client'
import BookCatalog,{type BookEntry} from './BookCatalog'

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
 let books:BookEntry[]=[]
 try{books=await client.fetch<BookEntry[]>(query,{}, {cache:'no-store'})}
 catch(error){console.error('[diego-books] erro ao consultar catalogo',error)}
 const schema={'@context':'https://schema.org','@type':'CollectionPage',name:'Livros que eu li — Diego Lemes',url,mainEntity:{'@type':'ItemList',numberOfItems:books.length,itemListElement:books.map((b,i)=>({'@type':'ListItem',position:i+1,name:b.title,url:url+'#'+encodeURIComponent(b.slug||b.id)}))}}
 return <>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  <BookCatalog books={books}/>
 </>
}
