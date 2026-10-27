import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { settingsApi } from '../lib/api/settings'
import { pagesApi } from '../lib/api/pages'
import { mergeSettings } from '../site/config'
import { isSupabaseConfigured } from '../lib/supabase'
const SettingsContext = createContext()
function readCache(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback } catch { return fallback }
}
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => mergeSettings(readCache('lash_site_settings', {})))
  const [navPages, setNavPages] = useState(() => readCache('lash_nav_pages', []))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const loadSettings = useCallback(async () => {
    if (!isSupabaseConfigured) return
    setLoading(true)
    try {
      const [data, pages] = await Promise.all([settingsApi.getAll(), pagesApi.getAll()])
      const merged = mergeSettings(data)
      const published = (pages || []).filter(p => p.status === 'published' && p.show_in_nav)
      setSettings(merged)
      setNavPages(published)
      localStorage.setItem('lash_site_settings', JSON.stringify(merged))
      localStorage.setItem('lash_nav_pages', JSON.stringify(published))
      setError(null)
    } catch (err) { setError(err) } finally { setLoading(false) }
  }, [])
  useEffect(() => { loadSettings() }, [loadSettings])
  useEffect(() => {
    for (const key of ['primary', 'secondary', 'accent']) {
      const color = settings.colors[key]
      document.documentElement.style.setProperty(`--color-${key}`, color)
      document.documentElement.style.setProperty(`--color-${key}-light`, `${color}E6`)
      document.documentElement.style.setProperty(`--color-${key}-dark`, `${color}CC`)
    }
  }, [settings])
  const value = useMemo(() => ({ settings, navPages, loading, error, refreshSettings: loadSettings }), [settings, navPages, loading, error, loadSettings])
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
export const useSettings = () => {
  const value = useContext(SettingsContext)
  if (!value) throw new Error('useSettings must be used within a SettingsProvider')
  return value
}
