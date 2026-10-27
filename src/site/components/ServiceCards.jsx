import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Eye, Heart, ArrowUpRight, Clock3 } from 'lucide-react'
import { serviceBookingPath } from '../../lib/services'
export default function ServiceCards({ services }) {
  return <div className="service-card-grid">{services.map((service,index) => {
    const Icon = [Eye,Sparkles,Heart][index%3]
    return <article className="service-card" key={service.id || `${service.name}-${index}`}>
      {service.image_url && <img className="service-card-photo" src={service.image_url} alt={service.name} loading="lazy" decoding="async"/>}
      <div className="service-card-body"><div className="service-card-top"><Icon size={27} strokeWidth={1.2}/><span>{String(index+1).padStart(2,'0')}</span></div>{service.tag && <span className="eyebrow">{service.tag}</span>}<h3>{service.name}</h3><p>{service.description}</p>
      {(service.duration || service.price) && <div className="service-card-meta">{service.duration && <span><Clock3 size={14}/>{service.duration}</span>}{service.price && <strong>{service.price}</strong>}</div>}
      {service.details && <details className="service-card-details"><summary>Sobre este serviço</summary><p>{service.details}</p></details>}
      <Link to={serviceBookingPath(service)} className="service-card-link" aria-label={`Consultar ${service.name}`}>Consultar atendimento<ArrowUpRight size={17}/></Link></div>
    </article>
  })}</div>
}
