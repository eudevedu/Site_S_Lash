import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, FileText, Users, Sparkles, ArrowUpRight, Plus, RefreshCw, AlertCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useSettings } from '../../context/SettingsContext'
const shortcuts = [
  { to:'/admin/services', icon:Sparkles, title:'Seu menu de técnicas', description:'Apresente os serviços e efeitos disponíveis.' },
  { to:'/admin/projects/new', icon:Eye, title:'Um novo olhar', description:'Adicione um trabalho ao portfólio.' },
  { to:'/admin/posts/new', icon:FileText, title:'Uma nova leitura', description:'Compartilhe cuidados no beauty journal.' },
  { to:'/admin/pages/home', icon:Plus, title:'A primeira impressão', description:'Atualize a foto e os destaques do portal.' },
]
export default function Dashboard() {
  const { settings } = useSettings()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    if (!isSupabaseConfigured) { setError('Conecte o Supabase para carregar os dados do estúdio.'); return }
    let active = true
    setLoading(true)
    setError('')
    async function load() {
      try {
        const results = await Promise.all([
          supabase.from('posts').select('id',{count:'exact',head:true}).eq('status','published'),
          supabase.from('projects').select('id',{count:'exact',head:true}).eq('status','published'),
          supabase.from('leads').select('id',{count:'exact',head:true}),
          supabase.from('leads').select('id,name,email,phone,created_at,status').order('created_at',{ascending:false}).limit(4),
        ])
        const failed = results.find(result => result.error)
        if (failed) throw failed.error
        if (active) { setStats({posts:results[0].count,projects:results[1].count,leads:results[2].count}); setRecent(results[3].data || []) }
      } catch { if (active) setError('Não foi possível carregar os dados do estúdio. Verifique a conexão e tente novamente.') }
      finally { if (active) setLoading(false) }
    }
    load()
    return () => { active = false }
  }, [attempt])
  const metrics = [{label:'Técnicas no portal',value:settings.services?.length || 0,icon:Sparkles,to:'/admin/services'}, {label:'Olhares publicados',value:stats?.projects,icon:Eye,to:'/admin/projects'}, {label:'Artigos publicados',value:stats?.posts,icon:FileText,to:'/admin/posts'}, {label:'Contatos recebidos',value:stats?.leads,icon:Users,to:'/admin/leads'}]
  return <div className="studio-dashboard"><div className="studio-page-heading"><div><span className="studio-eyebrow">SEU ESTÚDIO, EM CADA DETALHE</span><h1>Um olhar para o seu negócio.</h1><p>Cuide da sua presença online, dos seus trabalhos e de quem quer conhecer seu atendimento.</p></div><Link to="/admin/projects/new" className="studio-primary"><Plus size={17}/>Novo trabalho</Link></div>
    {error && <div className="studio-data-notice" role="alert"><AlertCircle size={18}/><span>{error}</span>{isSupabaseConfigured && <button onClick={() => setAttempt(n => n+1)} disabled={loading}><RefreshCw size={15}/>Tentar novamente</button>}</div>}
    <div className="studio-metrics">{metrics.map(({label,value,icon:Icon,to}) => <Link key={label} to={to} className="studio-metric"><div><Icon size={20} strokeWidth={1.5}/><ArrowUpRight size={15}/></div><strong>{value ?? (loading ? '…' : '—')}</strong><span>{label}</span></Link>)}</div>
    <div className="studio-dashboard-grid"><section className="studio-panel"><div className="studio-section-heading"><div><span className="studio-eyebrow">CRIE, CUIDE, INSPIRE</span><h2>Seu portal em movimento</h2></div></div><div className="studio-shortcuts">{shortcuts.map(({to,icon:Icon,title,description}) => <Link to={to} key={to}><span><Icon size={22} strokeWidth={1.5}/></span><div><h3>{title}</h3><p>{description}</p></div><ArrowUpRight size={16}/></Link>)}</div></section>
    <section className="studio-brand-card"><span className="studio-eyebrow">A ESSÊNCIA DA SUA MARCA</span><span className="studio-brand-art" aria-hidden="true">{settings.general.shortName.toLowerCase()}.</span><h2>{settings.general.name}</h2><p>Uma presença digital tão cuidadosa quanto cada detalhe do seu trabalho.</p><Link to="/admin/footer">Editar marca & canais <ArrowUpRight size={16}/></Link></section></div>
    <section className="studio-panel"><div className="studio-section-heading"><div><span className="studio-eyebrow">CONVERSAS QUE COMEÇAM AQUI</span><h2>Últimos contatos</h2></div><Link to="/admin/leads">Ver contatos <ArrowUpRight size={16}/></Link></div>{loading ? <p className="studio-empty" role="status">Carregando contatos…</p> : error ? <p className="studio-empty">Os contatos aparecerão aqui quando a conexão estiver disponível.</p> : !recent.length ? <p className="studio-empty">Ainda não há contatos recebidos. Os envios dos formulários aparecerão aqui.</p> : <div className="studio-recent-list">{recent.map(lead => <Link to="/admin/leads" key={lead.id}><span className="studio-avatar">{lead.name?.[0]?.toUpperCase() || '?'}</span><div><strong>{lead.name}</strong><span>{lead.email || lead.phone || 'Contato pelo formulário'}</span></div><time>{new Date(lead.created_at).toLocaleDateString('pt-BR')}</time><ArrowUpRight size={15}/></Link>)}</div>}<p className="studio-panel-note">Contatos de formulários são pedidos de informação. A confirmação de horários é feita pelo canal de atendimento.</p></section>
  </div>
}
