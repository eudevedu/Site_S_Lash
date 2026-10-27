import React, { useEffect, useRef, useState } from 'react'
import { Instagram, ArrowUpRight } from 'lucide-react'
import { normalizeInstagramUrl } from '../../lib/instagram'
let scriptPromise
function loadInstagramScript() {
  if (window.instgrm?.Embeds?.process) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve,reject) => {
    const script = document.createElement('script')
    script.src = 'https://www.instagram.com/embed.js'
    script.async = true
    script.id = 'lash-instagram-embeds'
    const finish = (error) => {
      clearTimeout(timeout)
      script.onload = script.onerror = null
      if (error) { script.remove(); reject(error) } else resolve()
    }
    const timeout = setTimeout(() => finish(new Error('Instagram indisponível')),15000)
    script.onload = () => finish(window.instgrm?.Embeds?.process ? null : new Error('Instagram indisponível'))
    script.onerror = () => finish(new Error('Instagram indisponível'))
    document.body.appendChild(script)
  }).catch(error => { scriptPromise = undefined; throw error })
  return scriptPromise
}
export default function InstagramPost({ url:inputUrl, title }) {
  const container = useRef(null)
  const [status,setStatus] = useState('waiting')
  const url = normalizeInstagramUrl(inputUrl)
  useEffect(() => {
    if (!url || !container.current) return
    let active = true
    const element = container.current
    function render() {
      if (!active) return
      setStatus('loading')
      const quote = document.createElement('blockquote')
      quote.className = 'instagram-media'
      quote.setAttribute('data-instgrm-permalink',url)
      quote.setAttribute('data-instgrm-version','14')
      const link = document.createElement('a')
      link.href = url
      link.textContent = 'Ver publicação no Instagram'
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      quote.appendChild(link)
      element.replaceChildren(quote)
      loadInstagramScript().then(() => {
        if (!active) return
        window.instgrm.Embeds.process()
        setStatus('loaded')
      }).catch(() => { if (active) setStatus('error') })
    }
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); render() }
    }, {rootMargin:'200px'}) : null
    if (observer) observer.observe(element)
    else render()
    return () => { active = false; observer?.disconnect(); element.replaceChildren() }
  }, [url])
  if (!url) return null
  return <article className="instagram-post-card"><div className="instagram-post-heading"><Instagram size={17}/><h3>{title || 'Um olhar no Instagram'}</h3></div><div ref={container} className="instagram-embed-slot"/>{status === 'waiting' || status === 'loading' ? <p className="instagram-post-status" role="status">{status === 'waiting' ? 'Publicação do Instagram' : 'Carregando publicação…'}</p> : status === 'error' && <p className="instagram-post-status">A publicação não pôde ser carregada aqui.</p>}<a className="text-link" href={url} target="_blank" rel="noopener noreferrer">Abrir no Instagram<ArrowUpRight size={16}/></a></article>
}
