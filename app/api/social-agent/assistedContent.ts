import {writeClient} from '../../../sanity/lib/writeClient'
import {brands,type Brand} from '../../lib/social-google-binding'
type Source={_id:string;title?:string;caption?:string;format?:string;images?:string[];video?:string;publishedAt?:string}
function safeAsset(value:unknown,kind:'image'|'video'){
 if(typeof value!=='string')return false
 try{const u=new URL(value);return u.origin==='https://cdn.sanity.io'&&!u.username&&!u.password&&u.pathname.startsWith(kind==='image'?'/images/':'/files/')&&(kind==='image'||u.pathname.endsWith('.mp4'))}catch{return false}
}
export async function recentAssistedContent(){
 const since=new Date(Date.now()-7*86400000).toISOString()
 return Promise.all(brands.map(async (brand:Brand)=>{
  const sources=await writeClient.fetch<Source[]>('*[_type=="socialPublication" && brandId in *[_type=="socialBrand" && slug.current==$brand]._id && status in ["published","partial"] && (defined(instagramPostId)||defined(facebookPostId)) && finishedAt >= $since] | order(finishedAt desc)[0...8]{_id,"title":topic,caption,format,"images":select(defined(carouselImages)=>carouselImages,defined(imageUrl)=>[imageUrl],[]),"video":videoUrl,"publishedAt":finishedAt}',{brand,since})
  if(brand==='eyagencia'){
   const packages=await writeClient.fetch<Source[]>('*[_type=="socialPackage" && state=="published" && defined(instagramCarouselPostId) && publishedAt >= $since && count(carouselMedia)==8] | order(publishedAt desc)[0...8]{_id,title,caption,"format":"carousel","images":carouselMedia[].imageUrl,publishedAt}',{since})
   sources.push(...packages)
  }
  const items=sources.filter(s=>s.title&&s.caption&&((s.video&&safeAsset(s.video,'video'))||(!s.video&&s.images?.length&&s.images.every(u=>safeAsset(u,'image'))&&(s.format!=='carousel'||s.images.length===8))))
  return {brand,items:items.sort((a,b)=>String(b.publishedAt).localeCompare(String(a.publishedAt))).slice(0,6)}
 }))
}
