import React, { useState, useEffect, Suspense } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import './admin.css'

export default function AdminLayout() {
  const { user, loading, authError, refreshProfile } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)')
    const reset = () => { if (media.matches) setIsSidebarCollapsed(false) }
    reset()
    media.addEventListener('change', reset)
    return () => media.removeEventListener('change', reset)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-patriotic-green"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (authError) return <div className="studio-admin min-h-screen flex items-center justify-center p-6"><div className="studio-panel max-w-md space-y-5" role="alert"><h1 className="text-3xl">Não foi possível carregar seu acesso</h1><p className="text-sm text-slate-500">Confira sua conexão e tente carregar o perfil novamente.</p><button className="studio-primary" onClick={refreshProfile}>Tentar novamente</button></div></div>

  const sidebarWidth = isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'

  return (
    <div className="studio-admin min-h-screen admin-bg-pattern">
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className={`transition-all duration-300 ${isMobileMenuOpen ? sidebarWidth : sidebarWidth}`}>
        <Topbar 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          isSidebarCollapsed={isSidebarCollapsed} 
        />
        <main className="p-4 md:p-8 pt-24 md:pt-28 max-w-7xl mx-auto min-h-screen">
          <Suspense fallback={<div className="studio-empty" role="status">Carregando tela…</div>}><Outlet /></Suspense>
        </main>
      </div>
    </div>
  )
}
