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

import {approvalSnapshot,isCurrentApproval} from '../scripts/sophia-approval.mjs'
test('approval binds video, campaign, caption, collaboration, date and rights',()=>{
 const doc={video:{asset:{_ref:'file-abc123-mp4'}},title:'Campanha',clientName:'Cliente',caption:'Legenda',collaborator:'@parceiro',collaboratorVerified:true,commercialFactsVerified:true,rightsVerified:true,audioReviewed:true,aiDisclosureReviewed:true,status:'approved',scheduledDay:'2026-11-29',source:'flow'}
 doc.approvedSnapshot=approvalSnapshot(doc)
 assert.equal(isCurrentApproval(doc),true)
 for(const changed of [{caption:'Nova legenda'},{scheduledDay:'2026-12-06'},{collaborator:'@outro'},{video:{asset:{_ref:'file-def456-mp4'}}},{rightsVerified:false},{collaboratorVerified:false}]){
 assert.equal(isCurrentApproval({...doc,...changed}),false)
 }
})

import {probeMp4,fetchMp4ForReview} from '../scripts/sophia-mp4.mjs'
import {createHash} from 'node:crypto'
const box=(type,...parts)=>{const data=Buffer.concat(parts);const h=Buffer.alloc(8);h.writeUInt32BE(data.length+8);h.write(type,4,'ascii');return Buffer.concat([h,data])}
const time=()=>{const b=Buffer.alloc(20);b.writeUInt32BE(1000,12);b.writeUInt32BE(32000,16);return b}
const track=(kind,codec)=>{const tk=Buffer.alloc(84);tk.writeInt32BE(65536,40);tk.writeInt32BE(65536,56);tk.writeUInt32BE(1080*65536,76);tk.writeUInt32BE(1920*65536,80);const h=Buffer.alloc(12);h.write(kind,8);const st=Buffer.alloc(8);st.writeUInt32BE(1,4);const entry=Buffer.alloc(28);entry.writeUInt16BE(1080,24);entry.writeUInt16BE(1920,26);return box('trak',box('tkhd',tk),box('mdia',box('hdlr',h),box('mdhd',time()),box('minf',box('stbl',box('stsd',st,box(codec,entry))))))}
const fixture=()=>Buffer.concat([box('ftyp',Buffer.from('isom0000')),box('moov',box('mvhd',time()),track('vide','avc1'),track('soun','mp4a')),box('mdat',Buffer.alloc(10))])
test('MP4 probe checks actual vertical metadata, H264/AAC and duration',()=>{
 const b=fixture()
 assert.deepEqual(probeMp4(b),{width:1080,height:1920,durationSeconds:32,hasAudio:true,videoCodec:'avc1',audioCodec:'mp4a'})
 assert.throws(()=>probeMp4(Buffer.alloc(200)))
 assert.throws(()=>probeMp4(b.subarray(0,-1)))
})
test('download must be same approved Sanity asset hash',async()=>{
 const b=fixture(),hash=createHash('sha1').update(b).digest('hex')
 const make=bytes=>async()=>new Response(bytes,{headers:{'content-type':'video/mp4','content-length':String(bytes.length)}})
 const input={assetUrl:'https://cdn.sanity.io/files/abc/production/'+hash+'.mp4',assetId:'file-'+hash+'-mp4',fetcher:make(b)}
 assert.equal((await fetchMp4ForReview(input)).width,1080)
 const corrupt=Buffer.from(b);corrupt[corrupt.length-1]=1
 await assert.rejects(fetchMp4ForReview({...input,fetcher:make(corrupt)}),/asset-hash-mismatch/)
 await assert.rejects(fetchMp4ForReview({...input,assetUrl:'https://example.com/'+hash+'.mp4'}),/invalid-asset/)
})
