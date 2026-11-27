import test from 'node:test'
import assert from 'node:assert/strict'
import {publishReels} from '../scripts/sophia-reels-transport.mjs'
const base={permit:true,assetUrl:'https://cdn.sanity.io/files/project/production/abc.mp4',caption:'Material aprovado',title:'Teste',aiGenerated:true,instagramId:'123',instagramToken:'fake',sleep:async()=>{},checkpoint:async()=>{}}
const response=data=>({ok:true,status:200,json:async()=>data})
test('blocks without permit, no network',async()=>{
 let calls=0
 await assert.rejects(publishReels({...base,permit:false,fetcher:async()=>{calls++}}),/not-authorized/)
 assert.equal(calls,0)
})
test('Instagram collaborator, disclosure, checkpoints and publish',async()=>{
 const calls=[],marks=[]
 const out=await publishReels({...base,collaborator:'@partner',checkpoint:async(k,v)=>marks.push([k,v]),fetcher:async(url,opts)=>{
 calls.push([url,opts])
 if(url.endsWith('/media'))return response({id:'456'})
 if(url.endsWith('/media_publish'))return response({id:'789'})
 return response({status_code:'FINISHED'})
 }})
 assert.equal(out.instagram,'789')
 assert.deepEqual(out.errors,[])
 assert.equal(calls.length,3)
 assert.equal(calls[0][1].body.get('collaborators'),'["partner"]')
 assert.equal(calls[0][1].body.get('is_ai_generated'),'true')
 assert.deepEqual(marks.map(x=>x[0]),['instagram_container','instagram_publish_started','instagram_post'])
})
test('ambiguous publish response never retried',async()=>{
 let published=0
 const out=await publishReels({...base,fetcher:async(url)=>{
 if(url.endsWith('/media'))return response({id:'456'})
 if(url.endsWith('/media_publish')){published++;throw Error('timeout')}
 return response({status_code:'FINISHED'})
 }})
 assert.equal(published,1)
 assert.equal(out.instagram,null)
 assert.deepEqual(out.errors,['instagram-verification-required'])
})
test('checkpoint failure prevents publishing and second channel',async()=>{
 let calls=0
 const out=await publishReels({...base,pageId:'333',pageToken:'fake',checkpoint:async()=>{throw Error('storage')},fetcher:async()=>{calls++;return response({id:'456'})}})
 assert.equal(calls,1)
 assert.equal(out.facebook,null)
 assert.deepEqual(out.errors,['instagram-verification-required'])
})
test('Facebook upload and publish confirmation',async()=>{
 const marks=[]
 const out=await publishReels({...base,instagramId:undefined,pageId:'333',pageToken:'fake',checkpoint:async(k,v)=>marks.push(k),fetcher:async(url,opts)=>{
 if(url.startsWith('https://rupload.facebook.com/'))return response({success:true})
 if(opts.body?.get('upload_phase')==='start')return response({video_id:'444',upload_url:'https://rupload.facebook.com/video-upload/v27.0/444'})
 if(opts.body?.get('upload_phase')==='finish')return response({success:true,post_id:'333_444'})
 return response({status:{publishing_phase:{status:'complete'},video_status:'ready'}})
 }})
 assert.equal(out.facebook,'333_444')
 assert.deepEqual(out.errors,[])
 assert.deepEqual(marks,['facebook_video','facebook_publish_started','facebook_post'])
})
