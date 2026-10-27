// Accept only canonical Instagram post/reel permalinks, never arbitrary embed HTML.
export function normalizeInstagramUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'https:' || !['instagram.com','www.instagram.com','m.instagram.com'].includes(url.hostname.toLowerCase()) || url.username || url.password || url.port) return null
    const match = url.pathname.match(/^\/(p|reel)\/([A-Za-z0-9_-]+)\/?$/)
    return match ? `https://www.instagram.com/${match[1]}/${match[2]}/` : null
  } catch { return null }
}
export function getPublishedInstagramPosts(config) {
  if (!config?.enabled || !Array.isArray(config.posts)) return []
  const seen = new Set()
  return config.posts.flatMap(post => {
    if (!post || post.status !== 'published') return []
    const url = normalizeInstagramUrl(post.url)
    if (!url || seen.has(url)) return []
    seen.add(url)
    return [{ ...post, url }]
  })
}
export function prepareInstagramSettings(config) {
  const seen = new Set()
  const posts = (config.posts || []).map((post,index) => {
    const url = normalizeInstagramUrl(post.url)
    if (!url) throw new Error(`Publicação ${index+1}: cole um link HTTPS de post ou reel do Instagram.`)
    if (seen.has(url)) throw new Error(`Publicação ${index+1}: esse link já está cadastrado.`)
    seen.add(url)
    return {id:post.id,title:post.title?.trim() || '',url,status:post.status === 'published' ? 'published' : 'draft'}
  })
  return {enabled:Boolean(config.enabled), title:config.title?.trim() || 'Olhares no Instagram', posts}
}
