import {writeClient} from '../../../sanity/lib/writeClient'
import {manualVideoReview} from '../../../scripts/sophia-audiovisual.mjs'
import {isCurrentApproval} from '../../../scripts/sophia-approval.mjs'
import {publishReels} from '../../../scripts/sophia-reels-transport.mjs'
type Brand={_id:string;name:string;instagramEnabled?:boolean;facebookEnabled?:boolean}
type Keys={instagramId?:string;pageId?:string;pageToken:string}
type Campaign={_id:string;_rev:string;title:string;caption:string;collaborator?:string;scheduledDay:string;width:number;height:number;durationSeconds:number;audioReviewed:boolean;commercialFactsVerified:boolean;rightsVerified:boolean;aiDisclosureReviewed:boolean;video:{asset:{_ref:string}};assetUrl:string;mimeType:string}
type Input={day:string;weekday:number;publicationId:string;brand:Brand;keys:Keys;getPageToken:(id:string,token:string)=>Promise<string>}
// Existing Velo cron only. No extra schedules, generation or paid AI calls.
export async function runScheduledSophiaReel({day,weekday,publicationId,brand,keys,getPageToken}:Input){
 if(process.env.VERCEL_ENV!=='production'||process.env.SOPHIA_REELS_AUTOPUBLISH_ENABLED!=='true'||weekday!==0)return null
 const docs=await writeClient.fetch<Campaign[]>('*[_type=="sophiaVideo" && status=="approved" && scheduledDay==$day && source=="flow"] | order(_createdAt asc)[0...2]{...,"assetUrl":video.asset->url,"mimeType":video.asset->mimeType}',{day},{perspective:'published'})
 if(!docs.length)return null
 const result=(status:string,detail?:string)=>({brand:brand.name,status,detail})
 if(docs.length!==1)return result('blocked','Mais de uma campanha Sophia para o mesmo dia.')
 const doc=docs[0]
 if(!isCurrentApproval(doc)||doc.mimeType!=='video/mp4')return result('blocked','Aprovação desatualizada ou MP4 inválido.')
 const review=manualVideoReview({assetUrl:doc.assetUrl,projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET,width:doc.width,height:doc.height,durationSeconds:doc.durationSeconds,hasAudio:doc.audioReviewed,approved:true,commercialFactsVerified:doc.commercialFactsVerified,rightsVerified:doc.rightsVerified,aiDisclosureReviewed:doc.aiDisclosureReviewed,caption:doc.caption,scheduledDay:doc.scheduledDay,collaborator:doc.collaborator})
 if(!review.readyForManualReview)return result('blocked',review.issues.join(', '))
 const asset=doc.video.asset._ref
 const lockId='sophia-reel-asset-'+asset
 try{
  await writeClient.transaction()
   .create({_id:lockId,_type:'sophiaReelLock',campaignId:doc._id,publicationId,createdAt:new Date().toISOString()})
   .create({_id:publicationId,_type:'socialPublication',brandId:brand._id,brandName:brand.name,day,topic:doc.title,caption:doc.caption,format:'reel',status:'reserved',attempts:1,sophiaCampaignId:doc._id,videoUrl:doc.assetUrl,createdAt:new Date().toISOString()})
   .patch(doc._id,p=>p.ifRevisionId(doc._rev).set({lastReservedAt:new Date().toISOString()}))
   .commit()
 }catch{return result('blocked','Reserva não confirmada ou material já utilizado; conferir registro.')}
 try{
  await writeClient.patch(publicationId).set({status:'publishing',publishStartedAt:new Date().toISOString()}).commit()
  const pageToken=brand.facebookEnabled&&keys.pageId?await getPageToken(keys.pageId,keys.pageToken):undefined
  const out=await publishReels({permit:true,assetUrl:doc.assetUrl,title:doc.title,caption:doc.caption,collaborator:doc.collaborator,aiGenerated:true,instagramId:brand.instagramEnabled?keys.instagramId:undefined,instagramToken:keys.pageToken,pageId:brand.facebookEnabled?keys.pageId:undefined,pageToken,checkpoint:async(k:string,v:string)=>{await writeClient.patch(publicationId).set({['sophia_'+k]:v}).commit()}})
  const status=out.errors.length?(out.instagram||out.facebook?'partial':'blocked'):'published'
  await writeClient.patch(publicationId).set({status,instagramPostId:out.instagram,facebookPostId:out.facebook,errors:out.errors,finishedAt:new Date().toISOString()}).commit()
  return result(status,out.errors.join(', ')||undefined)
 }catch{
  await writeClient.patch(publicationId).set({status:'blocked',errors:['manual-reconciliation-required'],finishedAt:new Date().toISOString()}).commit().catch(()=>{})
  return result('blocked','Conferência manual necessária; nenhuma nova tentativa automática.')
 }
}
