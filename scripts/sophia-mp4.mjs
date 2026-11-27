import {createHash} from 'node:crypto'
export const MAX_VIDEO_BYTES=64*1024*1024
function boxes(b,start,end){
 const out=[];let cursor=start
 while(cursor<end){
  if(out.length>10000||cursor+8>end)throw Error('invalid-mp4-box')
  let size=b.readUInt32BE(cursor),header=8
  const type=b.toString('ascii',cursor+4,cursor+8)
  if(size===1){if(cursor+16>end)throw Error('invalid-size');const n=b.readBigUInt64BE(cursor+8);if(n>BigInt(end-cursor))throw Error('invalid-size');size=Number(n);header=16}
  if(size===0)size=end-cursor
  if(size<header||size>end-cursor)throw Error('invalid-size')
  out.push({type,start:cursor+header,end:cursor+size});cursor+=size
 }
 return out
}
function child(b,x){return boxes(b,x.start,x.end)}
function one(a,type){const list=a.filter(x=>x.type===type);if(list.length!==1)throw Error('missing-or-ambiguous-'+type);return list[0]}
function need(x,n){if(x.end-x.start<n)throw Error('truncated-box')}
function duration(b,x){need(x,20);const v=b[x.start];if(v!==0&&v!==1)throw Error('invalid-duration');if(v===1)need(x,32);const scale=b.readUInt32BE(x.start+(v===1?20:12));const ticks=v===1?Number(b.readBigUInt64BE(x.start+24)):b.readUInt32BE(x.start+16);if(!scale||!Number.isSafeInteger(ticks)||ticks<=0)throw Error('invalid-duration');return ticks/scale}
export function probeMp4(bytes){
 const b=Buffer.isBuffer(bytes)?bytes:Buffer.from(bytes)
 if(b.length<100||b.length>MAX_VIDEO_BYTES)throw Error('invalid-file-size')
 const root=boxes(b,0,b.length);one(root,'ftyp')
 if(!root.some(x=>x.type==='mdat'&&x.end>x.start)||root.some(x=>x.type==='moof'))throw Error('invalid-media-data')
 const moov=child(b,one(root,'moov'));if(moov.some(x=>x.type==='mvex'))throw Error('fragmented-mp4')
 const movieDuration=duration(b,one(moov,'mvhd'))
 const tracks=moov.filter(x=>x.type==='trak').map(t=>{
  const trak=child(b,t),tk=one(trak,'tkhd'),mdia=child(b,one(trak,'mdia'))
  const h=one(mdia,'hdlr');need(h,12);const kind=b.toString('ascii',h.start+8,h.start+12)
  if(kind!=='vide'&&kind!=='soun')return {kind}
  const minf=child(b,one(mdia,'minf')),stbl=child(b,one(minf,'stbl')),stsd=one(stbl,'stsd');need(stsd,8)
  if(b.readUInt32BE(stsd.start+4)!==1)throw Error('ambiguous-codec')
  const entry=one(boxes(b,stsd.start+8,stsd.end),kind==='soun'?'mp4a':boxes(b,stsd.start+8,stsd.end).find(x=>['avc1','avc3'].includes(x.type))?.type)
  const seconds=duration(b,one(mdia,'mdhd'))
  if(kind==='soun'){return {kind,seconds,codec:entry.type}}
  need(entry,28);const width=b.readUInt16BE(entry.start+24),height=b.readUInt16BE(entry.start+26)
  need(tk,84);const v=b[tk.start];if(v!==0&&v!==1)throw Error('invalid-track');if(v===1)need(tk,96)
  const matrix=tk.start+(v===1?52:40)
  if(b.readInt32BE(matrix)!==65536||b.readInt32BE(matrix+4)!==0||b.readInt32BE(matrix+12)!==0||b.readInt32BE(matrix+16)!==65536)throw Error('rotated-or-scaled-track')
  const displayW=b.readUInt32BE(matrix+36)/65536,displayH=b.readUInt32BE(matrix+40)/65536
  if(width!==displayW||height!==displayH||width<540||height<960||width>1080||height>1920||Math.abs(width/height-9/16)>0.015)throw Error('invalid-video-dimensions')
  return {kind,width,height,seconds,codec:entry.type}
 })
 const video=tracks.filter(t=>t.kind==='vide'),audio=tracks.filter(t=>t.kind==='soun')
 if(video.length!==1||audio.length!==1||movieDuration<3||movieDuration>90||Math.abs(video[0].seconds-movieDuration)>1.5||Math.abs(audio[0].seconds-movieDuration)>1.5)throw Error('invalid-video-tracks')
 return {width:video[0].width,height:video[0].height,durationSeconds:movieDuration,hasAudio:true,videoCodec:video[0].codec,audioCodec:audio[0].codec}
}
// Bound download size and verify the asset's content hash, not only its MIME.
export async function fetchReviewedMp4({assetUrl,assetId,fetcher=fetch}){
 const u=new URL(assetUrl),match=/^file-([a-f0-9]{40})-mp4$/i.exec(assetId)
 if(!match||u.origin!=='https://cdn.sanity.io'||u.username||u.password||u.search||u.hash||!/^\/files\/[a-z0-9-]+\/[a-z0-9_-]+\/[a-f0-9]{40}\.mp4$/i.test(u.pathname)||!u.pathname.endsWith('/'+match[1]+'.mp4'))throw Error('invalid-asset')
 const r=await fetcher(u.href,{redirect:'error',cache:'no-store',signal:AbortSignal.timeout(25000)})
 const size=Number(r.headers.get('content-length'))
 if(!r.ok||!Number.isSafeInteger(size)||size<100||size>MAX_VIDEO_BYTES||!/^video\/mp4(?:;|$)/i.test(r.headers.get('content-type')||'')||!r.body)throw Error('invalid-video-response')
 const reader=r.body.getReader(),chunks=[];let total=0
 try{while(true){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>size||total>MAX_VIDEO_BYTES)throw Error('video-size-exceeded');chunks.push(Buffer.from(value))}}finally{await reader.cancel().catch(()=>{})}
 if(total!==size)throw Error('incomplete-video')
 const bytes=Buffer.concat(chunks,total)
 if(createHash('sha1').update(bytes).digest('hex')!==match[1].toLowerCase())throw Error('asset-hash-mismatch')
 return {bytes,metadata:probeMp4(bytes)}
}
export async function fetchMp4ForReview(input){return (await fetchReviewedMp4(input)).metadata}

