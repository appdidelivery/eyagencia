export type BlogImage = {
  title: string
  slug?: string
  imageUrl?: string | null
  imageSource?: string | null
}
export function blogCoverUrl(post: BlogImage): string | undefined {
  if ((post.imageSource === 'eyagencia/free-svg-v1' || post.imageSource === 'eyagencia/free-svg-v2')) {
    const params = new URLSearchParams({
      title: post.title,
      slug: post.slug || post.title,
    })
    return '/api/blog-cover?' + params.toString() + '&v=3'
  }
  return post.imageUrl || undefined
}
