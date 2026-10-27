import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Save, 
  Layout, 
  Monitor, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  FileText,
  Smartphone,
  Eye,
  Sparkles,
  ExternalLink,
  Instagram,
  User,
  Info,
  Award
} from 'lucide-react'
import { settingsApi } from '../../../lib/api/settings'
import { logsApi } from '../../../lib/api/logs'
import { useSettings } from '../../../context/SettingsContext'
import ImageUploader from '../../components/ui/ImageUploader'
import toast from 'react-hot-toast'

export default function HomeEditor() {
  const navigate = useNavigate()
  const { settings: currentSettings, refreshSettings } = useSettings()
  const [activeTab, setActiveTab] = useState('hero')
  const [saving, setSaving] = useState(false)
  const [device, setDevice] = useState('desktop')
  
  const [formData, setFormData] = useState({
    general: { name: '', shortName: '', slogan: '', description: '' },
    contact: { email: '', phone: '', address: '' },
    socials: { facebook: '', instagram: '', twitter: '', youtube: '', whatsapp: '' },
    colors: { primary: '#181818', secondary: '#ded4c5', accent: '#8c8173' },
    hero: { title: '', titleAccent: '', ctaPrimary: '', ctaSecondary: '', hero_image_url: '', ctaSecondaryUrl: '', photoSub: '', badge1: '', badge2: '' },
    nav: { sticky: true, showContactButton: true },
    footer: { copyrightText: '', showTransparencyLink: false, links: [] },
    leadForm: { title: '', titleAccent: '', subtitle: '', buttonText: '', successTitle: '', successMessage: '', redirectUrl: '' },
    projects: { subtitle: '', title: '', titleAccent: '', listTitle: '', listDescription: '' },
    blog: { subtitle: '', title: '', titleAccent: '', listTitle: '', listDescription: '' }
  })

  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (currentSettings && !isInitialized) {
      setFormData(prev => ({
        ...prev,
        ...currentSettings,
        general: { ...prev.general, ...currentSettings.general },
        contact: { ...prev.contact, ...currentSettings.contact },
        socials: { ...prev.socials, ...currentSettings.socials },
        colors: { ...prev.colors, ...currentSettings.colors },
        hero: { ...prev.hero, ...currentSettings.hero },
        nav: { ...prev.nav, ...currentSettings.nav },
        footer: { ...prev.footer, ...currentSettings.footer },
        leadForm: { ...prev.leadForm, ...currentSettings.leadForm },
        projects: { ...prev.projects, ...currentSettings.projects },
        blog: { ...prev.blog, ...currentSettings.blog }
      }))
      setIsInitialized(true)
    }
  }, [currentSettings, isInitialized])

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    setSaving(true)
    const toastId = toast.loading('Publicando alterações na página inicial...')
    try {
      await settingsApi.updateMultiple(formData)
      toast.success('Página inicial atualizada com sucesso!', { id: toastId })
      refreshSettings()
      logsApi.logAction('Atualizou Página Inicial', 'page', 'home')
    } catch (err) {
      console.error(err)
      toast.error('Erro ao salvar alterações: ' + (err.message || 'Erro de conexão'), { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'hero', label: 'Destaque (Hero)', icon: Layout },
    { id: 'projects', label: 'Seção de Portfólio', icon: Award },
    { id: 'blog', label: 'Seção de Journal', icon: FileText }
  ]

  if (!currentSettings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-patriotic-green" size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-[1700px] mx-auto animate-slide-in px-4 md:px-6">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/pages')}
            className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Editor do Estúdio</span>
              <div className="w-1 h-1 rounded-full bg-slate-200"></div>
              <span className="text-[10px] font-black text-patriotic-green uppercase tracking-[0.3em]">Página Principal</span>
            </div>
            <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Editar Página Inicial</h1>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2.5 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Publicar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Forms (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Segmented Selector for Tabs */}
          <div className="bg-slate-100 p-1.5 rounded-[22px] flex flex-wrap items-center border border-slate-200/50 shadow-inner">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[16px] text-xs font-black uppercase tracking-wider transition-all duration-300 min-w-[120px]
                  ${activeTab === tab.id 
                    ? 'bg-white text-slate-900 shadow-md border border-slate-200/30' 
                    : 'text-slate-500 hover:text-slate-700'}
                `}
              >
                <tab.icon size={16} className={activeTab === tab.id ? 'text-patriotic-green' : ''} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content Area */}
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden text-left">
            <div className="p-8">
              <form onSubmit={handleSave} className="space-y-6">
                
                {/* HERO TAB */}
                {activeTab === 'hero' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex gap-3 text-slate-600">
                      <Sparkles size={20} className="text-patriotic-green shrink-0 mt-0.5" />
                      <div className="text-xs font-semibold leading-relaxed">
                        Defina o topo da página (Hero). Use textos impactantes e uma imagem profissional de destaque.
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Título Principal (Hero)</label>
                      <input 
                        type="text" 
                        value={formData.hero.title || ''}
                        onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-patriotic-green focus:bg-white rounded-2xl outline-none transition-all font-bold text-lg text-slate-800"
                        placeholder="Ex: Seu olhar,"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Complemento do título</label>
                      <input 
                        type="text" 
                        value={formData.hero.titleAccent || ''}
                        onChange={(e) => handleInputChange('hero', 'titleAccent', e.target.value)}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-patriotic-green focus:bg-white rounded-2xl outline-none transition-all font-bold text-lg text-slate-800"
                        placeholder="Ex: sua essência."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Texto Botão Primário</label>
                        <input 
                          type="text" 
                          value={formData.hero.ctaPrimary || ''}
                          onChange={(e) => handleInputChange('hero', 'ctaPrimary', e.target.value)}
                          className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-patriotic-green focus:bg-white rounded-2xl outline-none transition-all font-semibold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Texto Botão Secundário</label>
                        <input 
                          type="text" 
                          value={formData.hero.ctaSecondary || ''}
                          onChange={(e) => handleInputChange('hero', 'ctaSecondary', e.target.value)}
                          className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-patriotic-green focus:bg-white rounded-2xl outline-none transition-all font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Link do Botão Secundário</label>
                      <input 
                        type="url" 
                        value={formData.hero.ctaSecondaryUrl || ''}
                        onChange={(e) => handleInputChange('hero', 'ctaSecondaryUrl', e.target.value)}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-patriotic-green focus:bg-white rounded-2xl outline-none transition-all font-mono text-sm"
                        placeholder="https://instagram.com/perfil"
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-6">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <User size={16} className="text-patriotic-green" />
                        Legenda da imagem de destaque
                      </h4>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Frase sobre a imagem</label>
                        <input 
                          type="text" 
                          value={formData.hero.photoSub || ''}
                          onChange={(e) => handleInputChange('hero', 'photoSub', e.target.value)}
                          className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-patriotic-green focus:bg-white rounded-2xl outline-none transition-all font-semibold text-sm"
                          placeholder="Ex: A beleza de ser você"
                        />
                      </div>

                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <ImageUploader 
                        label="Imagem de Destaque (Hero)"
                        value={formData.hero.hero_image_url}
                        onChange={(url) => handleInputChange('hero', 'hero_image_url', url)}
                      />
                    </div>
                  </div>
                )}

                {/* PROJECTS TAB */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex gap-3 text-slate-600">
                      <Award size={20} className="text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-xs font-semibold leading-relaxed">
                        Personalize a apresentação dos trabalhos de lash design.
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800 text-sm">Na Página Inicial</h4>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Subtítulo Superior (Home)</label>
                        <input 
                          type="text" 
                          value={formData.projects.subtitle || ''}
                          onChange={(e) => handleInputChange('projects', 'subtitle', e.target.value)}
                          className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-patriotic-green focus:bg-white rounded-2xl outline-none transition-all font-semibold"
                          placeholder="Ex: Arte em cada fio"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Título da Seção (Home)</label>
                        <input 
                          type="text" 
                          value={formData.projects.title || ''}
                          onChange={(e) => handleInputChange('projects', 'title', e.target.value)}
                          className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-patriotic-green focus:bg-white rounded-2xl outline-none transition-all font-bold"
                          placeholder="Ex: Trabalho que Transforma."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Palavra de Destaque (Home)</label>
                        <input 
                          type="text" 
                          value={formData.projects.titleAccent || ''}
                          onChange={(e) => handleInputChange('projects', 'titleAccent', e.target.value)}
                          className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-patriotic-green focus:bg-white rounded-2xl outline-none transition-all font-bold"
                          placeholder="Ex: Transforma."
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-4">
                      <h4 className="font-bold text-slate-800 text-sm">Na Página de Listagem (/projetos)</h4>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Título da Página</label>
                        <input 
                          type="text" 
                          value={formData.projects.listTitle || ''}
                          onChange={(e) => handleInputChange('projects', 'listTitle', e.target.value)}
                          className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-patriotic-green focus:bg-white rounded-2xl outline-none transition-all font-bold"
                          placeholder="Ex: Nosso Trabalho"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Descrição Explicativa</label>
                        <textarea 
                          rows="3"
                          value={formData.projects.listDescription || ''}
                          onChange={(e) => handleInputChange('projects', 'listDescription', e.target.value)}
                          className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-patriotic-green focus:bg-white rounded-2xl outline-none transition-all font-medium resize-none text-sm"
                          placeholder="Conheça os trabalhos e detalhes das técnicas de lash design."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* BLOG TAB */}
                {activeTab === 'blog' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-3 text-slate-600">
                      <FileText size={20} className="text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-xs font-semibold leading-relaxed">
                        Personalize os títulos do beauty journal e dos artigos de cuidado.
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800 text-sm">Na Página Inicial</h4>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Subtítulo Superior (Home)</label>
                        <input 
                          type="text" 
                          value={formData.blog.subtitle || ''}
                          onChange={(e) => handleInputChange('blog', 'subtitle', e.target.value)}
                          className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-patriotic-green focus:bg-white rounded-2xl outline-none transition-all font-semibold"
                          placeholder="Ex: Fique por Dentro"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Título da Seção (Home)</label>
                        <input 
                          type="text" 
                          value={formData.blog.title || ''}
                          onChange={(e) => handleInputChange('blog', 'title', e.target.value)}
                          className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-patriotic-green focus:bg-white rounded-2xl outline-none transition-all font-bold"
                          placeholder="Ex: Cuidados & inspiração."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Palavra de Destaque (Home)</label>
                        <input 
                          type="text" 
                          value={formData.blog.titleAccent || ''}
                          onChange={(e) => handleInputChange('blog', 'titleAccent', e.target.value)}
                          className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-patriotic-green focus:bg-white rounded-2xl outline-none transition-all font-bold"
                          placeholder="Ex: inspiração."
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-4">
                      <h4 className="font-bold text-slate-800 text-sm">Na Página de Listagem (/blog)</h4>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Título da Página</label>
                        <input 
                          type="text" 
                          value={formData.blog.listTitle || ''}
                          onChange={(e) => handleInputChange('blog', 'listTitle', e.target.value)}
                          className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-patriotic-green focus:bg-white rounded-2xl outline-none transition-all font-bold"
                          placeholder="Ex: Cuidados & inspiração"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Descrição Explicativa</label>
                        <textarea 
                          rows="3"
                          value={formData.blog.listDescription || ''}
                          onChange={(e) => handleInputChange('blog', 'listDescription', e.target.value)}
                          className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-patriotic-green focus:bg-white rounded-2xl outline-none transition-all font-medium resize-none text-sm"
                          placeholder="Dicas, novidades e cuidados para valorizar o seu olhar."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-5">
          <div className="flex justify-between items-center"><span className="studio-eyebrow">PRÉVIA DO CONTEÚDO</span><div className="flex gap-2"><button type="button" onClick={() => setDevice('desktop')} aria-label="Prévia desktop" aria-pressed={device === 'desktop'}><Monitor size={18}/></button><button type="button" onClick={() => setDevice('mobile')} aria-label="Prévia celular" aria-pressed={device === 'mobile'}><Smartphone size={18}/></button></div></div>
          <div className={`studio-editor-preview ${device === 'mobile' ? 'is-mobile' : ''}`}>
            <span className="studio-eyebrow">{formData.general.name} · LASH DESIGN</span>
            {activeTab === 'hero' ? <><h2>{formData.hero.title}<br/><em>{formData.hero.titleAccent}</em></h2><p>{formData.general.description}</p><span className="preview-cta">{formData.hero.ctaPrimary}</span><img src={formData.hero.hero_image_url || '/images/beauty-editorial.jpg'} alt="Prévia da imagem de destaque"/><small>{formData.hero.photoSub}</small></> : <><h2>{formData[activeTab].title}</h2><p>{formData[activeTab].subtitle}</p><div className="preview-content-slot">{activeTab === 'projects' ? 'Os trabalhos publicados no portfólio aparecem nesta seção.' : 'Os artigos publicados no journal aparecem nesta seção.'}</div><h3>{formData[activeTab].listTitle}</h3><p>{formData[activeTab].listDescription}</p></>}
          </div><p className="text-xs text-slate-500 leading-relaxed">Prévia simplificada dos textos. Salve e abra o portal para conferir a composição final.</p><a href="/" target="_blank" rel="noreferrer" className="studio-view-site">Abrir portal <ExternalLink size={14}/></a>
        </aside>
      </div>
    </div>
  )
}
