import { defineShortcutsSetup } from '@slidev/types'

// "n" opens the presenter navigator (all slides grouped by section)
export default defineShortcutsSetup((nav, base) => [
  ...base,
  {
    name: 'navigator',
    key: 'n',
    fn: () => {
      const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
      window.location.assign(`${base}/nav`)
    },
  },
])
