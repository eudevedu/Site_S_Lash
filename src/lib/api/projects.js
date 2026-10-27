import { supabase } from '../supabase'

export const projectsApi = {
  async getAll({ status, limit, summary = false, featuredFirst = false, excludeId } = {}) {
    let query = supabase.from('projects').select(summary ? 'id,title,slug,description,cover_image_url,status,featured,created_at' : '*')
    if (featuredFirst) query = query.order('featured', { ascending: false })
    query = query.order('created_at', { ascending: false })
    if (status) query = query.eq('status', status)
    if (excludeId) query = query.neq('id', excludeId)
    if (limit) query = query.limit(limit)
    const { data, error } = await query
    if (error) throw error
    return data || []
  },
  async getBySlug(slug) {
    const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).eq('status', 'published').single()
    if (error) throw error
    return data
  },
  async getById(id) {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },
  async create(project) {
    const { data, error } = await supabase.from('projects').insert([project]).select().single()
    if (error) throw error
    return data
  },
  async update(id, updates) {
    const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async delete(id) {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
    return true
  }
}
