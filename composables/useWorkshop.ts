import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import { getLocale } from '../locales'

/**
 * Workshop settings come from the headmatter of slides.md:
 *   customer:      name shown on the deck, or empty for an open workshop
 *   host, hostRole, coHost, coHostRole, coHostPhoto, eventDate, locale
 *   (not "presenter": that key is Slidev's own presenter-mode switch)
 */
export function useWorkshop() {
  const { $slidev } = useSlideContext()
  const cfg = computed(() => ($slidev?.configs ?? {}) as Record<string, any>)
  const t = computed(() => getLocale(cfg.value.locale))

  const customer = computed(() => (cfg.value.customer || '').trim())
  const customerOr = (fallback: string) => customer.value || fallback

  const allTools = computed(() => t.value.domains.flatMap(d => d.tools.map(tool => ({ ...tool, domain: d }))))
  const toolName = (key: string) => allTools.value.find(x => x.key === key)?.name ?? key

  return {
    cfg,
    t,
    customer,
    customerOr,
    presenter: computed(() => cfg.value.host || ''),
    presenterRole: computed(() => cfg.value.hostRole || ''),
    eventDate: computed(() => cfg.value.eventDate || ''),
    allTools,
    toolName,
  }
}
