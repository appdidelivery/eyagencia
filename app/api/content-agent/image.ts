import {writeClient} from '../../../sanity/lib/writeClient'
import {generateEditorialPhoto, PREMIUM_IMAGE_MODEL} from '../../../scripts/creative-studio.mjs'

type RecordObject = Record<string, any>
export const DEFAULT_IMAGE_MODEL = PREMIUM_IMAGE_MODEL

export async function generateFeaturedImage(article: RecordObject) {
  if (process.env.CONTENT_AGENT_IMAGE_ENABLED !== 'true') {
    return {ok: false as const, status: 'disabled', error: 'Geração automática de imagem desativada.'}
  }
  try {
    const shot = await generateEditorialPhoto({
      brandSlug:'eyagencia', topic:String(article.title || 'E-commerce'),
      concept:String(article.excerpt || article.seoDescription || article.title || '').slice(0,260),
      date:String(article.slug || article.title || '').slice(0,30), mode:'blog-cover',
    })
    return {ok:true as const, model:shot.model, prompt:shot.prompt, buffer:shot.buffer,
      contentType:'image/png', alt:'Imagem de capa do artigo '+String(article.title || 'EyAgencia')}
  } catch (error) {
    return {ok:false as const,status:'generation_failed',error:error instanceof Error?error.message:'Falha na geração GPT Image.'}
  }
}

export async function generateUploadAndAttachFeaturedImage(args: {
  postId: string
  article: RecordObject
  jobId?: string | null
}) {
  const generated = await generateFeaturedImage(args.article)
  if (!generated.ok) {
    if (args.jobId) {
      await writeClient.patch(args.jobId).set({
        imageStatus: generated.status === 'disabled' ? 'pending' : 'failed',
        imageError: generated.error,
      }).commit().catch(() => {})
    }
    await writeClient.patch(args.postId).set({
      imageStatus: generated.status === 'disabled' ? 'pending' : 'failed',
    }).commit().catch(() => {})
    return generated
  }

  const extension = 'png'

  try {
    const asset = await writeClient.assets.upload('image', generated.buffer, {
      filename: 'eyagencia-' + String(args.article?.slug || args.article?.title || 'post')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70) + '.' + extension,
      contentType: generated.contentType,
    })

    const mainImage = {
      _type: 'image',
      asset: {_type: 'reference', _ref: asset._id},
      alt: generated.alt,
      prompt: generated.prompt,
      generatedAt: new Date().toISOString(),
      generationSource: generated.model,
    }

    await writeClient.patch(args.postId).set({
      mainImage,
      imageStatus: 'generated',
    }).commit()

    if (args.jobId) {
      await writeClient.patch(args.jobId).set({
        imageGenerated: true,
        imageStatus: 'generated',
        imagePrompt: generated.prompt,
        imageAlt: generated.alt,
        imageAssetRef: asset._id,
        imageModel: generated.model,
      }).unset(['imageError']).commit().catch(() => {})
    }

    return {
      ok: true as const,
      status: 'generated',
      assetRef: asset._id,
      mainImage,
      model: generated.model,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao enviar imagem ao Sanity.'
    if (args.jobId) {
      await writeClient.patch(args.jobId).set({imageStatus: 'failed', imageError: message}).commit().catch(() => {})
    }
    return {ok: false as const, status: 'upload_failed', error: message}
  }
}
