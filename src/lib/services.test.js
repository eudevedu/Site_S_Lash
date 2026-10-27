import test from 'node:test'
import assert from 'node:assert/strict'
import { getPublishedServices,selectedService,serviceBookingPath,serviceContactUrl,prepareServices } from './services.js'
test('existing services remain visible and drafts are excluded',()=>{
 const items=[{name:'Fio a fio'},{id:'published',name:'Volume',status:'published'},{id:'draft',name:'Não publicado',status:'draft'},{name:'Arquivado',status:'archived'},null,{name:' '}]
 assert.deepEqual(getPublishedServices(items).map(s=>s.name),['Fio a fio','Volume'])
 assert.equal(selectedService(items,'draft'),null)
 assert.equal(selectedService(items,'published').name,'Volume')
})
test('booking supports current IDs and older service-name links',()=>{
 const item={id:'stable-id',name:'Cílios & cuidado'}
 assert.equal(serviceBookingPath(item),'/agendar?servico=stable-id')
 assert.equal(serviceBookingPath({name:'Cílios & cuidado'}),'/agendar?servico=C%C3%ADlios%20%26%20cuidado')
 assert.equal(selectedService([item],'Cílios & cuidado'),item)
 assert.equal(selectedService([item],'unregistered'),null)
})
test('selected service is included only in supported WhatsApp links',()=>{
 const url=new URL(serviceContactUrl('https://wa.me/5511999999999','Fio a fio & volume'))
 assert.equal(url.pathname,'/5511999999999')
 assert.match(url.searchParams.get('text'),/Fio a fio & volume/)
 for(const input of ['https://bio.link/sabrinaaraujooficial','https://wa.me.evil.test/123','https://example.com']) assert.equal(serviceContactUrl(input,'Fio a fio'),input)
})
test('saving keeps optional fields and publication choices without inventing values',()=>{
 const service={id:'one',name:' Volume ',description:' Descrição ',status:'draft',featured:false,price:'',duration:'',image_url:''}
 const [saved]=prepareServices([service])
 assert.equal(saved.name,'Volume');assert.equal(saved.status,'draft');assert.equal(saved.featured,false)
 assert.equal(saved.price,'');assert.equal(saved.duration,'');assert.equal(saved.id,'one')
 assert.throws(()=>prepareServices([{name:'',description:'texto'}]),/preencha o nome/)
})
