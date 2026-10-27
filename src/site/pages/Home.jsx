import React, { useEffect, useState } from 'react'
import { ArrowUpRight, ArrowRight, Sparkles, Eye, Heart, Plus, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { useSettings } from '../../context/SettingsContext'
import { bookingUrl } from '../config'
import { postsApi } from '../../lib/api/posts'
import { projectsApi } from '../../lib/api/projects'
import { isSupabaseConfigured } from '../../lib/supabase'
import ServiceCards from '../components/ServiceCards'
import { getPublishedServices } from '../../lib/services'
import '../lash.css'

const questions = [
  ['Qual técnica combina comigo?', 'O primeiro passo é conversar sobre seu estilo e o efeito que você procura. A escolha considera seus cílios naturais e a avaliação profissional. Consulte a disponibilidade de cada técnica ao agendar.'],
  ['Como funciona o agendamento?', 'Use o botão de agendamento para acessar os canais oficiais de Sabrina Araújo. Por lá, você pode consultar disponibilidade, valores e confirmar seu atendimento.'],
  ['Como cuidar dos cílios depois do atendimento?', 'Siga as orientações individuais recebidas no atendimento e mantenha a rotina de higienização indicada pela profissional. Em caso de dúvidas, entre em contato antes de usar produtos na região.'],
  ['Preciso fazer manutenção?', 'A necessidade e o intervalo dependem da técnica e do seu ciclo natural de cílios. Combine a rotina de manutenção durante a avaliação.'],
]
export default function Home() {
  const { settings } = useSettings()
  const [posts, setPosts] = useState([])
  const [projects, setProjects] = useState([])
  const [faq, setFaq] = useState(null)
  useEffect(() => {
    if (!isSupabaseConfigured) return
    let active = true
    Promise.allSettled([postsApi.getAll({ status: 'published', limit: 3, summary: true }), projectsApi.getAll({ status: 'published', limit: 3, summary: true, featuredFirst: true })]).then(([p, pr]) => {
      if (!active) return
      if (p.status === 'fulfilled') setPosts(p.value || [])
      if (pr.status === 'fulfilled') setProjects((pr.value || []).sort((a,b) => Number(b.featured) - Number(a.featured)).slice(0,3))
    })
    return () => { active = false }
  }, [])
  const { general, hero } = settings
  const services = getPublishedServices(settings.services).filter(service => service.featured !== false).slice(0,3)
  return <div className="lash-site">
    <SEO /><Header />
    <main id="conteudo">
      <section className="lash-hero"><div className="lash-container hero-grid">
        <div className="hero-copy"><div className="eyebrow"><span /> {general.slogan}</div><h1>{hero.title}<br/><em>{hero.titleAccent}</em></h1><p>{general.description}</p><div className="hero-buttons"><Link to="/agendar" className="lash-button">{hero.ctaPrimary} <ArrowUpRight size={18}/></Link><a href={hero.ctaSecondaryUrl || '#tecnicas'} className="text-link">{hero.ctaSecondary} <ArrowRight size={17}/></a></div><div className="hero-note"><span className="note-star">✧</span><span>Mais que cílios.<br/><strong>Uma nova forma de se olhar.</strong></span></div></div>
        <div className="hero-visual"><div className="image-frame"><img src={hero.hero_image_url || '/images/beauty-editorial.jpg'} alt={hero.hero_image_url ? 'Imagem de destaque do estúdio' : 'Editorial ilustrativo de beleza e olhar'} fetchPriority="high"/><div className="image-shade"/><div className="image-caption"><span>LASH DESIGN</span><p>{hero.photoSub}</p></div>{!hero.hero_image_url && <span className="illustrative-label">Imagem ilustrativa</span>}</div><span className="vertical-caption">{general.name} · BEAUTY STUDIO</span><div className="hero-seal">UM OLHAR<br/><span>único.</span><Sparkles size={18}/></div></div>
      </div><div className="hero-bottom lash-container"><span>FEITO PARA VALORIZAR VOCÊ</span><a href="#tecnicas">Explore a beleza do seu olhar <span>↓</span></a><span>ESTÉTICA · CUIDADO · IDENTIDADE</span></div></section>
      <div className="lash-ribbon" aria-hidden="true"><span>BELEZA NOS DETALHES</span>✧<span>OLHAR COM IDENTIDADE</span>✧<span>SUA MELHOR VERSÃO</span>✧<span>LASH DESIGN</span>✧</div>
      <section className="techniques-section lash-container home-services" id="servicos"><span id="tecnicas" className="services-anchor"/><div className="section-heading"><div><span className="eyebrow">01 / SERVIÇOS DA SABRINA</span><h2>{settings.servicesPage.sectionTitle}</h2></div><Link to="/servicos" className="text-link">Conheça todos os serviços<ArrowUpRight size={18}/></Link></div>{services.length ? <ServiceCards services={services}/> : <p className="content-state">Converse com o estúdio para conhecer os serviços disponíveis.</p>}<p className="section-footnote">{settings.servicesPage.note}</p></section>
      <section className="about-strip"><div className="lash-container about-grid"><div className="about-art" aria-hidden="true"><span>sa.</span><small>A ARTE DE VALORIZAR O SEU OLHAR</small></div><div><span className="eyebrow">02 / POR TRÁS DE CADA DETALHE</span><h2>Beleza com intenção.<br/><em>Cuidado com você.</em></h2><p>{settings.about.subtitle}</p><p>Um espaço para descobrir possibilidades, encontrar inspiração e escolher como você quer se expressar. Tudo começa com o seu olhar.</p><Link to="/sobre" className="text-link">Conheça {general.name} <ArrowUpRight size={18}/></Link></div></div></section>
      <section className="lash-container portfolio-section"><div className="section-heading"><div><span className="eyebrow">03 / {settings.projects.subtitle}</span><h2>{settings.projects.title}</h2></div><Link to="/portfolio" className="text-link">Explore o portfólio <ArrowUpRight size={18}/></Link></div>{projects.length > 0 ? <div className="work-grid">{projects.map(p => <Link to={`/projetos/${p.slug}`} className="work-card" key={p.id}>{p.cover_image_url ? <img src={p.cover_image_url} alt={p.title} loading="lazy"/> : <div className="work-placeholder"><Eye size={50}/></div>}<div><h3>{p.title}</h3><ArrowUpRight size={20}/></div></Link>)}</div> : <div className="portfolio-empty"><Eye size={40} strokeWidth={1}/><div><h3>Inspiração para o seu próximo olhar.</h3><p>Acompanhe os trabalhos e as novidades nos canais oficiais.</p></div><a href={settings.socials.instagram || settings.socials.bio} target="_blank" rel="noreferrer" className="text-link">Conheça os trabalhos <ArrowUpRight size={18}/></a></div>}</section>
      {posts.length > 0 && <section className="lash-container journal-section"><div className="section-heading"><div><span className="eyebrow">BEAUTY JOURNAL</span><h2>{settings.blog.title}</h2></div><Link to="/blog" className="text-link">Todas as leituras <ArrowUpRight size={18}/></Link></div><div className="work-grid">{posts.map(post => <Link to={`/blog/${post.slug}`} className="journal-card" key={post.id}>{post.cover_image_url && <img src={post.cover_image_url} alt={post.title} loading="lazy"/>}<small>BELEZA & CUIDADO</small><h3>{post.title}</h3><p>{post.excerpt}</p><span className="text-link">Ler artigo <ArrowUpRight size={16}/></span></Link>)}</div></section>}
      <section className="faq-section lash-container"><div><span className="eyebrow">PARA VOCÊ SE SENTIR À VONTADE</span><h2>Seu olhar,<br/><em>sem dúvidas.</em></h2></div><div className="faq-list">{questions.map(([q,a],i) => <div key={q} className="faq-item"><h3><button aria-expanded={faq === i} aria-controls={`faq-${i}`} onClick={() => setFaq(faq === i ? null : i)}>{q}{faq === i ? <Minus size={18}/> : <Plus size={18}/>}</button></h3><div id={`faq-${i}`} hidden={faq !== i}><p>{a}</p></div></div>)}</div></section>
      <section className="booking-banner lash-container"><span className="eyebrow">RESERVE UM TEMPO PARA VOCÊ</span><h2>Seu próximo olhar<br/>começa <em>aqui.</em></h2><Link to="/agendar" className="lash-button">Vamos agendar? <ArrowUpRight size={18}/></Link><span className="booking-decoration" aria-hidden="true">✧</span></section>
    </main><Footer/>
  </div>
}
