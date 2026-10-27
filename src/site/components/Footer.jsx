import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Instagram } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import { bookingUrl } from '../config'
export default function Footer() {
  const { settings } = useSettings()
  return <footer className="lash-footer" style={{ backgroundColor: settings.colors.footer }}><div className="lash-container">
    <div className="footer-top"><div><Link to="/" className="footer-brand">{settings.general.name}<span> LASH DESIGN</span></Link><p>{settings.general.slogan}</p></div><a className="text-link" href={bookingUrl(settings)} target="_blank" rel="noreferrer">Vamos realçar seu olhar <ArrowUpRight size={20} /></a></div>
    <div className="footer-links"><nav aria-label="Navegação do rodapé">{settings.footer.links.map((link, i) => <Link key={i} to={link.url || '/'}>{link.label}</Link>)}</nav><div>{settings.contact.address && <span>{settings.contact.address}</span>}{settings.contact.email && <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a>}{settings.contact.phone && <span>{settings.contact.phone}</span>}{settings.socials.instagram && <a href={settings.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18}/></a>}<a href={settings.socials.bio} target="_blank" rel="noreferrer">Links oficiais <ArrowUpRight size={14}/></a></div></div>
    <div className="footer-bottom"><span>{settings.footer.copyrightText || `© ${new Date().getFullYear()} ${settings.general.name}. Todos os direitos reservados.`}</span><Link to="/admin">Acesso ao painel</Link><span>BELEZA QUE TEM A SUA ESSÊNCIA.</span></div>
  </div></footer>
}
