import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
export default function Header() {
  const { settings, navPages } = useSettings()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  useEffect(() => { setOpen(false) }, [location])
  useEffect(() => { if (!location.hash) window.scrollTo(0, 0) }, [location.pathname])
  useEffect(() => {
    if (!open) return
    const handleKey = event => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])
  const items = [{ name: 'Início', path: '/' }, { name: 'Sobre', path: '/sobre' }, { name: 'Técnicas', path: '/#tecnicas' }, { name: 'Portfólio', path: '/portfolio' }, { name: 'Journal', path: '/blog' }, ...navPages.map(p => ({ name: p.title, path: `/p/${p.slug}` }))]
  return <header className={`lash-header ${settings.nav.sticky ? 'is-sticky' : ''}`}>
    <div className="lash-container header-inner">
      <Link to="/" className="lash-brand" aria-label={`${settings.general.name} — início`}><span className="brand-monogram">{settings.general.shortName}</span><span><strong>{settings.general.name}</strong><small>{settings.general.headerSubtitle}</small></span></Link>
      <nav id="main-navigation" aria-label="Navegação principal" className={`lash-nav ${open ? 'is-open' : ''}`}>
        {items.map(item => item.path.includes('#') ? <a key={item.path} href={item.path} onClick={() => setOpen(false)}>{item.name}</a> : <Link key={item.path} to={item.path} aria-current={location.pathname === item.path ? 'page' : undefined}>{item.name}</Link>)}
      </nav>
      <div className="header-actions">{settings.nav.showContactButton && <Link className="lash-button button-small" to={settings.nav.contactButtonLink || '/agendar'}>{settings.nav.contactButtonText} <ArrowUpRight size={15} /></Link>}<button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="main-navigation">{open ? <X /> : <Menu />}</button></div>
    </div>
  </header>
}
