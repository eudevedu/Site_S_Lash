import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { settingsApi } from '../lib/api/settings'
import { pagesApi } from '../lib/api/pages'
import { mergeSettings } from '../site/config'
import { isSupabaseConfigured } from '../lib/supabase'
const SettingsContext = createContext()
function readCache(key,fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback } catch { return fallback } }
function writeCache(key,value) { try { localStorage.setItem(key,JSON.stringify(value)) } catch { /* The live settings remain usable if storage is full. */ } }
export function SettingsProvider({ children }) {
  const [settings,setSettings] = useState(()=>mergeSettings(readCache('lash_site_settings',{})))
  const [navPages,setNavPages] = useState(()=>readCache('lash_nav_pages',[]))
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(null)
  const settingsRequest = useRef(0)
  const navRequest = useRef(0)
  const loadSettings = useCallback(async()=>{
    if (!isSupabaseConfigured) return
    const request = ++settingsRequest.current
    setLoading(true)
    try {
      const data = await settingsApi.getAll()
      if (request !== settingsRequest.current) return
      const merged=mergeSettings(data)
      setSettings(merged); writeCache('lash_site_settings',merged); setError(null)
    } catch (err) { if (request === settingsRequest.current) setError(err) }
    finally { if (request === settingsRequest.current) setLoading(false) }
  },[])
  const loadNavigation = useCallback(async()=>{
    if (!isSupabaseConfigured) return
    const request = ++navRequest.current
    try {
      const pages = await pagesApi.getNavigation()
      if (request !== navRequest.current) return
      setNavPages(pages); writeCache('lash_nav_pages',pages)
    } catch { /* Keep the last available menu; it never blocks settings or editors. */ }
  },[])
  useEffect(()=>{
    loadSettings(); loadNavigation()
    return ()=>{ settingsRequest.current++; navRequest.current++ }
  },[loadSettings,loadNavigation])
  useEffect(()=>{
    for(const key of ['primary','secondary','accent']) {
      const color=settings.colors[key]
      document.documentElement.style.setProperty(`--color-${key}`,color)
      document.documentElement.style.setProperty(`--color-${key}-light`,`${color}E6`)
      document.documentElement.style.setProperty(`--color-${key}-dark`,`${color}CC`)
    }
  },[settings])
  const value=useMemo(()=>({settings,navPages,loading,error,refreshSettings:loadSettings,refreshNavigation:loadNavigation}),[settings,navPages,loading,error,loadSettings,loadNavigation])
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
export const useSettings=()=>{
  const value=useContext(SettingsContext)
  if(!value) throw new Error('useSettings must be used within a SettingsProvider')
  return value
}
