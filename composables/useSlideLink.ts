import { useNav } from '@slidev/client'

/**
 * Jump to a slide by its `routeAlias` frontmatter instead of its number, so links keep working
 * when slides are added, removed or hidden. Challenge slides use `challenge-<id>`; the menu
 * slide is `challenges`.
 */
export function useSlideLink() {
  const { slides, go } = useNav()
  const find = (alias: string) => slides.value.find(r => r.meta?.slide?.frontmatter?.routeAlias === alias)
  const goTo = (alias: string) => {
    const r = find(alias)
    if (r) go(r.no)
  }
  return { find, goTo }
}

export const challengeAlias = (id: string) => `challenge-${id}`
