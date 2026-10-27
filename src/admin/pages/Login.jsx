import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowUpRight, ArrowLeft, LockKeyhole, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useSettings } from '../../context/SettingsContext'
import { isSupabaseConfigured } from '../../lib/supabase'
import { logsApi } from '../../lib/api/logs'
import '../admin.css'
export default function Login() {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [showPassword,setShowPassword] = useState(false)
  const [error,setError] = useState('')
  const [loading,setLoading] = useState(false)
  const { login } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()
  useEffect(() => { document.title = `Painel do estúdio | ${settings.general.name}` }, [settings.general.name])
  async function handleSubmit(event) {
    event.preventDefault()
    if (!isSupabaseConfigured) { setError('Configure a conexão com o CMS para acessar o painel do estúdio.'); return }
    setLoading(true); setError('')
    try {
      const {error:authError} = await login(email,password)
      if (authError) throw authError
      logsApi.logAction('Acessou o painel do estúdio','user',null).catch(() => {})
      navigate('/admin',{replace:true})
    } catch { setError('Não foi possível entrar. Confira seu e-mail, sua senha e a conexão.') }
    finally { setLoading(false) }
  }
  return <div className="studio-admin studio-login"><section className="studio-login-brand"><Link to="/" className="studio-login-logo"><span className="studio-monogram">{settings.general.shortName}</span><span>{settings.general.name}<small>LASH DESIGN</small></span></Link><div><span className="studio-eyebrow">POR TRÁS DE CADA DETALHE</span><h1>O cuidado começa<br/><em>nos bastidores.</em></h1><p>Um espaço para cuidar da sua marca, compartilhar seus trabalhos e inspirar novos olhares.</p></div><span className="studio-login-signature">BELEZA · CUIDADO · IDENTIDADE</span><span className="studio-login-art" aria-hidden="true">✧</span></section><main className="studio-login-form"><Link to="/" className="studio-back-link"><ArrowLeft size={16}/>Voltar ao portal</Link><div><span className="studio-login-icon"><LockKeyhole size={23} strokeWidth={1.5}/></span><span className="studio-eyebrow">PAINEL DO ESTÚDIO</span><h2>Bem-vinda ao<br/>seu espaço.</h2><p>Entre para gerenciar o portal de {settings.general.name}.</p>{!isSupabaseConfigured && <div className="studio-data-notice"><AlertCircle size={18}/><span>A conexão com o CMS ainda não foi configurada neste ambiente.</span></div>}{error && <div role="alert" className="studio-login-error"><AlertCircle size={18}/>{error}</div>}<form onSubmit={handleSubmit}><label htmlFor="admin-email">E-mail de acesso</label><input id="admin-email" type="email" autoComplete="username" placeholder="seu@email.com" required value={email} onChange={e=>setEmail(e.target.value)}/><label htmlFor="admin-password">Senha</label><div className="studio-password-field"><input id="admin-password" type={showPassword?'text':'password'} autoComplete="current-password" required placeholder="Sua senha de acesso" value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword?'Ocultar senha':'Mostrar senha'} aria-pressed={showPassword}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div><button className="studio-primary" disabled={loading}>{loading?'Entrando…':'Entrar no estúdio'}<ArrowUpRight size={18}/></button></form><small>Acesso exclusivo à equipe autorizada.</small></div><span className="studio-login-footer">{settings.general.name} · Gestão do portal</span></main></div>
}
