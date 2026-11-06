import {writeClient} from '../../../sanity/lib/writeClient'

// Complements previously published EYAGENCIA Instagram blog carousels only.
// This does not touch Velo's social agents and NEVER republishes IG feed posts.
const GRAPH = 'https://graph.facebook.com/v26.0'
const PAGE_ID = '111936242586261'
const IG_ID = '17841405340034804'
const STORY_COUNT = 4
const PHOTO_COUNT = 8

type Media = {index?:number; imageUrl?:string}
type StoryPost = {_key?:string; index:number; postId:string}
type Package = {
  _id:string; _rev:string; sourcePostId?:string; sourceSlug?:string; sourceUrl?:string
  caption?:string; instagramCarouselPostId?:string
  carouselMedia?:Media[]; storyMedia?:Media[]
  facebookCarouselPostId?:string; facebookPublishStatus?:string
  instagramStoryPosts?:StoryPost[]; instagramStoryStatus?:string
  crosspostStatus?:string; crosspostAttempts?:number
}
type MetaResponse = {id?:string; status_code?:string; error?:{code?:number; error_subcode?:number}}
type Outcome = {status:string; packageId?:string; facebookId?:string; storyCount?:number; reason?:string}

function credentials(){
  const pageId=process.env.SOCIAL_META_PAGE_ID_EYAGENCIA
  const igId=process.env.SOCIAL_META_INSTAGRAM_ID_EYAGENCIA
  const token=process.env.SOCIAL_META_PAGE_TOKEN_EYAGENCIA
  if(pageId!==PAGE_ID||igId!==IG_ID||!token)return null
  return {pageId,igId,token}
}

function mediaJpeg(value:string,kind:'story'|'feed'){
  const url=new URL(value)
  if(url.protocol!=='https:'||url.hostname!=='cdn.sanity.io'||
    !url.pathname.startsWith('/images/'))throw new Error('invalid_public_media')
  url.search=''
  url.searchParams.set('fm','jpg')
  url.searchParams.set('w','1080')
  url.searchParams.set('h',kind==='story'?'1920':'1350')
  url.searchParams.set('fit','crop')
  return url.toString()
}
function mediaCheck(items:Media[]|undefined,count:number,kind:'story'|'feed'){
  if(!items||items.length!==count||items.some((m,i)=>m.index!==i+1||!m.imageUrl))
    throw new Error(kind+'_media_incomplete')
  return items.map(m=>mediaJpeg(String(m.imageUrl),kind))
}
async function meta(method:'GET'|'POST',path:string,token:string,
  params:Record<string,string>={}):Promise<MetaResponse>{
  const url=new URL(GRAPH+'/'+path)
  if(method==='GET')for(const [k,v] of Object.entries(params))url.searchParams.set(k,v)
  const response=await fetch(url,{
    method,headers:{
      Authorization:'Bearer '+token,
      ...(method==='POST'?{'Content-Type':'application/x-www-form-urlencoded'}:{}),
    },
    ...(method==='POST'?{body:new URLSearchParams(params)}:{}),
    cache:'no-store',signal:AbortSignal.timeout(20000),
  })
  const data=await response.json().catch(()=>({})) as MetaResponse
  if(!response.ok||(method==='POST'&&!data.id)){
    // Do not log URL, token, article content, or raw response.
    throw new Error('meta_http_'+response.status+'_code_'+
      (data.error?.code||'unknown')+'_subcode_'+(data.error?.error_subcode||'none'))
  }
  return data
}
async function ready(id:string,token:string){
  for(let i=0;i<8;i++){
    const result=await meta('GET',id,token,{fields:'status_code'})
    if(result.status_code==='FINISHED')return
    if(result.status_code==='EXPIRED'||result.status_code==='ERROR')
      throw new Error('meta_media_'+result.status_code.toLowerCase())
    if(i<7)await new Promise(resolve=>setTimeout(resolve,4000))
  }
  throw new Error('meta_media_not_ready')
}
async function pageIdentity(token:string){
  const me=await meta('GET','me',token,{fields:'id'})
  if(me.id!==PAGE_ID)throw new Error('eyagencia_page_identity_mismatch')
}
async function instagramIdentity(token:string){
  const me=await meta('GET',IG_ID,token,{fields:'id'})
  if(me.id!==IG_ID)throw new Error('eyagencia_instagram_identity_mismatch')
}
async function sourceExists(pkg:Package){
  if(!pkg.sourcePostId||!pkg.sourceSlug||!pkg.sourceUrl) return false
  const expected='https://www.eyagencia.com.br/blog/'+encodeURIComponent(pkg.sourceSlug)
  if(pkg.sourceUrl!==expected)return false
  const post=await writeClient.fetch<{slug?:string;publishedAt?:string}|null>(
    '*[_type=="post" && _id==$id && defined(publishedAt) && !(_id in path("drafts.**"))][0]'+
    '{"slug":slug.current,publishedAt}',{id:pkg.sourcePostId},
  )
  return Boolean(post?.publishedAt&&post.slug===pkg.sourceSlug)
}

async function findPackage():Promise<Package|null>{
  const since=new Date(Date.now()-15*86400000).toISOString()
  const rows=await writeClient.fetch<Package[]>(
    '*[_type=="socialPackage" && defined(instagramCarouselPostId) && '+
    'defined(sourcePublishedAt) && sourcePublishedAt >= $since && '+
    'publishedAt >= $socialStart && '+
    '!(crosspostStatus in ["publishing","verification_required"]) && '+
    'coalesce(crosspostAttempts,0)<3 && '+
    '(!defined(facebookCarouselPostId) || count(instagramStoryPosts)!=4)] '+
    '| order(publishedAt desc)[0...4]'+
    '{_id,_rev,sourcePostId,sourceSlug,sourceUrl,caption,instagramCarouselPostId,'+
    'carouselMedia[]{index,imageUrl},storyMedia[]{index,imageUrl},'+
    'facebookCarouselPostId,facebookPublishStatus,instagramStoryPosts[]{_key,index,postId},'+
    'instagramStoryStatus,crosspostStatus,crosspostAttempts}',
    {since,socialStart:'2026-11-08T03:00:00.000Z'},
  )
  return rows[0]||null
}

async function facebookFeed(pkg:Package, token:string, images:string[]){
  // Publish 8 images as ONE Page feed post. Staged photos are unpublished.
  const photos:string[]=[]
  for(const url of images){
    const response=await meta('POST',PAGE_ID+'/photos',token,{
      url,published:'false',
    })
    photos.push(String(response.id))
  }
  const parameters:Record<string,string>={
    message:(pkg.caption||'').slice(0,1600)+'\n\nArtigo completo: '+pkg.sourceUrl,
  }
  photos.forEach((id,i)=>{parameters['attached_media['+i+']']=JSON.stringify({media_fbid:id})})
  // Mark BEFORE submitting feed: a timeout might still mean Facebook posted.
  await writeClient.patch(pkg._id).set({
    facebookPublishStatus:'verification_required',
    facebookStagedPhotoIds:photos,
  }).commit()
  const post=await meta('POST',PAGE_ID+'/feed',token,parameters)
  const id=String(post.id)
  await writeClient.patch(pkg._id).set({
    facebookCarouselPostId:id,facebookPublishStatus:'published',
    facebookPublishedAt:new Date().toISOString(),
  }).commit()
  return id
}

async function instagramStories(pkg:Package,token:string,images:string[]){
  const known=new Map<number,string>((pkg.instagramStoryPosts||[])
    .filter(x=>Number.isInteger(x.index)&&Boolean(x.postId))
    .map(x=>[x.index,x.postId]))
  for(let i=0;i<images.length;i++){
    if(known.has(i+1))continue
    const created=await meta('POST',IG_ID+'/media',token,{
      media_type:'STORIES',image_url:images[i],
    })
    await ready(String(created.id),token)
    // Mark BEFORE media_publish so an uncertain result is never auto-retried.
    await writeClient.patch(pkg._id).set({
      instagramStoryStatus:'verification_required',
      instagramStoryPendingIndex:i+1,
      instagramStoryContainerId:String(created.id),
    }).commit()
    const published=await meta('POST',IG_ID+'/media_publish',token,{
      creation_id:String(created.id),
    })
    const item:StoryPost={_key:'story-'+(i+1),index:i+1,postId:String(published.id)}
    await writeClient.patch(pkg._id).set({
      instagramStoryStatus:'publishing',
      instagramStoryPendingIndex:null,
    }).setIfMissing({instagramStoryPosts:[]}).append('instagramStoryPosts',[item]).commit()
    known.set(i+1,item.postId)
  }
  await writeClient.patch(pkg._id).set({
    instagramStoryStatus:'published',instagramStoriesPublishedAt:new Date().toISOString(),
  }).commit()
  return known.size
}

export async function publishMissingEyagenciaChannels():Promise<Outcome>{
  if(process.env.VERCEL_ENV!=='production'||
    process.env.EYAGENCIA_CROSSPOST_ENABLED!=='true')return {status:'disabled'}
  const keys=credentials()
  if(!keys)return {status:'eyagencia_credentials_missing'}
  if(!process.env.SANITY_API_WRITE_TOKEN)return {status:'sanity_missing'}

  const pkg=await findPackage()
  if(!pkg)return {status:'nothing_pending'}
  try{
    // Validate all references before doing any Meta write.
    const carousel=mediaCheck(pkg.carouselMedia,PHOTO_COUNT,'feed')
    const stories=mediaCheck(pkg.storyMedia,STORY_COUNT,'story')
    if(!pkg.instagramCarouselPostId||!pkg.caption||
       pkg.caption.length<60||!(await sourceExists(pkg)))
      throw new Error('source_or_caption_invalid')
    await writeClient.patch(pkg._id).ifRevisionId(pkg._rev).set({
      crosspostStatus:'publishing',
      crosspostAttempts:Number(pkg.crosspostAttempts||0)+1,
      crosspostLastAttemptAt:new Date().toISOString(),
    }).commit()

    const errs:string[]=[]
    let facebookId=pkg.facebookCarouselPostId
    let storyCount=(pkg.instagramStoryPosts||[]).length
    let facebookUncertain=false,storiesUncertain=false

    if(!facebookId&&pkg.facebookPublishStatus!=='verification_required'){
      try{
        await pageIdentity(keys.token)
        facebookId=await facebookFeed(pkg,keys.token,carousel)
      }catch(error){
        const msg=error instanceof Error?error.message:'unknown'
        facebookUncertain=msg.startsWith('meta_http_')||msg.includes('timeout')
        const fbStatus=facebookUncertain?'verification_required':'failed'
        const current=await writeClient.fetch<{facebookPublishStatus?:string}|null>(
          '*[_id==$id][0]{facebookPublishStatus}',{id:pkg._id})
        // Keep the stronger, pre-submit marker if the feed might have posted.
        await writeClient.patch(pkg._id).set({
          facebookPublishStatus:current?.facebookPublishStatus==='verification_required'
            ? 'verification_required':fbStatus,
        }).commit().catch(()=>{})
        if(current?.facebookPublishStatus==='verification_required')
          facebookUncertain=true
        errs.push('facebook_'+msg.slice(0,90))
      }
    }else if(pkg.facebookPublishStatus==='verification_required')facebookUncertain=true

    if(storyCount<STORY_COUNT&&pkg.instagramStoryStatus!=='verification_required'){
      try{
        await instagramIdentity(keys.token)
        storyCount=await instagramStories(pkg,keys.token,stories)
      }catch(error){
        const msg=error instanceof Error?error.message:'unknown'
        const current=await writeClient.fetch<{instagramStoryStatus?:string;instagramStoryPosts?:StoryPost[]}|null>(
          '*[_id==$id][0]{instagramStoryStatus,instagramStoryPosts}',{id:pkg._id})
        storyCount=current?.instagramStoryPosts?.length||storyCount
        storiesUncertain=current?.instagramStoryStatus==='verification_required'
        await writeClient.patch(pkg._id).set({
          instagramStoryStatus:storiesUncertain?'verification_required':'failed',
        }).commit().catch(()=>{})
        errs.push('stories_'+msg.slice(0,90))
      }
    }else if(pkg.instagramStoryStatus==='verification_required')storiesUncertain=true

    const completed=Boolean(facebookId)&&storyCount===STORY_COUNT
    const uncertain=facebookUncertain||storiesUncertain
    const status=uncertain?'verification_required':completed?'completed':'partial'
    const platforms=[
      'instagram',
      ...(facebookId?['facebook']:[]),
      ...(storyCount===STORY_COUNT?['instagram-stories']:[]),
    ]
    await writeClient.patch(pkg._id).set({
      crosspostStatus:status,crosspostErrors:errs,
      crosspostFinishedAt:new Date().toISOString(),
      publishedPlatforms:platforms,
    }).commit()
    console.info('[eyagencia-crosspost]',JSON.stringify({
      packageId:pkg._id,status,facebook:!!facebookId,stories:storyCount,
      failures:errs.length,
    }))
    return {status,packageId:pkg._id,facebookId,storyCount,
      reason:errs.length?errs.join(';').slice(0,160):undefined}
  }catch(error){
    const reason=error instanceof Error?error.message.slice(0,140):'unknown'
    if(/revision|conflict/i.test(reason))return {status:'claimed_elsewhere'}
    await writeClient.patch(pkg._id).set({
      crosspostStatus:'verification_required',crosspostErrors:[reason],
    }).commit().catch(()=>{})
    return {status:'verification_required',packageId:pkg._id,reason}
  }
}
