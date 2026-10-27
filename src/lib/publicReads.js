// Share only simultaneous public reads; do not cache permissions or private records.
const pending = new Map()
export function sharePublicRead(key,loader) {
  if (pending.has(key)) return pending.get(key)
  const request = Promise.resolve().then(loader)
  pending.set(key,request)
  const clear = () => { if (pending.get(key) === request) pending.delete(key) }
  request.then(clear,clear)
  return request
}
export function invalidatePublicRead(key) { pending.delete(key) }
