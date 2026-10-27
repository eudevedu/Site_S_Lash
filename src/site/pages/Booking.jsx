import React from 'react'
import { ArrowUpRight, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { useSettings } from '../../context/SettingsContext'
import { bookingUrl } from '../config'
export default function Booking() {
  const { settings } = useSettings()
  return <div className="lash-site"><SEO title="Agende seu momento"/><Header/><main className="lash-container inner-page"><div className="booking-layout"><span className="eyebrow">UM TEMPO SÓ SEU</span><h1>Vamos realçar<br/><em>o seu olhar?</em></h1><p>Fale com {settings.general.name} pelos canais oficiais para escolher sua técnica, consultar valores e encontrar o melhor horário.</p><div className="booking-steps"><div><span>01</span><h2>Converse</h2><p>Conte qual efeito deseja e tire suas dúvidas sobre as técnicas.</p></div><div><span>02</span><h2>Escolha</h2><p>Consulte os serviços, valores e horários disponíveis.</p></div><div><span>03</span><h2>Confirme</h2><p>Combine os detalhes diretamente com a profissional.</p></div></div><a href={bookingUrl(settings)} target="_blank" rel="noreferrer" className="lash-button">{settings.socials.whatsapp ? 'Conversar no WhatsApp' : 'Acessar canais de agendamento'} <ArrowUpRight size={18}/></a><p>O horário será confirmado diretamente pelo canal de atendimento.</p><Link to="/" className="text-link"><ArrowLeft size={16}/> Voltar ao portal</Link></div></main><Footer/></div>
}
