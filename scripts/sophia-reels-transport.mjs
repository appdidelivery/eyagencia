// Provider adapter: no calls unless explicitly authorized by the scheduler,
// which must first atomically reserve the editorial slot and campaign.
const GRAPH='https://graph.facebook.com/v27.0';
const numericId=(x)=>typeof x==='string'&&/^\d+(?:_\d+)?$/.test(x);
const safeId=(x)=>{if(!numericId(x))throw Error('meta-invalid-id');return x};
async function graph(fetcher,path,token,params,fields='status_code'){
 if(!/^[\d_]+\/[a-z_]+$|^[\d_]+$/.test(path))throw Error('meta-invalid-path');
 const url=new URL(GRAPH+'/'+path);
 const method=params?'POST':'GET';
 if(!params)url.searchParams.set('fields',fields);
 const response=await fetcher(url.href,{method,headers:{Authorization:'Bearer '+token,...(params?{'Content-Type':'application/x-www-form-urlencoded'}:{})},...(params?{body:new URLSearchParams(params)}:{}),redirect:'error',cache:'no-store',signal:AbortSignal.timeout(20000)});
 let data;try{data=await response.json()}catch{throw Error('meta-response-uncertain')}
 if(!response.ok||data?.error)throw Error('meta-http-'+response.status+'-code-'+(Number(data?.error?.code)||0));
 return data;
}
async function waitReady(check,accept,reject,sleep){
 for(let i=0;i<12;i++){const result=await check();if(accept(result))return result;if(reject(result))throw Error('meta-media-rejected');if(i<11)await sleep(3000)}
 throw Error('meta-processing-unconfirmed');
}
export async function publishReels({permit,assetUrl,caption,title,collaborator,instagramId,instagramToken,pageId,pageToken,aiGenerated,fetcher=fetch,checkpoint,sleep=ms=>new Promise(r=>setTimeout(r,ms))}){
 if(permit!==true||typeof checkpoint!=='function')throw Error('publication-not-authorized');
 if(aiGenerated!==true)throw Error('ai-disclosure-required');
 const u=new URL(assetUrl);
 if(u.origin!=='https://cdn.sanity.io'||u.username||u.password||u.search||u.hash||!/^\/files\/[a-z0-9-]+\/[a-z0-9_-]+\/[a-z0-9_-]+\.mp4$/i.test(u.pathname))throw Error('invalid-asset');
 if(typeof caption!=='string'||!caption.trim()||caption.length>2200)throw Error('invalid-caption');
 if(typeof title!=='string'||!title.trim()||title.length>120)throw Error('invalid-title');
 if(!instagramId&&!pageId)throw Error('no-destination');
 if(instagramId&&(!numericId(instagramId)||!instagramToken)||pageId&&(!numericId(pageId)||!pageToken))throw Error('meta-credentials-missing');
 if(collaborator&&!/^@?[a-z0-9._]{1,30}$/i.test(collaborator))throw Error('invalid-collaborator');
 const out={instagram:null,facebook:null,errors:[]};
 let persistenceFailed=false;
 const record=async(k,v)=>{try{await checkpoint(k,v)}catch{persistenceFailed=true;throw Error('checkpoint-failed')}};
 const deadline=Date.now()+140000;
 const boundedFetch=fetcher;fetcher=(url,options)=>{const remaining=deadline-Date.now();if(remaining<=0)throw Error('meta-deadline');return boundedFetch(url,{...options,signal:AbortSignal.timeout(Math.min(remaining,20000))})};
 // Never repeat a write after ambiguous response. The scheduler records the
 // attempt before the first external call and requires manual reconciliation.
 if(instagramId){
  try{
   const params={media_type:'REELS',video_url:u.href,caption,share_to_feed:'true',is_ai_generated:'true'};
   if(collaborator)params.collaborators=JSON.stringify([collaborator.replace(/^@/,'')]);
   const created=await graph(fetcher,instagramId+'/media',instagramToken,params);
   const id=safeId(created.id);await record('instagram_container',id);
   await waitReady(()=>graph(fetcher,id,instagramToken),x=>x.status_code==='FINISHED',x=>['ERROR','EXPIRED','PUBLISHED'].includes(x.status_code),sleep);
   await record('instagram_publish_started',id);
   const posted=await graph(fetcher,instagramId+'/media_publish',instagramToken,{creation_id:id});
   out.instagram=safeId(posted.id);await record('instagram_post',out.instagram);
  }catch{out.errors.push('instagram-verification-required')}
 }
 if(pageId&&!persistenceFailed){
  try{
   const start=await graph(fetcher,pageId+'/video_reels',pageToken,{upload_phase:'start'});
   const id=safeId(start.video_id);await record('facebook_video',id);
   const upload=new URL(start.upload_url);
   if(upload.origin!=='https://rupload.facebook.com'||upload.username||upload.password||upload.search||upload.hash||!/^\/video-upload\/v\d+\.\d+\/\d+$/.test(upload.pathname)||!upload.pathname.endsWith('/'+id))throw Error('invalid-upload-url');
   const response=await fetcher(upload.href,{method:'POST',headers:{Authorization:'OAuth '+pageToken,file_url:u.href},redirect:'error',cache:'no-store',signal:AbortSignal.timeout(30000)});
   const data=await response.json();
   if(!response.ok||data.success!==true)throw Error('facebook-upload-unconfirmed');
   await record('facebook_publish_started',id);
   const done=await graph(fetcher,pageId+'/video_reels',pageToken,{upload_phase:'finish',video_id:id,video_state:'PUBLISHED',description:caption,title,is_ai_generated:'true'});
   if(done.success!==true)throw Error('facebook-finish-unconfirmed');
   const status=await waitReady(()=>graph(fetcher,id,pageToken,undefined,'status'),x=>x.status?.publishing_phase?.status==='complete'&&x.status?.video_status==='ready',x=>x.status?.video_status==='error'||x.status?.publishing_phase?.status==='error',sleep);
   if(status.status?.publishing_phase?.status!=='complete')throw Error('facebook-publication-unconfirmed');
   out.facebook=numericId(done.post_id)?done.post_id:id;await record('facebook_post',out.facebook);
  }catch{out.errors.push('facebook-verification-required')}
 }
 return out;
}
