import { supabase } from '../supabase'
import { sharePublicRead, invalidatePublicRead } from '../publicReads'

export const pagesApi = {
  async getNavigation() {
    return sharePublicRead('navigation', async () => {
    const { data, error } = await supabase.from('pages')
      .select('id,title,slug').eq('status', 'published').eq('show_in_nav', true)
      .order('nav_order', { ascending: true })
    if (error) throw error
    return data || []
    })
  },
  async getAll({ summary = false } = {}) {
    const { data, error } = await supabase
      .from('pages')
      .select(summary ? 'id,title,slug,status,show_in_nav,nav_order,created_at' : '*')
      .order('nav_order', { ascending: true })
    if (error) throw error
    return data
  },
  async getById(id) {
    const { data, error } = await supabase.from('pages').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },
  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) throw error
    return data
  },
  async create(page) {
    const { data, error } = await supabase.from('pages').insert([page]).select().single()
    if (error) throw error
    invalidatePublicRead('navigation')
    return data
  },
  async update(id, updates) {
    const { data, error } = await supabase.from('pages').update(updates).eq('id', id).select().single()
    if (error) throw error
    invalidatePublicRead('navigation')
    return data
  },
  async delete(id) {
    const { error } = await supabase.from('pages').delete().eq('id', id)
    if (error) throw error
    invalidatePublicRead('navigation')
    return true
  }
}
