import test from 'node:test'
import assert from 'node:assert/strict'
import { canManageUsers, canDeleteUser } from './permissions.js'
test('Super Admin can manage users and delete another account',()=>{
  assert.equal(canManageUsers({role:'superadmin'}),true)
  assert.equal(canDeleteUser({role:'superadmin'},'actor','target'),true)
})
test('ordinary roles and missing profiles cannot manage or delete users',()=>{
  for(const profile of [null,{}, {role:'admin'}, {role:'editor'}, {role:'authenticated'}]) {
    assert.equal(canManageUsers(profile),false)
    assert.equal(canDeleteUser(profile,'actor','target'),false)
  }
})
test('self deletion and missing account IDs are blocked',()=>{
  assert.equal(canDeleteUser({role:'superadmin'},'actor','actor'),false)
  assert.equal(canDeleteUser({role:'superadmin'},null,'target'),false)
  assert.equal(canDeleteUser({role:'superadmin'},'actor',null),false)
})
