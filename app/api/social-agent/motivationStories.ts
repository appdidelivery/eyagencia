import {writeClient} from '../../../sanity/lib/writeClient'
import {makeBrandMotivationStorySvg} from '../../../scripts/brand-social-visual.mjs'
import {renderBrandStoryArt} from '../../../scripts/render-brand-art.mjs'

type BrandSlug='eyagencia'|'velo-delivery'
type PublishedFeed={_id:string;_rev:string;topic?:string;instagramPostId?:string;
  storyStatus?:string;storyAttempts?:number;storyPublishStartedAt?:string}
type Outcome={brand:BrandSlug;status:string;reason?:string}
type MetaResponse={id?:string;status_code?:string;error?:{code?:number;error_subcode?:number}}

const GRAPH='https://graph.facebook.com/v26.0'
const BRANDS:BrandSlug[]=['eyagencia','velo-delivery']

function localDate(now=new Date()){
  const parts=new Intl.DateTimeFormat('en-US',{
    timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit',
    weekday:'short',
  }).formatToParts(now)
  const get=(name:string)=>parts.find(item=>item.type===name)?.value||''
  return {day:get('year')+'-'+get('month')+'-'+get('day'),weekday:get('weekday')}
}
function credentials(brand:BrandSlug){
  const suffix=brand==='eyagencia'?'EYAGENCIA':'VELO_DELIVERY'
  const id=process.env['SOCIAL_META_INSTAGRAM_ID_'+suffix]
  const token=process.env['SOCIAL_META_PAGE_TOKEN_'+suffix]
  return id&&/^\d{8,30}$/.test(id)&&token?{id,token}:null
}
function storyJpeg(url:string){
  const source=new URL(url)
  if(source.protocol!=='https:'||source.hostname!=='cdn.sanity.io'||
      !source.pathname.startsWith('/images/'))throw Error('story_asset_invalid')
  source.search=''
  source.searchParams.set('fm','jpg')
  source.searchParams.set('w','1080')
  source.searchParams.set('h','1920')
  source.searchParams.set('fit','crop')
  return source.toString()
}
async function meta(method:'GET'|'POST',path:string,token:string,params:Record<string,string>={}){
  const url=new URL(GRAPH+'/'+path)
  if(method==='GET')for(const [key,value] of Object.entries(params))url.searchParams.set(key,value)
  const response=await fetch(url,{
    method,headers:{
      Authorization:'Bearer '+token,
      ...(method==='POST'?{'Content-Type':'application/x-www-form-urlencoded'}:{}),
    },
    ...(method==='POST'?{body:new URLSearchParams(params)}:{}),
    cache:'no-store',signal:AbortSignal.timeout(20000),
  })
  const json=await response.json().catch(()=>({})) as MetaResponse
  if(!response.ok||(method==='POST'&&!json.id))
    throw Error('meta_http_'+response.status+'_code_'+(json.error?.code||'unknown'))
  return json
}
async function ready(containerId:string,token:string){
  for(let attempt=0;attempt<8;attempt++){
    const state=await meta('GET',containerId,token,{fields:'status_code'})
    if(state.status_code==='FINISHED')return
    if(state.status_code==='ERROR'||state.status_code==='EXPIRED')
      throw Error('meta_story_container_'+state.status_code.toLowerCase())
    if(attempt<7)await new Promise(resolve=>setTimeout(resolve,4000))
  }
  throw Error('meta_story_not_ready')
}
async function publishBrandStory(brand:BrandSlug,day:string,weekday:string):Promise<Outcome>{
  const id='social-'+brand+'-'+day
  const post=await writeClient.fetch<PublishedFeed|null>(
    '*[_type=="socialPublication"&&_id==$id][0]'+
    '{_id,_rev,topic,instagramPostId,storyStatus,storyAttempts,storyPublishStartedAt}',
    {id},
  )
  // The Monday/Friday feed must exist. Never publish a disconnected Story.
  if(!post?.instagramPostId||!post.topic)return {brand,status:'feed_not_ready'}
  if(post.storyStatus==='published'||post.storyStatus==='verification_required'||
      post.storyStatus==='preparing'||post.storyStatus==='publishing')
    return {brand,status:'already_processed'}
  if(post.storyPublishStartedAt)return {brand,status:'publication_verification_required'}
  const attempts=Number(post.storyAttempts||0)
  if(attempts>=2)return {brand,status:'retry_exhausted'}
  const keys=credentials(brand)
  if(!keys)return {brand,status:'credentials_missing'}
  try{
    await writeClient.patch(post._id).ifRevisionId(post._rev).set({
      storyStatus:'preparing',storyAttempts:attempts+1,
      storyAttemptedAt:new Date().toISOString(),
    }).commit()
  }catch{return {brand,status:'already_reserved'}}
  let publishStarted=false
  try{
    const closing=weekday==='Fri'
    const png=await renderBrandStoryArt(makeBrandMotivationStorySvg({
      slug:brand,topic:post.topic,date:day,closing,
    }))
    const asset=await writeClient.assets.upload('image',png,{
      filename:'weekly-story-'+brand+'-'+day+'.png',
      contentType:'image/png',
    })
    const imageUrl=storyJpeg(asset.url)
    await writeClient.patch(id).set({
      storyAssetId:asset._id,storyStatus:'upload_ready',
    }).commit()
    const container=await meta('POST',keys.id+'/media',keys.token,{
      media_type:'STORIES',image_url:imageUrl,
    })
    await ready(String(container.id),keys.token)
    // Lock before sending media_publish: a timeout may mean actual publication.
    await writeClient.patch(id).set({
      storyStatus:'verification_required',
      storyPublishStartedAt:new Date().toISOString(),
      storyContainerId:String(container.id),
    }).commit()
    publishStarted=true
    const result=await meta('POST',keys.id+'/media_publish',keys.token,{
      creation_id:String(container.id),
    })
    await writeClient.patch(id).set({
      storyStatus:'published',storyPostId:String(result.id),
      storyPublishedAt:new Date().toISOString(),
      storyError:null,
    }).commit()
    return {brand,status:'published'}
  }catch(error){
    const reason=error instanceof Error?error.message.slice(0,105):'unknown'
    await writeClient.patch(id).set({
      storyStatus:publishStarted?'verification_required':'failed_before_publish',
      storyError:reason,
    }).commit().catch(()=>{})
    return {brand,status:publishStarted?'verification_required':'failed_before_publish',reason}
  }
}
export async function runWeeklyMotivationStories(){
  if(process.env.VERCEL_ENV!=='production'||
     process.env.SOCIAL_AGENT_ENABLED!=='true'||
     process.env.SOCIAL_AGENT_AUTOPUBLISH_ENABLED!=='true')
    return {enabled:false,results:[] as Outcome[]}
  if(!process.env.SANITY_API_WRITE_TOKEN)
    return {enabled:true,results:[{brand:'eyagencia' as BrandSlug,status:'sanity_missing'}]}
  const {day,weekday}=localDate()
  if(!['Mon','Fri'].includes(weekday))
    return {enabled:true,day,results:[] as Outcome[],status:'not_scheduled'}
  const results:Outcome[]=[]
  for(const brand of BRANDS){
    try{results.push(await publishBrandStory(brand,day,weekday))}
    catch(error){results.push({brand,status:'unexpected_failure',
      reason:error instanceof Error?error.message.slice(0,90):'unknown'})}
  }
  return {enabled:true,day,results}
}
