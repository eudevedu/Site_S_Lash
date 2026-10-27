import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Eye } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'
import SEO from './SEO'
import { useSettings } from '../../context/SettingsContext'
import { isSupabaseConfigured } from '../../lib/supabase'
import { postsApi } from '../../lib/api/posts'
import { projectsApi } from '../../lib/api/projects'
import InstagramPortfolio from './InstagramPortfolio'
import { getPublishedInstagramPosts } from '../../lib/instagram'
export default function ContentCollection({ type }) {
  const { settings } = useSettings()
  const isWork = type === 'projects'
  const config = isWork ? settings.projects : settings.blog
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(false)
  useEffect(() => {
    if (!isSupabaseConfigured) return
    let active = true
    setLoading(true)
    setError(false)
    ;(isWork ? projectsApi : postsApi).getAll({ status: 'published', summary: true }).then(data => { if (active) setItems(data || []) }).catch(() => { if (active) setError(true) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [isWork])
  return <div className="lash-site"><SEO title={config.listTitle} description={config.listDescription}/><Header/><main className="lash-container inner-page"><span className="eyebrow">{isWork ? 'ARTE EM CADA FIO' : 'BEAUTY JOURNAL'}</span><h1>{config.listTitle}</h1><p className="inner-intro">{config.listDescription}</p>{loading ? <div className="content-state" role="status">Carregando conteúdo…</div> : error ? <div className="content-state" role="alert">Não foi possível carregar o conteúdo. Tente novamente em instantes.</div> : items.length ? <div className="work-grid">{items.map(item => <Link className={isWork ? 'work-card' : 'journal-card'} to={`/${isWork ? 'projetos' : 'blog'}/${item.slug}`} key={item.id}>{item.cover_image_url ? <img src={item.cover_image_url} alt={item.title} loading="lazy"/> : isWork && <div className="work-placeholder"><Eye size={40}/></div>}<div><h3>{item.title}</h3>{isWork && <ArrowUpRight size={18}/>}</div>{!isWork && <><p>{item.excerpt}</p><span className="text-link">Ler artigo <ArrowUpRight size={16}/></span></>}</Link>)}</div> : (!isWork || !getPublishedInstagramPosts(settings.portfolioInstagram).length) && <div className="content-state"><p>{isWork ? 'Novos olhares vão aparecer por aqui. Enquanto isso, acompanhe os trabalhos nos canais oficiais.' : 'Em breve, novas leituras sobre beleza, cílios e autocuidado.'}</p><a className="text-link" href={settings.socials.bio} target="_blank" rel="noreferrer">Acompanhe as novidades <ArrowUpRight size={16}/></a></div>}{isWork && <InstagramPortfolio config={settings.portfolioInstagram}/>}</main><Footer/></div>
}
