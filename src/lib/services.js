export function getPublishedServices(services) {
  return Array.isArray(services) ? services.filter(service => service && typeof service.name === 'string' && service.name.trim() && (service.status == null || service.status === 'published')) : []
}
export function serviceBookingPath(service) {
  return `/agendar?servico=${encodeURIComponent(service.id || service.name)}`
}
export function selectedService(services, value) {
  return getPublishedServices(services).find(service => (service.id === value || service.name === value)) || null
}
export function serviceContactUrl(contactUrl, serviceName) {
  if (!serviceName) return contactUrl
  try {
    const url = new URL(contactUrl)
    if (url.protocol !== 'https:' || !['wa.me','api.whatsapp.com','web.whatsapp.com'].includes(url.hostname) || url.username || url.password) return contactUrl
    const text = `Olá! Tenho interesse no serviço ${serviceName}. Gostaria de consultar valores e horários.`
    url.searchParams.set('text',text)
    return url.toString()
  } catch { return contactUrl }
}
export function prepareServices(services) {
  return services.map((service,index) => {
    if (!service.name?.trim() || !service.description?.trim()) throw new Error(`Serviço ${index+1}: preencha o nome e a descrição.`)
    return {...service,name:service.name.trim(),description:service.description.trim(),status:service.status === 'draft' ? 'draft' : 'published',featured:service.featured !== false}
  })
}
