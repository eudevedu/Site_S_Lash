import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { useSettings } from '../../context/SettingsContext'
export default function About() {
  const { settings } = useSettings()
  const { about, general } = settings
  return <div className="lash-site"><SEO title="Sobre" description={about.subtitle}/><Header/><main className="lash-container inner-page about-page"><span className="eyebrow">POR TRÁS DE CADA DETALHE</span><h1>{about.title || general.name}</h1>{about.image_url && <img src={about.image_url} alt={general.name}/>}<p className="about-quote">{about.subtitle}</p><div className="cms-content" dangerouslySetInnerHTML={{ __html: about.content || '' }}/><Link to="/agendar" className="lash-button">Agende seu momento <ArrowUpRight size={18}/></Link></main><Footer/></div>
}
