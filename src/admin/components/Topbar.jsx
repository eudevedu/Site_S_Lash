import React, { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { ArrowUpRight, Menu } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { adminNavigation } from './Sidebar'
export default function Topbar({ onMenuClick, isSidebarCollapsed }) {
  const { user, profile } = useAuth()
  const { pathname } = useLocation()
  const page = adminNavigation.flatMap(group => group.items).find(item => item.path !== '/admin' && pathname.startsWith(item.path))
  const name = profile?.full_name || user?.email?.split('@')[0] || 'Estúdio'
  useEffect(() => { document.title = `${page?.label || 'Visão geral'} | Painel do estúdio` }, [page?.label])
  return <header className={`studio-topbar ${isSidebarCollapsed ? 'lg:left-20' : 'lg:left-64'}`}><div><button onClick={onMenuClick} className="lg:hidden" aria-label="Abrir menu administrativo" aria-controls="admin-navigation"><Menu size={22}/></button><span className="studio-breadcrumb">PAINEL DO ESTÚDIO <span>/</span><strong>{page?.label || 'Visão geral'}</strong></span></div><div><Link to="/" className="studio-view-site">Ver portal <ArrowUpRight size={15}/></Link><span className="studio-topbar-user" title={name}>{name}</span><span className="studio-avatar">{name[0].toUpperCase()}</span></div></header>
}
