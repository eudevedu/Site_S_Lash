import test from 'node:test'
import assert from 'node:assert/strict'
import { watchSession } from './authSession.js'
function deferred() { let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no});return {promise,resolve,reject} }
function mockAuth(initial) {
  let callback
  let removed=false
  const order=[]
  return {order,emit:(event,session)=>callback(event,session),get removed(){return removed},
    onAuthStateChange(handler){order.push('subscribe');callback=handler;return {data:{subscription:{unsubscribe(){removed=true}}}}},
    getSession(){order.push('bootstrap');return initial.promise}}
}
test('session callback returns synchronously and subscribes before bootstrap',async t=>{
 const initial=deferred(); const auth=mockAuth(initial); const seen=[]
 const stop=watchSession(auth,user=>seen.push(user),()=>assert.fail('unexpected error'));t.after(stop)
 assert.deepEqual(auth.order,['subscribe','bootstrap'])
 assert.equal(auth.emit('SIGNED_IN',{user:{id:'one'}}),undefined)
 assert.deepEqual(seen,[{id:'one'}])
 initial.resolve({data:{session:null}});await initial.promise;await Promise.resolve()
 assert.deepEqual(seen,[{id:'one'}])
})
test('stale bootstrap cannot resurrect a signed-out account',async t=>{
 const initial=deferred();const auth=mockAuth(initial);const seen=[]
 const stop=watchSession(auth,user=>seen.push(user),()=>{});t.after(stop)
 auth.emit('SIGNED_IN',{user:{id:'one'}});auth.emit('SIGNED_OUT',null)
 initial.resolve({data:{session:{user:{id:'one'}}}});await initial.promise;await Promise.resolve()
 assert.deepEqual(seen,[{id:'one'},null])
})
test('unmounted session listener ignores pending results and events',async()=>{
 const initial=deferred();const auth=mockAuth(initial);const seen=[]
 const stop=watchSession(auth,user=>seen.push(user),()=>{});stop()
 initial.resolve({data:{session:{user:{id:'old'}}}});await initial.promise;await Promise.resolve()
 auth.emit('SIGNED_IN',{user:{id:'old'}})
 assert.equal(auth.removed,true);assert.deepEqual(seen,[])
})
test('bootstrap errors finish through the error handler',async t=>{
 const initial=deferred();const auth=mockAuth(initial);const errors=[]
 const stop=watchSession(auth,()=>assert.fail('no session expected'),error=>errors.push(error.message));t.after(stop)
 initial.resolve({error:new Error('offline')});await initial.promise;await Promise.resolve()
 assert.deepEqual(errors,['offline'])
})
