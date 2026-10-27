import React, { useState, useEffect } from 'react'
import { Plus, Save, Instagram, ArrowUp, ArrowDown, Trash2, ExternalLink } from 'lucide-react'
import { useSettings } from '../../../context/SettingsContext'
import { settingsApi } from '../../../lib/api/settings'
import { logsApi } from '../../../lib/api/logs'
import { normalizeInstagramUrl, prepareInstagramSettings } from '../../../lib/instagram'
export default function InstagramPortfolioSettings() {
  const { settings,loading,refreshSettings } = useSettings()
  const [draft,setDraft] = useState(settings.portfolioInstagram)
  const [dirty,setDirty] = useState(false)
  const [saving,setSaving] = useState(false)
  const [message,setMessage] = useState(null)
  useEffect(() => { if (!dirty && !saving) setDraft(settings.portfolioInstagram) },[settings.portfolioInstagram,dirty,saving])
  function change(patch) { setDraft(current => ({...current,...patch})); setDirty(true); setMessage(null) }
  function changePost(id,patch) { change({posts:draft.posts.map(post=>post.id === id ? {...post,...patch}:post)}) }
  function move(index,delta) { const posts=[...draft.posts]; [posts[index],posts[index+delta]]=[posts[index+delta],posts[index]]; change({posts}) }
  async function save(event) {
    event.preventDefault()
    let value
    try { value = prepareInstagramSettings(draft) } catch(error) { setMessage({error:true,text:error.message}); return }
    setSaving(true); setMessage(null)
    try {
      await settingsApi.update('portfolioInstagram',value)
      await refreshSettings()
      setDraft(value); setDirty(false)
      setMessage({text:'Configurações do Instagram salvas no portfólio.'})
      logsApi.logAction('Atualizou publicações do Instagram no portfólio','settings','portfolioInstagram').catch(()=>{})
    } catch { setMessage({error:true,text:'Não foi possível salvar. Seus links continuam no editor; verifique a conexão e tente novamente.'}) }
    finally { setSaving(false) }
  }
  return <form onSubmit={save} className="studio-panel space-y-6">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4"><div><span className="studio-eyebrow">SELEÇÃO DE PUBLICAÇÕES</span><h2 className="text-xl mt-2 flex gap-2 items-center"><Instagram size={20}/>Instagram no portfólio</h2><p className="text-sm text-slate-500 mt-2">Cole os links dos posts ou reels que deseja apresentar na página Portfólio de olhares.</p></div><button className="studio-primary" disabled={saving || loading}><Save size={16}/>{saving?'Salvando…':'Salvar Instagram'}</button></div>
    {message && <div className={message.error?'studio-login-error':'studio-data-notice'} role={message.error?'alert':'status'}>{message.text}</div>}
    <fieldset disabled={saving || loading} className="space-y-6"><div className="flex flex-col md:flex-row gap-5 md:items-center"><label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={Boolean(draft.enabled)} onChange={event=>change({enabled:event.target.checked})}/>Exibir Instagram no portfólio</label><a className="studio-view-site md:ml-auto" href="/portfolio" target="_blank" rel="noreferrer">Ver portfólio<ExternalLink size={15}/></a></div>
    <label className="block text-sm">Título da seção<input className="input-field mt-2" value={draft.title || ''} onChange={event=>change({title:event.target.value})} placeholder="Olhares no Instagram"/></label>
    <p className="text-xs text-slate-500 leading-relaxed">Use publicações públicas com incorporação permitida. A seleção é manual: novos posts da conta não são importados automaticamente. Cada alteração só entra no site depois de salvar.</p>
    {!draft.posts?.length && <div className="studio-empty">Nenhum post selecionado. Adicione o primeiro link abaixo.</div>}
    <div className="space-y-4">{draft.posts?.map((post,index) => { const url = normalizeInstagramUrl(post.url); return <fieldset key={post.id} className="border border-slate-200 rounded-xl p-5 space-y-4"><legend className="px-2 text-xs text-slate-500">Publicação {index+1}</legend><div className="flex justify-between items-center gap-3"><label className="text-xs flex gap-2 items-center">Visibilidade<select aria-label={`Visibilidade da publicação ${index+1}`} className="input-field" value={post.status} onChange={event=>changePost(post.id,{status:event.target.value})}><option value="draft">Rascunho</option><option value="published">Publicado</option></select></label><div className="flex gap-2"><button type="button" className="p-2 border rounded" aria-label={`Mover publicação ${index+1} para cima`} disabled={index===0} onClick={()=>move(index,-1)}><ArrowUp size={16}/></button><button type="button" className="p-2 border rounded" aria-label={`Mover publicação ${index+1} para baixo`} disabled={index===draft.posts.length-1} onClick={()=>move(index,1)}><ArrowDown size={16}/></button><button type="button" className="p-2 text-red-600" aria-label={`Remover publicação ${index+1}`} onClick={()=>change({posts:draft.posts.filter(item=>item.id!==post.id)})}><Trash2 size={16}/></button></div></div><label className="block text-sm">Título / técnica (opcional)<input className="input-field mt-2" value={post.title || ''} onChange={event=>changePost(post.id,{title:event.target.value})} placeholder="Ex.: Volume brasileiro"/></label><label className="block text-sm">Link do post ou reel<input type="url" required className="input-field mt-2" value={post.url || ''} onChange={event=>changePost(post.id,{url:event.target.value})} placeholder="https://www.instagram.com/p/.../" aria-invalid={Boolean(post.url && !url)}/></label>{post.url && !url && <p className="text-xs text-red-600">Use um link completo de publicação (/p/) ou reel (/reel/), não o endereço do perfil.</p>}{url && <a className="studio-view-site w-fit" href={url} target="_blank" rel="noopener noreferrer">Conferir no Instagram<ExternalLink size={14}/></a>}</fieldset>})}</div>
    <button type="button" className="studio-view-site" onClick={()=>change({posts:[...(draft.posts || []),{id:crypto.randomUUID(),title:'',url:'',status:'draft'}]})}><Plus size={17}/>Adicionar publicação</button>
    </fieldset>{dirty && <p className="text-xs text-slate-500" role="status">Você tem alterações ainda não salvas.</p>}
  </form>
}
