import test from 'node:test'
import assert from 'node:assert/strict'
import { sharePublicRead,invalidatePublicRead } from './publicReads.js'
const deferred=()=>{let resolve;const promise=new Promise(yes=>{resolve=yes});return {promise,resolve}}
test('simultaneous public reads make only one request and refetch after completion',async()=>{
 const pending=deferred();let calls=0
 const loader=()=>{calls++;return pending.promise}
 const first=sharePublicRead('test-concurrent',loader);const second=sharePublicRead('test-concurrent',loader)
 assert.equal(first,second);await Promise.resolve();assert.equal(calls,1)
 pending.resolve('current');assert.equal(await first,'current')
 await sharePublicRead('test-concurrent',()=>{calls++;return 'new'})
 assert.equal(calls,2)
})
test('failed public requests can be retried',async()=>{
 await assert.rejects(sharePublicRead('test-failure',()=>Promise.reject(new Error('offline'))),/offline/)
 assert.equal(await sharePublicRead('test-failure',()=>42),42)
})
test('a save invalidates an older request without clearing the new pending read',async()=>{
 const old=deferred();const fresh=deferred()
 const first=sharePublicRead('test-save',()=>old.promise)
 invalidatePublicRead('test-save')
 const second=sharePublicRead('test-save',()=>fresh.promise)
 old.resolve('old');await first
 assert.equal(sharePublicRead('test-save',()=>assert.fail('must share the new request')),second)
 fresh.resolve('new');assert.equal(await second,'new')
})
