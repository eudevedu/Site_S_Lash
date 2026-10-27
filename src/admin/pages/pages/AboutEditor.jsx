import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Save, ArrowLeft, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react'
import { settingsApi } from '../../../lib/api/settings'
import { logsApi } from '../../../lib/api/logs'
import { useSettings } from '../../../context/SettingsContext'
import ImageUploader from '../../components/ui/ImageUploader'

const presentationFields = [
  ['eyebrow','Chamada acima do título','Ex.: Por trás de cada olhar'],
  ['title','Título da página','Ex.: Sabrina Araújo'],
  ['subtitle','Frase de apresentação','Ex.: A beleza está nos detalhes.'],
  ['storyTitle','Título da seção de apresentação','Ex.: Um olhar único. Uma beleza que é sua.'],
]
const principleFields = [['mission','Nossa missão'],['values','O que nos guia / Valores'],['purpose','Nosso propósito']]
const bookingFields = [
  ['ctaTitle','Título do convite','Ex.: Vamos descobrir o seu próximo olhar?'],
  ['ctaDescription','Descrição do convite','Converse sobre as possibilidades do atendimento.'],
  ['ctaButton','Texto do botão','Ex.: Agende seu momento'],
]
export default function AboutEditor() {
  const { settings, loading, refreshSettings } = useSettings()
  const [draft,setDraft] = useState(settings.about)
  const [dirty,setDirty] = useState(false)
  const [saving,setSaving] = useState(false)
  const [message,setMessage] = useState(null)
  useEffect(() => { if (!dirty && !saving) setDraft(settings.about) }, [settings.about,dirty,saving])
  function update(field,value) { setDirty(true); setMessage(null); setDraft(current => ({...current,[field]:value})) }
  async function save(event) {
    event.preventDefault()
    setSaving(true); setMessage(null)
    try {
      await settingsApi.update('about',{...settings.about,...draft})
      await refreshSettings()
      setDirty(false)
      setMessage({type:'success',text:'Página Sobre atualizada. Abra o portal para conferir.'})
      logsApi.logAction('Atualizou apresentação do estúdio','page','about').catch(() => {})
    } catch { setMessage({type:'error',text:'Não foi possível salvar. Suas alterações continuam no editor; verifique a conexão e tente novamente.'}) }
    finally { setSaving(false) }
  }
  function fields(items) {
    return items.map(([field,label,placeholder]) => <label key={field} className="block text-sm text-slate-600">{label}<input className="input-field mt-2" value={draft[field] || ''} placeholder={placeholder} onChange={event => update(field,event.target.value)}/></label>)
  }
  return <form className="max-w-5xl mx-auto space-y-6" onSubmit={save}>
    <div className="studio-page-heading"><div><Link to="/admin/pages" className="studio-back-link"><ArrowLeft size={15}/>Voltar às páginas</Link><h1>Sobre o estúdio</h1><p>Conte a história da sua marca e apresente o cuidado por trás de cada olhar.</p></div><div className="flex gap-3 items-center"><a href="/sobre" target="_blank" rel="noreferrer" className="studio-view-site">Ver página<ExternalLink size={15}/></a><button type="submit" className="studio-primary" disabled={saving || loading}><Save size={16}/>{saving?'Salvando…':'Salvar alterações'}</button></div></div>
    {message && <div role={message.type === 'error'?'alert':'status'} className={message.type === 'error'?'studio-login-error':'studio-data-notice'}>{message.type === 'error'?<AlertCircle size={18}/>:<CheckCircle2 size={18}/>}<span>{message.text}</span></div>}
    <fieldset disabled={saving || loading} className="grid lg:grid-cols-[1.35fr_1fr] gap-6">
      <div className="space-y-6"><section className="studio-panel space-y-5"><div className="studio-section-heading"><div><span className="studio-eyebrow">01 / PRIMEIRA IMPRESSÃO</span><h2>Apresentação</h2></div></div>{fields(presentationFields)}<label className="block text-sm text-slate-600">História / Biografia<textarea className="input-field mt-2 min-h-[260px]" value={draft.content || ''} onChange={event=>update('content',event.target.value)} placeholder="Conte sua história, seu estilo de trabalho e o que deseja transmitir a quem chega ao estúdio."/></label><p className="text-xs text-slate-500 leading-relaxed">Separe os parágrafos com uma linha em branco. Conteúdos HTML já cadastrados são preservados. Se a biografia ou a frase de apresentação ficarem vazias, o portal exibe o texto padrão de Lash Design.</p></section>
      <section className="studio-panel space-y-5"><div className="studio-section-heading"><div><span className="studio-eyebrow">02 / ESSÊNCIA DA MARCA</span><h2>O que dá sentido ao cuidado</h2></div></div>{principleFields.map(([field,label]) => <label className="block text-sm text-slate-600" key={field}>{label}<textarea rows={3} className="input-field mt-2" value={draft[field] || ''} onChange={event=>update(field,event.target.value)}/></label>)}<p className="text-xs text-slate-500">Deixe um campo vazio para ocultar esse bloco no site.</p></section></div>
      <div className="space-y-6"><section className="studio-panel space-y-5"><div className="studio-section-heading"><div><span className="studio-eyebrow">03 / IDENTIDADE</span><h2>Foto & assinatura</h2></div></div><ImageUploader label="Foto da profissional / estúdio" value={draft.image_url || ''} onChange={url=>update('image_url',url)}/><p className="text-xs text-slate-500 leading-relaxed">Prefira uma foto vertical. Sem imagem, a página apresenta o monograma da marca.</p>{fields([['badgeTitle','Título da assinatura','Ex.: Lash Design'],['badgeDescription','Frase da assinatura','Ex.: Um olhar único, como você.']])}</section><section className="studio-panel space-y-5"><div className="studio-section-heading"><div><span className="studio-eyebrow">04 / PRÓXIMO PASSO</span><h2>Convite ao atendimento</h2></div></div>{fields(bookingFields)}<p className="text-xs text-slate-500 leading-relaxed">O botão abre a página de agendamento e os canais de atendimento já configurados no portal.</p></section></div>
    </fieldset>
    {dirty && <p className="text-xs text-slate-500" role="status">Você tem alterações ainda não salvas.</p>}
  </form>
}
