import {writeClient} from '../../../sanity/lib/writeClient'
import {generateFeaturedImage} from './image'

type LegacyArticle = {
  _id:string; _rev:string; title:string; excerpt?:string; seoDescription?:string
  slug?:{current?:string}; mainImage?:{generationSource?:string;alt?:string}
}
export async function repairLegacyBlogCovers(limit=1) {
  if(process.env.CONTENT_AGENT_IMAGE_ENABLED!=='true')return []
  const old=await writeClient.fetch<LegacyArticle[]>(
    '*[_type == "post" && !(_id in path("drafts.**")) && mainImage.generationSource in ["eyagencia/free-svg-v1","eyagencia/free-svg-v2","eyagencia/free-svg-v3","bfl/flux-3-image-klein"]] | order(publishedAt desc)[0...5]{_id,_rev,title,excerpt,seoDescription,slug,mainImage}',
  )
  const results:Array<{postId:string;result:string}>=[]
  for(const article of (old||[]).slice(0,Math.min(Math.max(limit,1),1))){
    try{
      const shot=await generateFeaturedImage({...article,slug:article.slug?.current})
      if(!shot.ok)throw Error(shot.error)
      const asset=await writeClient.assets.upload('image',shot.buffer,{
        filename:'eyagencia-gpt-'+String(article.slug?.current||article._id).replace(/[^a-z0-9-]/g,'').slice(0,75)+'.png',
        contentType:shot.contentType,
      })
      await writeClient.patch(article._id).ifRevisionId(article._rev).set({
        mainImage:{_type:'image',asset:{_type:'reference',_ref:asset._id},alt:article.mainImage?.alt||shot.alt,
          generationSource:shot.model,generatedAt:new Date().toISOString(),prompt:shot.prompt},
        imageStatus:'generated',
      }).commit()
      results.push({postId:article._id,result:'repaired'})
    }catch(error){
      console.error('[blog-cover-repair]',article._id,error instanceof Error?error.message:'unknown')
      results.push({postId:article._id,result:'failed'})
    }
  }
  return results
}
