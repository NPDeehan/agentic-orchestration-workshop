<script setup lang="ts">
/**
 * Presenter navigator at /nav: every slide as a thumbnail, grouped by section.
 * Click a slide to jump to it. Sections start at slides with layout "section" or "breakout".
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNav } from '@slidev/client'
import configs from '#slidev/configs'
import { createFixedClicks } from '@slidev/client/composables/useClicks.ts'
import { CLICKS_MAX } from '@slidev/client/constants.ts'
import SlideContainer from '@slidev/client/internals/SlideContainer.vue'
import SlideWrapper from '@slidev/client/internals/SlideWrapper.vue'

const { slides } = useNav()
const router = useRouter()
const filter = ref('')

function titleOf(route: any) {
  const s = route.meta?.slide
  const fm = s?.frontmatter || {}
  const cfg: Record<string, any> = configs
  if (s?.title) {
    return s.title
      .replace(/\{\{\s*\$slidev\.configs\.(\w+)\s*\}\}/g, (_: string, k: string) => cfg[k] ?? '')
      .replace(/<Customer\s+fallback="([^"]*)"\s*\/>/g, (_: string, fb: string) => cfg.customer || fb)
      .replace(/<[^>]+>/g, '')
      .trim() || fm.eyebrow || `Slide ${route.no}`
  }
  return fm.eyebrow || fm.layout || `Slide ${route.no}`
}

const groups = computed(() => {
  const out: { title: string; no: number; items: any[] }[] = []
  for (const r of slides.value) {
    const fm = r.meta?.slide?.frontmatter || {}
    const starts = r.no === 1 || ['section', 'breakout'].includes(fm.layout)
    if (starts) out.push({ title: r.no === 1 ? 'Opening' : titleOf(r), no: r.no, items: [] })
    out[out.length - 1].items.push(r)
  }
  const q = filter.value.toLowerCase().trim()
  if (!q) return out
  return out
    .map(g => ({ ...g, items: g.items.filter(r => titleOf(r).toLowerCase().includes(q) || g.title.toLowerCase().includes(q)) }))
    .filter(g => g.items.length)
})

const go = (no: number) => router.push(`/${no}`)

/*
 * Handouts: slides tagged `handout: <name>` (set on a src: import in slides.md), minus breakout
 * countdowns. Same rule as scripts/export-handout.mjs, so the page numbers match.
 */
const SKIP_LAYOUTS = ['breakout']
const handouts = computed(() => {
  const map = new Map<string, number[]>()
  for (const r of slides.value) {
    const fm = r.meta?.slide?.frontmatter || {}
    if (!fm.handout || SKIP_LAYOUTS.includes(fm.layout)) continue
    if (!map.has(fm.handout)) map.set(fm.handout, [])
    map.get(fm.handout)!.push(r.no)
  }
  return [...map].map(([name, pages]) => ({ name, pages, range: toRange(pages) }))
})

function toRange(pages: number[]) {
  const runs: [number, number][] = []
  for (const n of pages) {
    const last = runs.at(-1)
    if (last && n === last[1] + 1) last[1] = n
    else runs.push([n, n])
  }
  return runs.map(([a, b]) => (a === b ? `${a}` : `${a}-${b}`)).join(',')
}

const isDev = import.meta.env.DEV
const exporting = ref('')
const exportError = ref('')

// dev only (needs the vite.config.ts endpoint): run the real export, same as
// `npm run export:challenges`, and download the PDF

async function exportPdf(name: string) {
  exporting.value = name
  exportError.value = ''
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}__export-handout?name=${encodeURIComponent(name)}`)
    if (!res.ok) throw new Error((await res.text()) || `Export failed (${res.status})`)
    // a dev server started before vite.config.ts existed has no endpoint and answers with the
    // deck's index.html instead; don't save that as a .pdf
    if (!res.headers.get('content-type')?.includes('application/pdf'))
      throw new Error('The export endpoint isn’t loaded. Stop and restart `npm run dev`, then try again.')
    const url = URL.createObjectURL(await res.blob())
    const a = Object.assign(document.createElement('a'), { href: url, download: `agentic-orchestration-${name}.pdf` })
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
  }
  catch (e: any) {
    exportError.value = e?.message || String(e)
  }
  finally {
    exporting.value = ''
  }
}
</script>

<template>
  <div class="nav-page">
    <header>
      <div>
        <div class="eyebrow">Presenter navigator</div>
        <h1 class="display">All slides</h1>
      </div>
      <input v-model="filter" placeholder="Filter by title" class="filter">
    </header>

    <div v-if="handouts.length" class="handouts">
      <div v-for="h in handouts" :key="h.name" class="handout">
        <div class="h-info">
          <span class="h-label">Handout</span>
          <span class="h-name">{{ h.name }}</span>
          <span class="muted">{{ h.pages.length }} slides · pages {{ h.range }}</span>
        </div>
        <button v-if="isDev" class="btn primary" :disabled="!!exporting" @click="exportPdf(h.name)">
          {{ exporting === h.name ? 'Exporting… about a minute' : 'Export PDF' }}
        </button>
        <code v-else class="h-cmd">npm run export:{{ h.name }}</code>
      </div>
      <p v-if="exportError" class="h-error">{{ exportError }}</p>
    </div>

    <nav class="toc">
      <a v-for="g in groups" :key="g.no" :href="`#sec-${g.no}`">{{ g.title }}</a>
    </nav>

    <section v-for="g in groups" :id="`sec-${g.no}`" :key="g.no" class="group">
      <h2>{{ g.title }} <span class="muted">· {{ g.items.length }}</span></h2>
      <div class="grid">
        <button v-for="r in g.items" :key="r.no" class="thumb" @click="go(r.no)">
          <SlideContainer :no="r.no" :width="300" :use-snapshot="true" class="pointer-events-none">
            <SlideWrapper :clicks-context="createFixedClicks(r, CLICKS_MAX)" :route="r" render-context="overview" />
          </SlideContainer>
          <span class="cap"><b>{{ r.no }}</b> {{ titleOf(r) }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.nav-page {
  min-height: 100vh; overflow-y: auto; background: var(--c-sand); color: var(--c-black);
  font-family: var(--font-body); letter-spacing: -0.02em; padding: 40px 48px 80px;
  position: fixed; inset: 0;
}
header { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 18px; }
h1 { font-size: 48px; margin: 0; }
.filter { font: inherit; font-size: 16px; padding: 10px 14px; border: 1px solid var(--c-warm-light-gray); border-radius: 6px; background: #fff; min-width: 280px; }
.toc { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; position: sticky; top: -40px; padding: 12px 0; background: var(--c-sand); z-index: 2; }
.toc a { font-size: 13px; padding: 5px 12px; border-radius: 999px; background: #fff; border: 1px solid var(--c-warm-light-gray); color: inherit; text-decoration: none; }
.toc a:hover { border-color: var(--c-black); }
.group { margin-bottom: 36px; scroll-margin-top: 70px; }
.group h2 { font-size: 20px; margin: 0 0 14px; font-weight: 400; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, 300px); gap: 18px; }
.thumb { display: flex; flex-direction: column; gap: 8px; padding: 0; border: 0; background: none; cursor: pointer; text-align: left; font: inherit; color: inherit; }
.thumb :deep(.slidev-slide-container) { border: 1px solid var(--c-warm-light-gray); border-radius: 6px; overflow: hidden; transition: border-color 150ms; }
.thumb:hover :deep(.slidev-slide-container) { border-color: var(--c-black); }
.cap { font-size: 13px; line-height: 1.3; color: var(--c-mid-gray); }
.cap b { font-weight: 400; color: var(--c-black); margin-right: 6px; }
.muted { color: var(--c-mid-gray); }

/* handout export */
.handouts { display: grid; gap: 8px; margin-bottom: 8px; }
.handout { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; background: #fff; border: 1px solid var(--c-warm-light-gray); border-radius: 6px; padding: 12px 16px; }
.h-info { display: flex; align-items: baseline; gap: 10px; flex: 1; min-width: 260px; font-size: 14px; }
.h-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.02em; color: var(--c-mid-gray); }
.h-name { font-size: 18px; text-transform: capitalize; }
.btn { font: inherit; font-size: 14px; padding: 8px 16px; border-radius: 6px; cursor: pointer; text-decoration: none; }
.btn.primary { background: var(--c-black); color: #fff; border: 1px solid var(--c-black); }
.btn.primary:disabled { opacity: 0.6; cursor: progress; }
.h-cmd { font-family: var(--font-mono); font-size: 13px; color: var(--c-mid-gray); } /* built deck: no server to export with */
.h-error { margin: 0; font-size: 13px; color: var(--c-error); white-space: pre-wrap; max-height: 120px; overflow: auto; }
</style>
