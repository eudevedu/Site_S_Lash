import React, { useState, useEffect } from 'react'
import { Save, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSettings } from '../../context/SettingsContext'
import { settingsApi } from '../../lib/api/settings'
import ImageUploader from '../components/ui/ImageUploader'
import { prepareServices } from '../../lib/services'
function editableServices(items) {
  return (items || []).map(item=>({...item,id:item.id || crypto.randomUUID(),status:item.status || 'published',featured:item.featured !== false}))
}
export default function ServicesSettings() {
  const { settings,loading,refreshSettings } = useSettings()
  const [items,setItems] = useState(()=>editableServices(settings.services))
  const [page,setPage] = useState(settings.servicesPage)
  const [dirty,setDirty] = useState(false)
  const [saving,setSaving] = useState(false)
  useEffect(()=>{ if (!dirty && !saving) {setItems(editableServices(settings.services));setPage(settings.servicesPage)} },[settings.services,settings.servicesPage,dirty,saving])
  function update(id,field,value) {setDirty(true);setItems(current=>current.map(item=>item.id===id?{...item,[field]:value}:item))}
  function updatePage(field,value) {setDirty(true);setPage(current=>({...current,[field]:value}))}
  function move(index,delta) {setDirty(true);setItems(current=>{const next=[...current];[next[index],next[index+delta]]=[next[index+delta],next[index]];return next})}
  async function save(event) {
    event.preventDefault()
    let services
    try {services=prepareServices(items)} catch(error) {toast.error(error.message);return}
    setSaving(true)
    try {await settingsApi.updateMultiple({services,servicesPage:page});await refreshSettings();setDirty(false);toast.success('Serviços atualizados no portal!')}
    catch {toast.error('Não foi possível salvar. Suas alterações continuam no editor; tente novamente.')}
    finally {setSaving(false)}
  }
  function input(item,field,label,placeholder) {
    return <label className="block text-sm text-slate-600">{label}<input className="input-field mt-2" value={item[field] || ''} placeholder={placeholder} onChange={event=>update(item.id,field,event.target.value)}/></label>
  }
  return <form onSubmit={save} className="space-y-6"><div className="studio-page-heading"><div><span className="studio-eyebrow">O MENU DE CUIDADOS DO ESTÚDIO</span><h1>Serviços da Sabrina</h1><p>Apresente os atendimentos disponíveis e escolha os destaques da página inicial.</p></div><div className="flex gap-3"><a className="studio-view-site" href="/servicos" target="_blank" rel="noreferrer">Ver serviços<ExternalLink size={15}/></a><button className="studio-primary" disabled={saving || loading}><Save size={16}/>{saving?'Salvando…':'Salvar serviços'}</button></div></div>
  <fieldset disabled={saving || loading} className="grid xl:grid-cols-[1.5fr_1fr] gap-6"><div className="space-y-6">
    {!items.length && <div className="studio-empty">Ainda não há serviços cadastrados. Adicione o primeiro atendimento abaixo.</div>}
    {items.map((item,index)=><fieldset key={item.id} className="studio-panel space-y-5"><legend className="px-2 text-xs text-slate-500">Serviço {index+1}</legend><div className="flex flex-wrap gap-3 items-center justify-between"><label className="flex gap-2 items-center text-xs">Visibilidade<select className="input-field" aria-label={`Visibilidade do serviço ${index+1}`} value={item.status} onChange={event=>update(item.id,'status',event.target.value)}><option value="published">Publicado</option><option value="draft">Rascunho</option></select></label><div className="flex gap-2"><button type="button" className="p-2 border rounded" aria-label={`Mover serviço ${index+1} para cima`} disabled={index===0} onClick={()=>move(index,-1)}><ArrowUp size={16}/></button><button type="button" className="p-2 border rounded" aria-label={`Mover serviço ${index+1} para baixo`} disabled={index===items.length-1} onClick={()=>move(index,1)}><ArrowDown size={16}/></button><button type="button" className="p-2 text-red-600" aria-label={`Remover serviço ${index+1}`} onClick={()=>{setDirty(true);setItems(current=>current.filter(service=>service.id!==item.id))}}><Trash2 size={16}/></button></div></div>
    <label className="block text-sm text-slate-600">Nome do serviço<input className="input-field mt-2" value={item.name || ''} required onChange={event=>update(item.id,'name',event.target.value)} placeholder="Nome do atendimento oferecido"/></label>
    {input(item,'tag','Chamada curta (opcional)','Ex.: Leve & natural')}
    <label className="block text-sm text-slate-600">Descrição<textarea className="input-field mt-2" rows={3} value={item.description || ''} required onChange={event=>update(item.id,'description',event.target.value)} placeholder="Explique o serviço e o efeito que a cliente pode procurar."/></label>
    <div className="grid sm:grid-cols-2 gap-4">{input(item,'price','Valor (opcional)','Ex.: Sob consulta')}{input(item,'duration','Duração (opcional)','Informe a duração do atendimento')}</div>
    <label className="block text-sm text-slate-600">Detalhes adicionais (opcional)<textarea className="input-field mt-2" rows={3} value={item.details || ''} onChange={event=>update(item.id,'details',event.target.value)} placeholder="Inclua orientações ou detalhes que ajudem a escolher o serviço."/></label>
    <ImageUploader label="Foto do serviço (opcional)" value={item.image_url || ''} onChange={url=>update(item.id,'image_url',url)}/>
    <label className="flex gap-3 items-center text-sm text-slate-600"><input type="checkbox" checked={item.featured !== false} onChange={event=>update(item.id,'featured',event.target.checked)}/>Destacar na página inicial</label>
    </fieldset>)}
    <button type="button" className="studio-view-site" onClick={()=>{setDirty(true);setItems(current=>[...current,{id:crypto.randomUUID(),name:'',tag:'',description:'',price:'',duration:'',details:'',image_url:'',status:'draft',featured:true}])}}><Plus size={17}/>Adicionar serviço</button>
  </div><aside className="space-y-6"><section className="studio-panel space-y-5"><div className="studio-section-heading"><div><span className="studio-eyebrow">APRESENTAÇÃO DA SEÇÃO</span><h2>Textos da página</h2></div></div>{[['eyebrow','Chamada de abertura'],['title','Título principal'],['sectionTitle','Título do catálogo']].map(([field,label])=><label key={field} className="block text-sm text-slate-600">{label}<input className="input-field mt-2" value={page[field] || ''} required onChange={event=>updatePage(field,event.target.value)}/></label>)}{[['description','Descrição de abertura'],['note','Observação abaixo dos serviços']].map(([field,label])=><label key={field} className="block text-sm text-slate-600">{label}<textarea rows={3} className="input-field mt-2" value={page[field] || ''} onChange={event=>updatePage(field,event.target.value)}/></label>)}</section><div className="studio-data-notice">Publique apenas os serviços oferecidos. Valores, duração e foto são opcionais; campos vazios não aparecem no portal.</div><p className="text-xs text-slate-500 leading-relaxed">Os três primeiros destaques publicados aparecem na página inicial. A página Serviços apresenta todos os itens publicados, na ordem definida aqui. As mudanças só entram no portal depois de salvar.</p></aside></fieldset>
    {dirty && <p className="text-xs text-slate-500" role="status">Você tem alterações ainda não salvas.</p>}
  </form>
}
