import {createHash} from 'node:crypto'
import {writeClient} from '../../../sanity/lib/writeClient'
import {brands,refreshBinding,googleJson,type Brand} from '../../lib/social-google-binding'
import {gbpPayload} from '../../../scripts/social-channel-routing.mjs'
type Candidate={_id:string;caption:string;imageUrl:string;sourceUrl?:string;sourcePostId?:string;topic:string}
async function candidates(brand:Brand,since:string,day:string){
 const result=await writeClient.fetch<Candidate[]>(
 '*[_type=="socialPublication" && brandId in *[_type=="socialBrand" && slug.current==$brand]._id && status in ["published","partial"] && (defined(instagramPostId)||defined(facebookPostId)) && defined(imageUrl) && !defined(videoUrl) && finishedAt >= $since && day == $day] | order(finishedAt desc)[0...8]{_id,caption,imageUrl,sourceUrl,sourcePostId,topic}',
 {brand,since,day})
 if(brand==='eyagencia'){
  const packages=await writeClient.fetch<Candidate[]>(
  '*[_type=="socialPackage" && state=="published" && defined(instagramCarouselPostId) && publishedAt >= $since && publishedAt >= $dayStart && publishedAt < $dayEnd && count(carouselMedia)==8] | order(publishedAt desc)[0...8]{_id,caption,"imageUrl":carouselMedia[0].imageUrl,sourceUrl,sourcePostId,"topic":title}',
  {since,dayStart:day+'T03:00:00Z',dayEnd:new Date(Date.parse(day+'T03:00:00Z')+86400000).toISOString()})
  result.push(...packages)
 }
 return result
}
export async function publishGoogleBusiness(){
 if(process.env.VERCEL_ENV!=='production'||process.env.SOCIAL_GBP_AUTOPUBLISH_ENABLED!=='true')return {status:'disabled'}
 const since=process.env.SOCIAL_GOOGLE_PUBLISH_SINCE||''
 if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(since)||!Number.isFinite(Date.parse(since)))return {status:'start_date_missing'}
 const day=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())
 const results=[]
 for(const brand of brands){
  try{
   const key=await refreshBinding(brand,'gbp')
   if(!/^accounts\/\d+\/locations\/\d+$/.test(key.target))throw Error('target_invalid')
   // Read-only permission check before attempting to reserve or publish.
   await googleJson('https://mybusiness.googleapis.com/v4/'+key.target+'/localPosts?pageSize=1',key.token)
   for(const source of await candidates(brand,since,day)){
    const payload=gbpPayload({brand,caption:source.caption,imageUrl:source.imageUrl,sourceUrl:source.sourceUrl})
    const fingerprint=createHash('sha256').update(brand+'|'+(source.sourcePostId||source.sourceUrl||source._id)).digest('hex')
    const id='google-social-gbp-'+fingerprint
    const daily='google-social-gbp-day-'+brand+'-'+day
    try{
     await writeClient.transaction().create({_id:id,_type:'googleSocialDelivery',brand,channel:'gbp',sourceId:source._id,status:'verification_required',day,createdAt:new Date().toISOString()})
      .create({_id:daily,_type:'googleSocialDailyLock',deliveryId:id,day}).commit()
    }catch{continue}
    // An uncertain POST is never retried automatically.
    try{
     const post=await googleJson('https://mybusiness.googleapis.com/v4/'+key.target+'/localPosts',key.token,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
     if(typeof post.name!=='string'||!post.name.startsWith(key.target+'/localPosts/'))throw Error('response_unverified')
     const verified=await googleJson('https://mybusiness.googleapis.com/v4/'+post.name,key.token)
     const status=verified.name===post.name&&verified.state==='LIVE'?'published':'submitted'
     await writeClient.patch(id).set({status,providerId:post.name,providerState:verified.state||'unknown',finishedAt:new Date().toISOString()}).commit()
     results.push({brand,status});break
    }catch{
     results.push({brand,status:'verification_required'});break
    }
   }
  }catch(error){results.push({brand,status:'blocked',reason:error instanceof Error&&/^[a-z_]+(?:\d+)?$/.test(error.message)?error.message:'validation_failed'})}
 }
 return {status:'completed',results}
}
