import React, { useState, useEffect } from 'react'
import { Save, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSettings } from '../../context/SettingsContext'
import { settingsApi } from '../../lib/api/settings'
export default function ServicesSettings() {
  const { settings, refreshSettings } = useSettings()
  const [items, setItems] = useState(settings.services || [])
  const [saving, setSaving] = useState(false)
  useEffect(() => { setItems(settings.services || []) }, [settings.services])
  function update(index, field, value) { setItems(items.map((item,i) => i === index ? { ...item, [field]:value } : item)) }
  async function save(event) {
    event.preventDefault()
    setSaving(true)
    try { await settingsApi.update('services', items); await refreshSettings(); toast.success('Técnicas atualizadas!') }
    catch { toast.error('Não foi possível salvar as técnicas. Verifique a conexão com o CMS.') }
    finally { setSaving(false) }
  }
  return <form onSubmit={save} className="max-w-4xl space-y-6"><div className="flex items-center justify-between gap-4"><div><h1 className="text-3xl font-bold">Técnicas & Serviços</h1><p className="text-slate-500 mt-2">Personalize as técnicas apresentadas na página inicial.</p></div><button className="btn btn-primary" disabled={saving}><Save size={18}/>{saving ? 'Salvando…' : 'Salvar'}</button></div>{items.map((item,index) => <fieldset key={index} className="bg-white border border-slate-200 p-6 rounded-xl space-y-4"><legend className="font-bold px-2">Técnica {index+1}</legend><label className="block">Nome<input className="input-field mt-1" value={item.name} required onChange={e => update(index,'name',e.target.value)}/></label><label className="block">Chamada curta<input className="input-field mt-1" value={item.tag} onChange={e => update(index,'tag',e.target.value)}/></label><label className="block">Descrição<textarea className="input-field mt-1" rows={3} value={item.description} required onChange={e => update(index,'description',e.target.value)}/></label><button type="button" className="text-red-600 flex items-center gap-2 text-sm" onClick={() => setItems(items.filter((_,i) => i !== index))}><Trash2 size={16}/>Remover técnica</button></fieldset>)}<button type="button" className="btn btn-outline" onClick={() => setItems([...items,{ name:'',tag:'',description:'' }])}><Plus size={18}/>Adicionar técnica</button><p className="text-sm text-slate-500">Publique apenas serviços oferecidos pelo estúdio. Valores e horários são combinados no canal de atendimento.</p></form>
}
