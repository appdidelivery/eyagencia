import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {client} from '../../../../../../sanity/lib/client'
import {bookTitle,bookUrl,chapters,type PublishedMedia} from '../../data'
export const dynamic='force-dynamic'
type Params={params:Promise<{codigo:string}>}
const query='*[_type=="diegoFloodMedia" && mediaCode==$code && published==true && approvedForPublic==true && rightsCleared==true && !(_id in path("drafts.**"))][0]{title,caption,credit,alt,chapterCode,eventDate,locationPublic,"code":mediaCode,"imageUrl":image.asset->url,videoUrl}'
async function getMedia(code:string):Promise<PublishedMedia|null>{try{return await client.fetch<PublishedMedia|null>(query,{code},{cache:'no-store'})}catch{return null}}
const validVideo=(url?:string|null)=>{if(!url)return false;try{const u=new URL(url);return u.protocol==='https:'&&['youtube.com','www.youtube.com','youtu.be','vimeo.com','player.vimeo.com'].includes(u.hostname)}catch{return false}}
export async function generateMetadata({params}:Params):Promise<Metadata>{
 const {codigo}=await params
 const m=/^[mv]\d{3}$/.test(codigo)?await getMedia(codigo):null
 return {title:m?m.title+' | Arquivo de '+bookTitle:'Registro '+codigo.toUpperCase()+' | '+bookTitle,robots:{index:!!m,follow:true},alternates:{canonical:bookUrl+'/registro/'+codigo},description:m?.caption||'Registro documental em preparação para o Livro Vivo.'}
}
export default async function Registro({params}:Params){
 const {codigo}=await params
 if(!/^(c\d{2}|[mv]\d{3})$/.test(codigo))notFound()
 const chapter=chapters.find(c=>c.code===codigo)
 const media=!chapter?await getMedia(codigo):null
 if(chapter===undefined && media===null && !/^[mv]\d{3}$/.test(codigo))notFound()
 return <main style={{minHeight:'100vh',padding:'30px 18px 90px',background:'#f3f2ed',color:'#253f46',fontFamily:'Georgia,serif'}}>
   <div style={{maxWidth:850,margin:'auto'}}>
    <nav style={{font:'700 13px Inter,Arial,sans-serif'}}><Link style={{color:'#356b73'}} href="/diego/obras">Obras</Link> <span aria-hidden="true"> / </span><Link style={{color:'#356b73'}} href="/diego/obras/enquanto-a-agua-subia">{bookTitle}</Link><span aria-hidden="true"> / Arquivo</span></nav>
    <div style={{borderTop:'1px solid #cad6d4',marginTop:28,paddingTop:45}}>
     <span style={{font:'800 11px Inter,Arial,sans-serif',letterSpacing:'.19em',color:'#4d8085'}}>REGISTRO {codigo.toUpperCase()} · ARQUIVO DIGITAL</span>
     <h1 style={{fontSize:'clamp(33px,5vw,65px)',fontWeight:500,letterSpacing:'-.04em',margin:'22px 0 18px',lineHeight:1.1}}>{chapter?.title||media?.title||'Registro em preparação'}</h1>
     {chapter?
       <><p style={{fontSize:20,lineHeight:1.7}}>Este endereço identifica permanentemente o capítulo {String(chapter.number).padStart(2,'0')} do livro. A edição digital será atualizada conforme o manuscrito avançar, mantendo o mesmo link para futuros QR codes do impresso.</p>
       <Link style={{display:'inline-block',padding:'15px 20px',borderRadius:7,background:'#245e69',color:'white',font:'700 13px Inter,Arial,sans-serif',textDecoration:'none',marginTop:22}} href={'/diego/obras/enquanto-a-agua-subia#'+chapter.code}>Abrir capítulo no Livro Vivo ↗</Link></>:
       media?
       <div style={{marginTop:25}}>
        {media.imageUrl&&<figure style={{margin:0}}><img src={media.imageUrl} alt={media.alt||media.title} style={{display:'block',maxWidth:'100%',maxHeight:700,objectFit:'contain',borderRadius:10}}/><figcaption style={{paddingTop:17,color:'#56686a',fontSize:14,lineHeight:1.7}}>{media.caption||media.title}</figcaption></figure>}
        {validVideo(media.videoUrl)&&<a href={media.videoUrl!} target="_blank" rel="noopener noreferrer" style={{display:'inline-block',padding:14,color:'#245e69',font:'700 14px Inter,Arial,sans-serif'}}>Assistir ao vídeo autorizado ↗</a>}
        <p style={{color:'#62787b',font:'13px/1.8 Inter,Arial,sans-serif'}}>Código: {media.code?.toUpperCase()}{media.eventDate?' · Registro: '+media.eventDate:''}{media.locationPublic?' · Local: '+media.locationPublic:''}{media.credit?' · Crédito: '+media.credit:''}</p>
        {media.chapterCode&&<Link href={'/diego/obras/enquanto-a-agua-subia#'+media.chapterCode} style={{color:'#245e69',font:'700 14px Inter,Arial,sans-serif'}}>Ler o capítulo relacionado ↗</Link>}
       </div>:
       <div style={{borderLeft:'3px solid #b58b53',padding:'14px 22px',background:'#ebe4d8',marginTop:25}}>
        <p style={{fontSize:19,lineHeight:1.7}}>Este código já está reservado para um registro fotográfico ou audiovisual do livro. A imagem ou vídeo ainda não foi liberado para publicação.</p>
        <p style={{font:'13px/1.7 Inter,Arial,sans-serif'}}>Os registros originais permanecem no acervo privado. Cada material será vinculado aqui após identificação, checagem de autoria e autorização editorial.</p>
       </div>}
    </div>
   </div>
 </main>
}
