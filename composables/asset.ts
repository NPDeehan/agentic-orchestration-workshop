/**
 * Resolve a file in public/ (e.g. "/icons/x.svg") against the site's base path.
 * Needed for paths built in script; the build only rewrites static src attributes.
 * On GitHub Pages the deck lives under /<repo>/, so a bare "/icons/x.svg" would 404.
 */
export function asset(path: string) {
  if (!path || /^(https?:|data:|blob:)/.test(path)) return path
  return import.meta.env.BASE_URL.replace(/\/$/, '') + (path.startsWith('/') ? path : `/${path}`)
}
