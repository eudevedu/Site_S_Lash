// Auth callbacks must finish synchronously: Supabase may still hold its auth lock.
export function watchSession(auth, onSession, onError) {
  let active = true
  let version = 0
  let timer
  const apply = session => {
    if (!active) return
    version += 1
    clearTimeout(timer)
    onSession(session?.user ?? null)
  }
  let subscription
  try {
    const bootstrapVersion = version
    subscription = auth.onAuthStateChange((_event,session) => { apply(session) }).data.subscription
    timer = setTimeout(() => {
      if (active && version === bootstrapVersion) onError(new Error('A sessão demorou para responder. Tente novamente.'))
    },12000)
    Promise.resolve(auth.getSession()).then(({data,error}) => {
      if (!active || version !== bootstrapVersion) return
      clearTimeout(timer)
      if (error) onError(error)
      else apply(data?.session)
    }).catch(error => { if (active && version === bootstrapVersion) { clearTimeout(timer); onError(error) } })
  } catch (error) { clearTimeout(timer); onError(error) }
  return () => { active = false; clearTimeout(timer); subscription?.unsubscribe() }
}
