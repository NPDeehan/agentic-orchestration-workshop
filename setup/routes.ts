import { defineRoutesSetup } from '@slidev/types'

export default defineRoutesSetup(routes => [
  ...routes,
  // Presenter navigator: every slide, grouped by section
  {
    name: 'navigator',
    path: '/nav',
    component: () => import('../navigator/Navigator.vue'),
  },
  // Judge sheet with hidden prompts: dev mode only, so it never ships in a build or the PDF
  ...(import.meta.env.DEV
    ? [{ name: 'judge', path: '/judge', component: () => import('../judging/Judge.vue') }]
    : []),
])
