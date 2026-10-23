export type BlogImage = {
  title: string
  slug?: string
  imageUrl?: string | null
  imageSource?: string | null
}
export function blogCoverUrl(post: BlogImage): string | undefined {
  if (post.imageSource === 'eyagencia/free-svg-v1') {
    const params = new URLSearchParams({
      title: post.title,
      slug: post.slug || post.title,
    })
    return '/api/blog-cover?' + params.toString()
  }
  return post.imageUrl || undefined
}
