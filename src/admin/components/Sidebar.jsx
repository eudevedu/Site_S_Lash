import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, Eye, Image, Settings, LogOut, Layers, Users, Tag, ClipboardList, User, History, Layout, Palette, X, ChevronLeft, ChevronsRight, Sparkles } from 'lucide-react'
import { preloadRoute } from '../../lib/preloadRoute'
import { useAuth } from '../../hooks/useAuth'
import { useSettings } from '../../context/SettingsContext'
export const adminNavigation = [
  { label: 'Seu estúdio', items: [
    { icon: LayoutDashboard, label: 'Visão geral', path: '/admin' },
    { icon: Sparkles, label: 'Técnicas & serviços', path: '/admin/services' },
    { icon: Eye, label: 'Portfólio de olhares', path: '/admin/projects' },
    { icon: Users, label: 'Contatos & interesses', path: '/admin/leads' },
    { icon: ClipboardList, label: 'Formulários', path: '/admin/forms' },
  ]},
  { label: 'Conteúdo do portal', items: [
    { icon: Layers, label: 'Páginas', path: '/admin/pages' },
    { icon: FileText, label: 'Beauty journal', path: '/admin/posts' },
    { icon: Tag, label: 'Categorias', path: '/admin/categories' },
    { icon: User, label: 'Autores', path: '/admin/authors' },
    { icon: Image, label: 'Biblioteca de mídia', path: '/admin/media' },
  ]},
  { label: 'Identidade & gestão', items: [
    { icon: Palette, label: 'Identidade visual', path: '/admin/design' },
    { icon: Layout, label: 'Marca & canais', path: '/admin/footer' },
    { icon: Settings, label: 'Equipe & acesso', path: '/admin/settings' },
    { icon: History, label: 'Atividade do painel', path: '/admin/logs', superOnly: true },
  ]},
]
export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const { user, profile, logout } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()
  useEffect(() => {
    if (!isOpen) return
    const close = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [isOpen, onClose])
  async function handleLogout() { await logout(); navigate('/admin/login') }
  return <>
    {isOpen && <button aria-label="Fechar navegação" className="admin-nav-backdrop lg:hidden" onClick={onClose}/>}
    <aside id="admin-navigation" aria-label="Navegação administrativa" className={`studio-sidebar ${isCollapsed ? 'is-collapsed lg:w-20' : 'w-64'} ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="studio-sidebar-brand"><span className="studio-monogram">{settings.general.shortName}</span>{!isCollapsed && <div><strong>{settings.general.name}</strong><small>LASH DESIGN · PAINEL</small></div>}</div>
      <div className="studio-sidebar-tools"><span>{!isCollapsed && 'GESTÃO DO ESTÚDIO'}</span><button onClick={onToggleCollapse} className="hidden lg:flex" aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}>{isCollapsed ? <ChevronsRight size={17}/> : <ChevronLeft size={17}/>}</button><button onClick={onClose} className="lg:hidden" aria-label="Fechar menu"><X size={18}/></button></div>
      <nav className="studio-sidebar-nav">{adminNavigation.map(group => <div key={group.label} className="studio-nav-group">{!isCollapsed && <p>{group.label}</p>}{group.items.filter(item => !item.superOnly || profile?.role === 'superadmin').map(({ icon:Icon, label, path }) => <NavLink key={path} to={path} onPointerEnter={() => preloadRoute(path)} onFocus={() => preloadRoute(path)} end={path === '/admin'} title={isCollapsed ? label : undefined} onClick={onClose} className={({isActive}) => `studio-nav-link ${isActive ? 'is-active' : ''}`}><Icon size={18} strokeWidth={1.5}/>{!isCollapsed && <span>{label}</span>}</NavLink>)}</div>)}</nav>
      <div className="studio-sidebar-account">{!isCollapsed && <div><span className="studio-avatar">{(profile?.full_name || user?.email || 'S')[0].toUpperCase()}</span><span><strong>{profile?.full_name || user?.email?.split('@')[0]}</strong><small>{profile?.role === 'superadmin' ? 'Gestão completa' : 'Administração'}</small></span></div>}<button onClick={handleLogout} aria-label="Sair do painel" title="Sair do painel"><LogOut size={17}/>{!isCollapsed && 'Sair do painel'}</button></div>
    </aside>
  </>
}
