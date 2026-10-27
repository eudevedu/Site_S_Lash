import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import ServiceCards from '../components/ServiceCards'
import { useSettings } from '../../context/SettingsContext'
import { getPublishedServices } from '../../lib/services'
export default function Services() {
  const { settings } = useSettings()
  const services = getPublishedServices(settings.services)
  const page = settings.servicesPage
  return <div className="lash-site services-portal"><SEO title="Serviços" description={page.description}/><Header/><main>
    <section className="services-page-hero"><div className="lash-container"><span className="eyebrow">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.description}</p><a href="#servicos" className="text-link">Encontre seu próximo cuidado<span>↓</span></a><Sparkles className="services-hero-decoration" strokeWidth={.5} aria-hidden="true"/></div></section>
    <section id="servicos" className="lash-container services-catalog"><div className="section-heading"><div><span className="eyebrow">O CUIDADO QUE COMBINA COM VOCÊ</span><h2>{page.sectionTitle}</h2></div><p>Conheça as opções e converse sobre o efeito que deseja para o seu olhar.</p></div>
    {services.length ? <ServiceCards services={services}/> : <div className="content-state"><p>Os serviços serão apresentados por aqui em breve. Converse com o estúdio para conhecer os atendimentos disponíveis.</p><Link to="/agendar" className="text-link">Falar com o estúdio<ArrowUpRight size={16}/></Link></div>}
    {page.note && <p className="services-page-note">{page.note}</p>}</section>
    <section className="services-help"><div className="lash-container"><div><span className="eyebrow">CADA OLHAR, UMA ESCOLHA</span><h2>Em dúvida sobre<br/><em>qual serviço escolher?</em></h2><p>Conte o que procura e tire suas dúvidas antes de combinar o atendimento.</p></div><Link to="/agendar" className="lash-button">Vamos conversar<ArrowUpRight size={18}/></Link></div></section>
  </main><Footer/></div>
}
