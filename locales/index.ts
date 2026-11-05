import en from './en'
import type { Locale } from './types'

export const locales: Record<string, Locale> = { en }

export function getLocale(code?: string): Locale {
  return locales[code || 'en'] || en
}
