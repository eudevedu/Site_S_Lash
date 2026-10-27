const routes = {
  '/': () => import('../site/pages/Home'),
  '/sobre': () => import('../site/pages/About'),
  '/portfolio': () => import('../site/pages/Portfolio'),
  '/projetos': () => import('../site/pages/Portfolio'),
  '/blog': () => import('../site/pages/Blog'),
  '/agendar': () => import('../site/pages/Booking'),
  '/servicos': () => import('../site/pages/Services'),
  '/admin': () => import('../admin/pages/Dashboard'),
  '/admin/projects': () => import('../admin/pages/projects/ProjectsList'),
  '/admin/posts': () => import('../admin/pages/posts/PostsList'),
  '/admin/pages': () => import('../admin/pages/pages/PagesList'),
  '/admin/services': () => import('../admin/pages/ServicesSettings'),
  '/admin/leads': () => import('../admin/pages/Leads'),
  '/admin/media': () => import('../admin/pages/media/MediaLibrary'),
  '/admin/forms': () => import('../admin/pages/forms/FormsList'),
  '/admin/settings': () => import('../admin/pages/Settings'),
  '/admin/design': () => import('../admin/pages/DesignSettings'),
  '/admin/footer': () => import('../admin/pages/FooterSettings'),
}
const pending = new Map()
// Download code on navigation intent; never prefetch private data or editors.
export function preloadRoute(path) {
  if (!routes[path] || pending.has(path)) return
  pending.set(path,routes[path]().catch(()=>{pending.delete(path)}))
}
