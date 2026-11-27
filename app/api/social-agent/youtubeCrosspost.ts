import {createHash} from 'node:crypto'
import {writeClient} from '../../../sanity/lib/writeClient'
import {refreshBinding,googleJson} from '../../lib/social-google-binding'
import {isCurrentApproval} from '../../../scripts/sophia-approval.mjs'
import {fetchReviewedMp4} from '../../../scripts/sophia-mp4.mjs'

// Initially only the existing approved Velo audiovisual workflow supplies a
// verified MP4. No synthetic slideshow, inferred video or paid render here.
type Source={_id:string;topic:string;caption:string;sophiaCampaignId:string;videoUrl:string}
type Campaign={_id:string;title:string;caption:string;video:{asset:{_ref:string}};width:number;height:number;durationSeconds:number;assetUrl:string;mimeType:string}
export async function uploadApprovedVeloYoutube(){
 if(process.env.VERCEL_ENV!=='production'||process.env.SOCIAL_YOUTUBE_UPLOAD_ENABLED!=='true')return {status:'disabled'}
 const since=process.env.SOCIAL_GOOGLE_PUBLISH_SINCE||''
 if(!Number.isFinite(Date.parse(since)))return {status:'start_date_missing'}
 const day=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())
 try{
  const key=await refreshBinding('velo-delivery','youtube')
  const mine=await googleJson('https://www.googleapis.com/youtube/v3/channels?part=id&mine=true',key.token)
  if(!/^UC[A-Za-z0-9_-]{22}$/.test(key.target)||mine.items?.length!==1||mine.items[0]?.id!==key.target||mine.nextPageToken)throw Error('channel_identity_mismatch')
  const sources=await writeClient.fetch<Source[]>(
   '*[_type=="socialPublication" && brandId in *[_type=="socialBrand" && slug.current=="velo-delivery"]._id && format=="reel" && status in ["published","partial"] && (defined(instagramPostId)||defined(facebookPostId)) && defined(sophiaCampaignId) && defined(videoUrl) && day==$day && finishedAt >= $since] | order(finishedAt desc)[0...2]{_id,topic,caption,sophiaCampaignId,videoUrl}',{day,since})
  if(sources.length!==1)return {status:'no_unique_approved_video'}
  const source=sources[0]
  const doc=await writeClient.fetch<Campaign|null>('*[_type=="sophiaVideo" && _id==$id && !(_id in path("drafts.**"))][0]{...,"assetUrl":video.asset->url,"mimeType":video.asset->mimeType}',{id:source.sophiaCampaignId})
  if(!doc||!isCurrentApproval(doc)||doc.mimeType!=='video/mp4'||doc.assetUrl!==source.videoUrl||doc.caption!==source.caption)throw Error('approval_mismatch')
  const {bytes,metadata}=await fetchReviewedMp4({assetUrl:doc.assetUrl,assetId:doc.video.asset._ref})
  if(metadata.width!==doc.width||metadata.height!==doc.height||Math.abs(metadata.durationSeconds-doc.durationSeconds)>1)throw Error('mp4_mismatch')
  const id='google-social-youtube-'+createHash('sha256').update(key.target+'|'+doc.video.asset._ref).digest('hex')
  const privacyStatus=process.env.SOCIAL_YOUTUBE_PUBLIC_ENABLED==='true'?'public':'private'
  try{await writeClient.create({_id:id,_type:'googleSocialDelivery',brand:'velo-delivery',channel:'youtube',sourceId:source._id,status:'verification_required',day,createdAt:new Date().toISOString()})}catch{return {status:'already_reserved_or_storage_unavailable'}}
  try{
   const session=await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',{
    method:'POST',headers:{Authorization:'Bearer '+key.token,'Content-Type':'application/json','X-Upload-Content-Type':'video/mp4','X-Upload-Content-Length':String(bytes.length)},
    body:JSON.stringify({snippet:{title:doc.title.slice(0,100),description:doc.caption.slice(0,4500),categoryId:'27',defaultLanguage:'pt-BR'},status:{privacyStatus,selfDeclaredMadeForKids:false,containsSyntheticMedia:true}}),
    cache:'no-store',redirect:'error',signal:AbortSignal.timeout(20000)})
   if(!session.ok)throw Error('upload_session_failed')
   const upload=new URL(session.headers.get('location')||'')
   if(upload.origin!=='https://www.googleapis.com'||upload.pathname!=='/upload/youtube/v3/videos'||upload.username||upload.password)throw Error('upload_session_invalid')
   const r=await fetch(upload,{method:'PUT',headers:{Authorization:'Bearer '+key.token,'Content-Type':'video/mp4','Content-Length':String(bytes.length)},body:new Uint8Array(bytes),cache:'no-store',redirect:'error',signal:AbortSignal.timeout(90000)})
   if(!r.ok)throw Error('upload_unconfirmed')
   const data=await r.json()
   if(typeof data.id!=='string'||!/^[A-Za-z0-9_-]{11}$/.test(data.id)||data.snippet?.channelId!==key.target)throw Error('upload_identity_unconfirmed')
   const verified=await googleJson('https://www.googleapis.com/youtube/v3/videos?part=snippet,status&id='+encodeURIComponent(data.id),key.token)
   const video=verified.items?.[0]
   if(video?.id!==data.id||video.snippet?.channelId!==key.target)throw Error('video_identity_unconfirmed')
   const status=video.status?.privacyStatus==='public'&&video.status?.uploadStatus==='processed'?'published':'submitted'
   await writeClient.patch(id).set({status,providerId:data.id,providerState:video.status?.uploadStatus||'unknown',privacyStatus:video.status?.privacyStatus||'unknown',finishedAt:new Date().toISOString()}).commit()
   return {status,privacyStatus:video.status?.privacyStatus||'unknown'}
  }catch{return {status:'verification_required'}}
 }catch{return {status:'blocked'}}
}
