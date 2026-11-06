<script setup lang="ts">
/**
 * Camunda 8 architecture as a drill-down. It opens minimal: every box shows only its title, and
 * the design plane and the orchestration cluster are closed boxes. Clicking a box selects it:
 * its details appear in the side panel, its own extra detail appears in the box, and it and its
 * connections light up. Clicking a group (design plane, cluster) opens it to show its parts.
 * Click the selection again, or empty space, to step back.
 *
 * Text comes from `architecture` in the locale; the layout is a 780 × 470 canvas below.
 * Colour coding follows the brand illustrations: orange = Camunda, ink = your systems,
 * green = people, purple = AI agents.
 */
import { computed, ref } from 'vue'
import { useWorkshop } from '../composables/useWorkshop'

const props = defineProps<{ open?: string }>()
const { t } = useWorkshop()
const a = computed(() => t.value.architecture)

type Rect = { x: number; y: number; w: number; h: number }
type Box = Rect & { id: string; group?: string }

const groups: Record<string, Rect> = {
  design: { x: 0, y: 0, w: 560, h: 88 },
  cluster: { x: 150, y: 110, w: 482, h: 280 },
}
const boxes: Box[] = [
  { id: 'modeler', group: 'design', x: 12, y: 26, w: 160, h: 50 },
  { id: 'console', group: 'design', x: 184, y: 26, w: 140, h: 50 },
  { id: 'mgmt-identity', group: 'design', x: 336, y: 26, w: 212, h: 50 },
  { id: 'idp', x: 612, y: 19, w: 168, h: 50 },
  { id: 'workers', x: 0, y: 138, w: 130, h: 84 },
  { id: 'apps', x: 0, y: 232, w: 130, h: 70 },
  { id: 'people', x: 0, y: 312, w: 130, h: 66 },
  { id: 'api', group: 'cluster', x: 162, y: 136, w: 458, h: 44 },
  { id: 'zeebe', group: 'cluster', x: 162, y: 190, w: 458, h: 100 },
  { id: 'operate', group: 'cluster', x: 162, y: 300, w: 146, h: 78 },
  { id: 'tasklist', group: 'cluster', x: 318, y: 300, w: 146, h: 78 },
  { id: 'identity', group: 'cluster', x: 474, y: 300, w: 146, h: 78 },
  { id: 'connectors', x: 650, y: 138, w: 130, h: 152 },
  { id: 'external', x: 650, y: 302, w: 130, h: 76 },
  { id: 'storage', x: 162, y: 412, w: 300, h: 58 },
  { id: 'optimize', x: 474, y: 412, w: 146, h: 58 },
  { id: 'runtime', x: 650, y: 412, w: 130, h: 58 },
]
const groupOf = (id: string) => boxes.find(b => b.id === id)?.group

// Edges end on the group frames, so the same path works with a group open or closed.
type Edge = { d: string; a: string; b: string; label?: string; lx?: number; ly?: number; both?: boolean; data?: boolean }
const edges: Edge[] = [
  { d: 'M98,88 V98 H230 V108', a: 'modeler', b: 'api', label: 'deploys', lx: 104, ly: 107 },
  { d: 'M276,88 V108', a: 'console', b: 'cluster', label: 'provisions', lx: 284, ly: 102 },
  { d: 'M560,44 H610', a: 'mgmt-identity', b: 'idp', both: true },
  { d: 'M130,158 H148', a: 'workers', b: 'api', label: 'jobs', lx: 131, ly: 152, both: true },
  { d: 'M130,267 H140 V172 H148', a: 'apps', b: 'api' },
  { d: 'M130,345 H140 V400 H300 V392', a: 'people', b: 'tasklist', label: 'tasks', lx: 196, ly: 396, both: true },
  { d: 'M632,158 H648', a: 'connectors', b: 'api', label: 'jobs', lx: 631, ly: 152, both: true },
  { d: 'M715,290 V300', a: 'connectors', b: 'external', both: true },
  { d: 'M400,390 V410', a: 'zeebe', b: 'storage', label: 'exports', lx: 334, ly: 405, data: true },
  { d: 'M440,412 V392', a: 'storage', b: 'operate', label: 'reads', lx: 446, ly: 405, data: true },
  { d: 'M462,441 H472', a: 'storage', b: 'optimize', data: true },
]
const edgeLabel = (e: Edge) => a.value.edges[e.label as string] ?? e.label

const selected = ref<string | undefined>(props.open)
const select = (id: string) => { selected.value = selected.value === id ? undefined : id }
const clear = () => { selected.value = undefined }
const part = computed(() => (selected.value ? a.value.parts[selected.value] : undefined))
const isGroup = (id?: string) => !!id && id in groups

// The open group: the selected group, or the group of the selected part.
const openGroup = computed(() => (isGroup(selected.value) ? selected.value : selected.value && groupOf(selected.value)))
// What a part looks like from outside: itself if visible, its group if the group is closed.
const visible = (id: string) => { const g = groupOf(id); return g && g !== openGroup.value ? g : id }

const edgeOn = (e: Edge) => {
  const s = selected.value
  if (!s) return false
  return [e.a, e.b].some(id => id === s || visible(id) === s || groupOf(id) === s)
}
const lit = computed(() => {
  const set = new Set<string>()
  const s = selected.value
  if (!s) return set
  set.add(s)
  for (const b of boxes) if (b.group === s) set.add(b.id)
  for (const e of edges) if (edgeOn(e)) { set.add(visible(e.a)); set.add(visible(e.b)) }
  return set
})

const style = (r: Rect) => ({ left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` })
</script>

<template>
  <div class="arch" :class="{ focused: !!selected }">
    <div class="canvas" @click.self="clear">
      <!-- Groups: a closed box at first, a frame around their parts once opened -->
      <button
        v-for="(r, g) in groups" :key="g"
        class="group camunda" :class="{ open: openGroup === g, sel: selected === g, lit: lit.has(g) }"
        :style="style(r)" @click.stop="select(g)"
      >
        <span class="g-closed">
          <span class="name"><i class="mk-sq" />{{ a.parts[g].title }}</span>
          <span class="sub">{{ a.parts[g].sub }}</span>
        </span>
        <span class="g-label">{{ a.parts[g].title }}</span>
      </button>

      <svg class="edges" viewBox="0 0 780 470" width="780" height="470" aria-hidden="true">
        <defs>
          <marker id="am-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="mk" /></marker>
          <marker id="am-arr-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="mk on" /></marker>
        </defs>
        <g v-for="(e, i) in edges" :key="i" class="edge" :class="{ on: edgeOn(e), data: e.data }">
          <path :d="e.d" :marker-end="edgeOn(e) ? 'url(#am-arr-on)' : 'url(#am-arr)'" :marker-start="e.both ? (edgeOn(e) ? 'url(#am-arr-on)' : 'url(#am-arr)') : undefined" />
          <text v-if="e.label" :x="e.lx" :y="e.ly">{{ edgeLabel(e) }}</text>
        </g>
      </svg>

      <button
        v-for="b in boxes" :key="b.id"
        class="box" :class="[a.parts[b.id].kind, b.id, {
          sel: selected === b.id, lit: lit.has(b.id), hidden: b.group && openGroup !== b.group,
        }]"
        :style="style(b)" :tabindex="b.group && openGroup !== b.group ? -1 : 0"
        @click.stop="select(b.id)"
      >
        <span class="name"><i class="mk-sq" />{{ a.parts[b.id].title }}</span>
        <span class="more">
          <span v-if="a.parts[b.id].sub" class="sub">{{ a.parts[b.id].sub }}</span>

          <!-- Zeebe: three partitions, each with a leader and two followers -->
          <span v-if="b.id === 'zeebe'" class="parts">
            <span v-for="(n, k) in ['1', '2', 'N']" :key="n" class="partition">
              <span class="pl">Partition {{ n }}</span>
              <span class="dots"><i v-for="d in 3" :key="d" :class="{ leader: d === k + 1 }" /></span>
            </span>
          </span>

          <!-- Connectors: what is in the box, with the AI Agent connector in purple -->
          <span v-if="b.id === 'connectors'" class="chips">
            <span class="chip">REST · Kafka · SAP</span>
            <span class="chip agent"><i class="mk-sq" />AI Agent · MCP</span>
            <span class="chip">A2A · webhooks</span>
          </span>
        </span>
      </button>
    </div>

    <aside class="panel">
      <Transition name="swap" mode="out-in">
        <div v-if="part" :key="selected" class="detail">
          <div class="eyebrow" :class="part.kind">{{ a.kinds[part.kind] }}</div>
          <h3>{{ part.title }}</h3>
          <p class="summary">{{ part.summary }}</p>
          <ul class="tight">
            <li v-for="p in part.points" :key="p">{{ p }}</li>
          </ul>
          <div v-if="part.workshop" class="ws">
            <div class="ws-label">{{ a.workshopLabel }}</div>
            <p>{{ part.workshop }}</p>
          </div>
          <p v-if="isGroup(selected)" class="group-hint">{{ a.groupHint }}</p>
        </div>
        <div v-else key="hint" class="detail hint">
          <div class="eyebrow">{{ a.hintEyebrow }}</div>
          <h3>{{ a.hintTitle }}</h3>
          <p class="summary">{{ a.hint }}</p>
          <div class="legend">
            <div v-for="(label, k) in a.kinds" :key="k" class="lg" :class="k"><i class="mk-sq" />{{ label }}</div>
          </div>
        </div>
      </Transition>
    </aside>
  </div>
</template>

<style scoped>
.arch { display: grid; grid-template-columns: 780px 1fr; gap: 26px; margin-top: 4px; }
.canvas { position: relative; width: 780px; height: 470px; }

/* Marker colours: orange = Camunda, ink = your systems, green = people, purple = AI agents */
.camunda { --kind: var(--c-orange); }
.yours { --kind: var(--c-charcoal); }
.people { --kind: var(--c-green-600); }
.agent { --kind: var(--c-purple); }
.mk-sq { display: inline-block; flex: none; width: 7px; height: 7px; background: var(--kind); margin-right: 8px; }

/* Shared by boxes and closed groups */
.box, .group {
  position: absolute; border: 0; border-radius: 0; font: inherit; color: var(--c-black); cursor: pointer; text-align: left;
  outline: 1.5px solid transparent; outline-offset: -1.5px;
  transition: outline-color 200ms, opacity 300ms, background-color 300ms, visibility 300ms;
}
.name { display: flex; align-items: center; font-size: 13.5px; font-weight: 500; line-height: 1.25; }
.sub { display: block; font-size: 11px; line-height: 1.35; color: var(--text-muted); }

/* Boxes: title only until selected */
.box { display: flex; flex-direction: column; justify-content: center; gap: 4px; padding: 8px 11px; background: var(--c-sand); overflow: hidden; }
.box:hover { outline-color: var(--c-orange-200); }
.box:focus-visible { outline-color: var(--c-orange); }
.box.sel { outline-color: var(--c-orange); background: var(--c-white); }
.box.lit:not(.sel) { outline-color: var(--c-orange-200); }
.box.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
.more { display: grid; gap: 6px; max-height: 0; opacity: 0; transition: opacity 250ms ease, max-height 300ms ease; }
.box.sel .more { max-height: 140px; opacity: 1; }

/* Groups: closed, a box with the group's title; open, a hairline frame with a small label */
.group { display: block; padding: 0; background: var(--c-sand); }
.group:hover { outline-color: var(--c-orange-200); }
.g-closed { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 6px; transition: opacity 250ms; }
.g-closed .name { font-size: 18px; }
.g-closed .mk-sq { width: 9px; height: 9px; }
.g-closed .sub { font-size: 12px; }
.group.lit:not(.open) { outline-color: var(--c-orange-200); }
.g-label {
  position: absolute; left: 12px; top: 6px; font-size: 10.5px; font-weight: 500; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--c-orange-700); opacity: 0; transition: opacity 250ms;
}
.group.open { background: transparent; outline: 1px solid var(--line); outline-offset: -1px; }
.group.open:hover { outline-color: var(--c-orange-200); }
.group.open.sel { outline: 1.5px solid var(--c-orange); outline-offset: -1.5px; }
.group.open .g-closed { opacity: 0; }
.group.open .g-label { opacity: 1; }

/* Zeebe partitions */
.parts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; width: 100%; margin-top: 2px; }
.partition { display: flex; flex-direction: column; gap: 5px; padding: 6px 9px; background: var(--c-sand); }
.pl { font-size: 10px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-muted); }
.dots { display: flex; gap: 6px; }
.dots i { width: 10px; height: 10px; border-radius: 50%; border: 1.3px solid var(--c-mid-gray); }
.dots i.leader { background: var(--c-orange); border-color: var(--c-orange); }

/* Connectors */
.chips { display: flex; flex-direction: column; gap: 5px; width: 100%; }
.chip { display: flex; align-items: center; font-size: 11px; padding: 5px 7px; background: var(--c-sand); }
.chip.agent { background: var(--c-purple-50); outline: 1px solid var(--c-purple-200); outline-offset: -1px; }

/* Edges */
.edges { position: absolute; inset: 0; overflow: visible; pointer-events: none; }
.edge path { fill: none; stroke: var(--c-gray); stroke-width: 1.3; transition: stroke 300ms, opacity 300ms; }
.edge.data path { stroke-dasharray: 4 3; }
.edge text { font-size: 10px; fill: var(--text-muted); font-family: var(--font-body); transition: fill 300ms, opacity 300ms; }
.mk { fill: var(--c-gray); }
.mk.on { fill: var(--c-orange); }
.edge.on path { stroke: var(--c-orange); stroke-width: 1.8; }
.edge.on text { fill: var(--c-orange-700); }

/* With a selection, what isn't connected to it fades back */
.focused .box:not(.lit):not(.hidden) { opacity: 0.4; }
.focused .group:not(.lit):not(.open) { opacity: 0.4; }
.focused .edge:not(.on) path, .focused .edge:not(.on) text { opacity: 0.3; }

/* Panel */
.panel { background: var(--c-sand); padding: 22px 22px 20px; min-height: 470px; overflow: hidden; }
.detail .eyebrow { font-size: 13px; margin-bottom: 8px; --marker: var(--kind, var(--c-orange)); }
.detail h3 { font-size: 24px; font-weight: 500; line-height: 1.2; margin: 0 0 10px; }
.summary { font-size: 16px; line-height: 1.4; margin: 0 0 14px; }
.detail ul { margin: 0; }
.detail li { font-size: 14px; line-height: 1.35; margin-bottom: 7px; }
.ws { margin-top: 16px; padding: 12px 14px; background: var(--c-white); border-left: 3px solid var(--c-purple); }
.ws-label { font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--c-purple-700); margin-bottom: 4px; }
.ws p { font-size: 14px; line-height: 1.4; margin: 0; }
.group-hint { font-size: 13px; color: var(--text-muted); margin: 16px 0 0; }
.hint .summary { color: var(--text-muted); }
.legend { display: grid; gap: 10px; margin-top: 26px; padding-top: 18px; border-top: 1px solid var(--line); }
.lg { display: flex; align-items: center; font-size: 14px; }
.lg .mk-sq { width: 9px; height: 9px; margin-right: 10px; }

.swap-enter-active, .swap-leave-active { transition: opacity 180ms ease, transform 180ms ease; }
.swap-enter-from { opacity: 0; transform: translateY(6px); }
.swap-leave-to { opacity: 0; }
</style>
