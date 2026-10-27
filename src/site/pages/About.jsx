import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowDown, Sparkles, Heart, Eye } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { useSettings } from '../../context/SettingsContext'
import { defaultSettings } from '../config'

export function Biography({ content }) {
  if (!content?.trim()) return null
  if (/<\/?[a-z][\s\S]*>/i.test(content)) return <div className="about-biography" dangerouslySetInnerHTML={{ __html: content }}/>
  return <div className="about-biography">{content.trim().split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
}

export default function About() {
  const { settings } = useSettings()
  const { about, general } = settings
  const subtitle = about.subtitle?.trim() || defaultSettings.about.subtitle
  const content = about.content?.trim() || defaultSettings.about.content
  const principles = [
    { title: 'Nossa missão', content: about.mission, icon: Eye },
    { title: 'O que nos guia', content: about.values, icon: Heart },
    { title: 'Nosso propósito', content: about.purpose, icon: Sparkles },
  ].filter(item => item.content?.trim())
  return <div className="lash-site about-portal">
    <SEO title="Sobre" description={subtitle} image={about.image_url}/>
    <Header/>
    <main>
      <section className="about-hero"><div className="lash-container about-hero-grid">
        <div className="about-hero-copy"><span className="eyebrow">{about.eyebrow || 'POR TRÁS DE CADA OLHAR'}</span><h1>{about.title || general.name}</h1><p className="about-hero-quote">{subtitle}</p><div className="about-hero-actions"><Link to="/agendar" className="lash-button">{about.ctaButton || 'Agende seu momento'}<ArrowUpRight size={18}/></Link><a href="#essencia" className="text-link">Conheça a essência <ArrowDown size={16}/></a></div><span className="about-hero-signature">LASH DESIGN · BELEZA COM IDENTIDADE</span></div>
        <figure className="about-portrait"><div className={`about-portrait-frame ${!about.image_url ? 'is-monogram' : ''}`}>{about.image_url ? <img src={about.image_url} alt={`Apresentação de ${general.name}`} fetchPriority="high"/> : <div className="about-monogram-art" aria-hidden="true"><span>{general.shortName?.toLowerCase()}.</span><small>A ARTE DE VALORIZAR O SEU OLHAR</small></div>}</div>{(about.badgeTitle || about.badgeDescription) && <figcaption className="about-portrait-caption"><Sparkles size={22} strokeWidth={1.2}/><div>{about.badgeTitle && <strong>{about.badgeTitle}</strong>}{about.badgeDescription && <p>{about.badgeDescription}</p>}</div></figcaption>}<span className="about-portrait-label">{general.name} · LASH DESIGN</span></figure>
      </div></section>
      <section className="lash-container about-story" id="essencia"><div className="about-story-heading"><span className="eyebrow">01 / NOSSA ESSÊNCIA</span><h2>{about.storyTitle || 'Um olhar único. Uma beleza que é sua.'}</h2><span className="about-story-mark" aria-hidden="true">✧</span></div><div><Biography content={content}/><Link to="/portfolio" className="text-link">Conheça os trabalhos <ArrowUpRight size={18}/></Link></div></section>
      {principles.length > 0 && <section className="about-principles"><div className="lash-container"><div className="section-heading"><div><span className="eyebrow">02 / O QUE DÁ SENTIDO AO CUIDADO</span><h2>Mais do que um resultado.<br/><em>Uma intenção.</em></h2></div></div><div className="about-principles-grid">{principles.map(({title,content,icon:Icon},index) => <article key={title}><div><Icon size={26} strokeWidth={1.2}/><span>0{index+1}</span></div><h3>{title}</h3><p>{content}</p></article>)}</div></div></section>}
      <section className="lash-container about-invitation"><span className="eyebrow">UM TEMPO PARA VOCÊ</span><h2>{about.ctaTitle || 'Vamos descobrir o seu próximo olhar?'}</h2><p>{about.ctaDescription || 'Conte o que você procura, conheça as possibilidades e converse sobre o atendimento que combina com você.'}</p><Link to="/agendar" className="lash-button">{about.ctaButton || 'Agende seu momento'}<ArrowUpRight size={18}/></Link></section>
    </main><Footer/>
  </div>
}
