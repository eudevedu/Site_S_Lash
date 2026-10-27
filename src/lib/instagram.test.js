import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeInstagramUrl, getPublishedInstagramPosts, prepareInstagramSettings } from './instagram.js'

test('accepts post and reel links and strips tracking parameters',()=>{
  assert.equal(normalizeInstagramUrl(' https://instagram.com/p/ABC_123-/?igsh=tracking#fragment '),'https://www.instagram.com/p/ABC_123-/')
  assert.equal(normalizeInstagramUrl('https://www.instagram.com/reel/ABC123/'),'https://www.instagram.com/reel/ABC123/')
})
test('rejects executable URLs, profiles, stories and lookalike hosts',()=>{
  for(const input of ['javascript:alert(1)','http://instagram.com/p/abc/','https://instagram.com.evil.test/p/abc/','https://evil.test/instagram.com/p/abc/','https://instagram.com/user/','https://instagram.com/stories/user/1/','https://user:password@instagram.com/p/abc/','https://instagram.com:8443/p/abc/','https://instagram.com/p/abc/embed/','<iframe src="https://instagram.com/p/abc/"></iframe>']) assert.equal(normalizeInstagramUrl(input),null,input)
})
test('disabled sections, drafts, malformed posts and duplicates never appear publicly',()=>{
  const config={enabled:true,posts:[{id:'1',url:'https://instagram.com/p/abc/',status:'published'},{id:'2',url:'https://instagram.com/reel/def/',status:'draft'},null,{id:'3',url:'https://instagram.com/p/abc/?igsh=123',status:'published'},{id:'4',url:'https://evil.test/p/def/',status:'published'}]}
  assert.deepEqual(getPublishedInstagramPosts(config).map(p=>p.id),['1'])
  assert.deepEqual(getPublishedInstagramPosts({...config,enabled:false}),[])
})
test('saving preserves order and refuses duplicate or unsupported URLs',()=>{
  const post={id:'1',title:' Fio a fio ',url:'https://instagram.com/p/abc/?igsh=1',status:'published'}
  const result=prepareInstagramSettings({enabled:true,title:' Meu Instagram ',posts:[post,{id:'2',title:'',url:'https://instagram.com/reel/def/',status:'draft'}]})
  assert.equal(result.title,'Meu Instagram')
  assert.equal(result.posts[0].title,'Fio a fio')
  assert.deepEqual(result.posts.map(p=>p.id),['1','2'])
  assert.throws(()=>prepareInstagramSettings({posts:[post,{...post,id:'2'}]}),/já está cadastrado/)
  assert.throws(()=>prepareInstagramSettings({posts:[{...post,url:'https://instagram.com/user/'}]}),/post ou reel/)
})
