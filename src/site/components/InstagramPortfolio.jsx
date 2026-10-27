import React from 'react'
import { Instagram } from 'lucide-react'
import { getPublishedInstagramPosts } from '../../lib/instagram'
import InstagramPost from './InstagramPost'
export default function InstagramPortfolio({ config }) {
  const posts = getPublishedInstagramPosts(config)
  if (!posts.length) return null
  return <section className="instagram-portfolio" aria-labelledby="instagram-portfolio-title"><div className="section-heading"><div><span className="eyebrow"><Instagram size={15}/>DIRETO DO INSTAGRAM</span><h2 id="instagram-portfolio-title">{config.title || 'Olhares no Instagram'}</h2></div><p>Mais detalhes, movimentos e inspirações para o seu próximo olhar.</p></div><div className="instagram-post-grid">{posts.map(post => <InstagramPost key={post.id || post.url} url={post.url} title={post.title}/>)}</div><p className="instagram-section-note">Publicações do Instagram. Se o conteúdo não aparecer, use o link para abri-lo no Instagram.</p></section>
}
