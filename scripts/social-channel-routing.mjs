// Pure format selection and validation, independent of provider credentials.
export function destinations(format){
 if(format==='reel'||format==='short')return ['youtube-video','tiktok-assisted']
 if(format==='video')return ['youtube-video','tiktok-assisted']
 if(format==='image'||format==='carousel')return ['gbp','youtube-post-assisted','tiktok-assisted']
 return []
}
export function gbpPayload({brand,caption,imageUrl,sourceUrl}){
 const domain=brand==='eyagencia'?'eyagencia.com.br':brand==='velo-delivery'?'velodelivery.com.br':null
 if(!domain)throw Error('unknown_brand')
 const image=new URL(imageUrl)
 if(image.protocol!=='https:'||image.hostname!=='cdn.sanity.io'||!image.pathname.startsWith('/images/')||image.username||image.password)throw Error('invalid_image')
 const summary=String(caption||'').replace(/https?:\/\/\S+/g,'').replace(/(?:^|\s)#[\p{L}\p{N}_]+/gu,' ').replace(/link no perfil\.?/gi,'').replace(/\n{3,}/g,'\n\n').trim()
 if(summary.length<20||/\+?\d[\d\s().-]{8,}\d/.test(summary))throw Error('caption_requires_review')
 let url='https://'+domain
 if(sourceUrl){try{const u=new URL(sourceUrl);if(u.protocol==='https:'&&!u.username&&!u.password&&[domain,'www.'+domain].includes(u.hostname))url=u.origin+u.pathname}catch{}}
 image.search='';image.searchParams.set('fm','jpg');image.searchParams.set('w','1080')
 return {languageCode:'pt-BR',topicType:'STANDARD',summary:summary.slice(0,1200),
 callToAction:{actionType:'LEARN_MORE',url},media:[{mediaFormat:'PHOTO',sourceUrl:image.toString()}]}
}
