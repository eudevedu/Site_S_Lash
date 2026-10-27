import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { watchSession } from '../lib/authSession'
export const AuthContext = createContext({})
export const AuthProvider = ({ children }) => {
  const [user,setUser] = useState(null)
  const [sessionLoading,setSessionLoading] = useState(true)
  const [sessionError,setSessionError] = useState(null)
  const [profileState,setProfileState] = useState({userId:null,data:null,error:null})
  const [profileVersion,setProfileVersion] = useState(0)
  const userId = user?.id
  useEffect(() => {
    if (!isSupabaseConfigured) { setSessionLoading(false); return }
    return watchSession(supabase.auth, nextUser => {
      setUser(nextUser); setSessionError(null); setSessionLoading(false)
    }, error => { setSessionError(error); setSessionLoading(false) })
  }, [])
  // Run API work after the auth callback has released Supabase's lock.
  // Token refresh and tab focus with the same user ID do not reload the profile.
  useEffect(() => {
    if (!userId) { setProfileState({userId:null,data:null,error:null}); return }
    let active = true
    let finished = false
    const controller = new AbortController()
    setProfileState({userId:null,data:null,error:null})
    const timer = setTimeout(() => {
      if (!active) return
      finished = true
      controller.abort()
      setProfileState({userId,data:null,error:new Error('O perfil demorou para responder. Tente novamente.')})
    },12000)
    async function loadProfile() {
      try {
        const {data,error} = await supabase.from('profiles').select('*').eq('id',userId).abortSignal(controller.signal).single()
        if (error) throw error
        if (active && !finished) setProfileState({userId,data,error:null})
      } catch (error) { if (active && !finished) setProfileState({userId,data:null,error}) }
      finally { clearTimeout(timer) }
    }
    loadProfile()
    return () => { active = false; clearTimeout(timer); controller.abort() }
  }, [userId,profileVersion])
  const refreshProfile = useCallback(() => setProfileVersion(value=>value+1),[])
  const login = useCallback((email,password) => supabase.auth.signInWithPassword({email,password}),[])
  const signUp = useCallback((email,password,metadata={}) => supabase.auth.signUp({email,password,options:{data:metadata}}),[])
  const logout = useCallback(() => supabase.auth.signOut(),[])
  const profile = profileState.userId === userId ? profileState.data : null
  const loading = sessionLoading || Boolean(userId && profileState.userId !== userId)
  const authError = sessionError || (profileState.userId === userId ? profileState.error : null)
  const value = useMemo(()=>({user,profile,loading,authError,login,signUp,logout,refreshProfile}),[user,profile,loading,authError,login,signUp,logout,refreshProfile])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
