<script setup lang="ts">
/**
 * Renders a .bpmn file from /bpmn with bpmn-js.
 *
 * `diagram` is the file's path under bpmn/, without the extension, and is matched
 * case-insensitively: "invoice-blended" or "Patterns/4. Agent Self-Reflection".
 *
 * Step-throughs: pass `steps`, one entry per state. steps[0] is the state before any
 * click, steps[1] after the first click, and so on. Each step can
 *   reveal: element ids that appear at this step (hidden before it)
 *   focus:  element ids highlighted at this step (everything else is dimmed)
 *   active: element ids shown as "currently running" (simulated token)
 *   view:   element ids to zoom the canvas to (the whole model when omitted)
 *   tone:   'purple' | 'orange' | 'green' focus colour
 * The component registers its clicks with Slidev, so no frontmatter is needed.
 */
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer'
import { templateIconModule } from '../composables/bpmnTemplateIcons'

interface Step {
  reveal?: string[]
  focus?: string[]
  active?: string[]
  tone?: 'purple' | 'orange' | 'green'
  /** small labels pinned to elements, e.g. { agent: 'LLM decides' } */
  badges?: Record<string, string>
  /** element ids lit up one after another, on a loop (simulated execution) */
  sequence?: string[]
  /** zoom to these elements; omit to show the whole model */
  view?: string[]
}

const props = withDefaults(defineProps<{
  diagram: string
  steps?: Step[]
  /** static focus when not using steps */
  focus?: string[]
  /** elements to hide entirely (e.g. show phase-1 subset of a bigger model) */
  hide?: string[]
  /** click offset: step 0 is shown until this click */
  at?: number
  height?: string
  padding?: number
  interactive?: boolean
}>(), { steps: () => [], focus: () => [], hide: () => [], at: 0, height: '100%', padding: 24, interactive: true })

const files = import.meta.glob('../bpmn/**/*.bpmn', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
/** path-under-bpmn/ and bare filename, both lowercased, -> xml */
const index: Record<string, string> = {}
for (const [path, src] of Object.entries(files)) {
  const rel = path.replace(/^\.\.\/bpmn\//, '').replace(/\.bpmn$/, '')
  index[rel.toLowerCase()] = src
  const base = rel.split('/').pop()!.toLowerCase()
  if (!(base in index)) index[base] = src
}
/**
 * Widen the label boxes in the diagram interchange, keeping them centred.
 *
 * bpmn-js wraps an external label to the width the exporter recorded, and the
 * Modeler measured that in Arial. Poppins is wider, so "Output" comes out as
 * "Outpu / t". Nothing is moved: only the box the text may use grows.
 */
function widenLabels(src: string) {
  return src.replace(/(<bpmndi:BPMNLabel[^>]*>\s*<dc:Bounds)([^/>]*)/g, (whole, head: string, attrs: string) => {
    const w = /width="([\d.]+)"/.exec(attrs)
    const x = /x="([-\d.]+)"/.exec(attrs)
    if (!w || !x) return whole
    const width = parseFloat(w[1]) * 1.5
    const left = parseFloat(x[1]) - (width - parseFloat(w[1])) / 2
    return head + attrs
      .replace(/width="[\d.]+"/, `width="${width.toFixed(1)}"`)
      .replace(/x="[-\d.]+"/, `x="${left.toFixed(1)}"`)
  })
}

const xml = computed(() => {
  const src = index[props.diagram.replace(/\.bpmn$/, '').toLowerCase()]
  return src && widenLabels(src)
})

const { $clicks, $clicksContext } = useSlideContext()
const clickKey = `bpmn-${Math.random().toString(36).slice(2)}`
if (props.steps.length > 1 && $clicksContext)
  $clicksContext.register(clickKey, { max: props.at + props.steps.length - 1, delta: 0 })
onBeforeUnmount(() => $clicksContext?.unregister(clickKey))

const stepIndex = computed(() => {
  if (!props.steps.length) return 0
  const i = ($clicks.value ?? 0) - props.at
  return Math.max(0, Math.min(props.steps.length - 1, i))
})

const el = ref<HTMLDivElement>()
const frame = ref<HTMLDivElement>()
const viewer = shallowRef<any>()
const ready = ref(false)
const error = ref('')
let ro: ResizeObserver | undefined

type Box = { x: number; y: number; width: number; height: number }

/** px per diagram unit a `view` step may zoom to. 11px BPMN labels become ~17px. */
const MAX_SCALE = 1.5

/** union bounding box of the given elements, including their external labels */
function boxOf(ids: string[]): Box | undefined {
  const registry = viewer.value.get('elementRegistry')
  let min = { x: Infinity, y: Infinity }
  let max = { x: -Infinity, y: -Infinity }
  const add = (e: any) => {
    if (!e) return
    if (e.waypoints) {
      for (const w of e.waypoints) {
        min = { x: Math.min(min.x, w.x), y: Math.min(min.y, w.y) }
        max = { x: Math.max(max.x, w.x), y: Math.max(max.y, w.y) }
      }
      return
    }
    if (typeof e.x !== 'number') return
    min = { x: Math.min(min.x, e.x), y: Math.min(min.y, e.y) }
    max = { x: Math.max(max.x, e.x + (e.width || 0)), y: Math.max(max.y, e.y + (e.height || 0)) }
  }
  for (const id of ids) {
    const e = registry.get(id)
    add(e)
    if (e?.label) add(e.label)
  }
  if (!isFinite(min.x)) return undefined
  return { x: min.x, y: min.y, width: Math.max(max.x - min.x, 1), height: Math.max(max.y - min.y, 1) }
}

/** grow a box to the frame's aspect ratio, so what you see is what was asked for */
function toAspect(box: Box, ratio: number): Box {
  const grown = box.width / box.height < ratio
    ? { width: box.height * ratio, height: box.height }
    : { width: box.width, height: box.width / ratio }
  return {
    x: box.x - (grown.width - box.width) / 2,
    y: box.y - (grown.height - box.height) / 2,
    ...grown,
  }
}

/** the box the current step wants on screen: its `view`, else the whole model */
function targetBox(): Box | undefined {
  const canvas = viewer.value.get('canvas')
  const step = props.steps[stepIndex.value] || {}
  const whole: Box | undefined = canvas.viewbox().inner
  const asked = step.view?.length ? boxOf(step.view) : undefined
  const box = asked || whole
  if (!box?.width) return undefined

  // breathing room, in diagram units so it scales with how far we are zoomed in
  const pad = Math.max(props.padding, Math.max(box.width, box.height) * 0.05)
  let out: Box = { x: box.x - pad, y: box.y - pad, width: box.width + pad * 2, height: box.height + pad * 2 }

  const ratio = (el.value!.clientWidth || 16) / (el.value!.clientHeight || 9)
  out = toAspect(out, ratio)

  if (asked && whole?.width) {
    // Cap how far in we go, so focusing one small task doesn't fill the slide with
    // two giant boxes. This is a zoom ceiling, not a ratio of the model: tall models
    // like the guardrail set still zoom right in on one of their variants.
    const minWidth = (el.value!.clientWidth || 1) / MAX_SCALE
    if (out.width < minWidth) {
      const cx = out.x + out.width / 2
      const cy = out.y + out.height / 2
      const grown = toAspect({ x: 0, y: 0, width: minWidth, height: minWidth / ratio }, ratio)
      out = { x: cx - grown.width / 2, y: cy - grown.height / 2, width: grown.width, height: grown.height }
    }
    // keep the crop over the model rather than over empty canvas beside it
    const full = toAspect(whole, ratio)
    if (out.width < full.width) {
      out.x = Math.min(Math.max(out.x, full.x), full.x + full.width - out.width)
      out.y = Math.min(Math.max(out.y, full.y), full.y + full.height - out.height)
    }
  }
  return out
}

let raf = 0
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

/** move the viewport to `box`; bpmn-js picks the scale that fits it */
function goToBox(box: Box, animate: boolean) {
  const canvas = viewer.value.get('canvas')
  cancelAnimationFrame(raf)
  const from = canvas.viewbox()
  if (!animate || !from.width) { canvas.viewbox(box); return }
  const start: Box = { x: from.x, y: from.y, width: from.width, height: from.height }
  const t0 = performance.now()
  const frame = (now: number) => {
    const p = Math.min(1, (now - t0) / 420)
    const k = ease(p)
    canvas.viewbox({
      x: lerp(start.x, box.x, k), y: lerp(start.y, box.y, k),
      width: lerp(start.width, box.width, k), height: lerp(start.height, box.height, k),
    })
    if (p < 1) raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)
}

function applyView(animate = true) {
  if (!viewer.value || !ready.value || !el.value?.clientWidth) return
  viewer.value.get('canvas').resized()
  const box = targetBox()
  if (box) goToBox(box, animate)
}

function relatedIds(registry: any, ids: Set<string>) {
  // expand: children of hidden containers, connections touching hidden shapes
  const out = new Set(ids)
  let changed = true
  while (changed) {
    changed = false
    registry.forEach((e: any) => {
      if (out.has(e.id)) return
      const hit = (e.parent && out.has(e.parent.id))
        || (e.source && out.has(e.source.id))
        || (e.target && out.has(e.target.id))
      if (hit) { out.add(e.id); changed = true }
    })
  }
  return out
}

let seqTimer: ReturnType<typeof setInterval> | undefined

function applyBadges(step: Step) {
  const overlays = viewer.value.get('overlays')
  overlays.remove({ type: 'tour' })
  for (const [id, text] of Object.entries(step.badges || {})) {
    const html = document.createElement('div')
    html.className = 'bpmn-badge'
    html.textContent = text
    try { overlays.add(id, 'tour', { position: { top: -13, right: 10 }, html }) }
    catch { /* unknown id */ }
  }
}

function applySequence(step: Step) {
  if (seqTimer) clearInterval(seqTimer)
  seqTimer = undefined
  const seq = step.sequence || []
  if (!seq.length) return
  const canvas = viewer.value.get('canvas')
  let i = 0
  const tick = () => {
    seq.forEach(id => canvas.removeMarker(id, 'is-active'))
    canvas.addMarker(seq[i % seq.length], 'is-active')
    i++
  }
  tick()
  seqTimer = setInterval(tick, 1100)
}

function applyState() {
  const v = viewer.value
  if (!v || !ready.value) return
  const canvas = v.get('canvas')
  const registry = v.get('elementRegistry')

  const idx = stepIndex.value
  const hidden = new Set<string>(props.hide)
  props.steps.forEach((s, i) => { if (i > idx) (s.reveal || []).forEach(id => hidden.add(id)) })
  const hiddenAll = relatedIds(registry, hidden)

  const step = props.steps[idx] || {}
  const focus = new Set(step.focus ?? (props.steps.length ? [] : props.focus))
  const active = new Set(step.active || [])
  const tone = step.tone || 'purple'

  registry.forEach((e: any) => {
    if (e.type === 'label') return
    const ids = [e.id]
    if (e.label) ids.push(e.label.id)
    for (const id of ids) {
      for (const m of ['is-hidden', 'is-focus', 'is-context', 'is-active', 'focus-orange', 'focus-green'])
        canvas.removeMarker(id, m)
      if (hiddenAll.has(e.id)) canvas.addMarker(id, 'is-hidden')
      if (focus.has(e.id)) {
        canvas.addMarker(id, 'is-focus')
        if (tone !== 'purple') canvas.addMarker(id, `focus-${tone}`)
      }
      if (active.has(e.id)) canvas.addMarker(id, 'is-active')
    }
    // keep the parent container and labels of focused/active items readable
    if ((focus.has(e.id) || active.has(e.id)) && e.parent && e.parent.type !== 'bpmn:Process') {
      canvas.addMarker(e.parent.id, 'is-context')
    }
  })
  // on the frame, which is what the dim rules in styles/bpmn.css select
  frame.value?.classList.toggle('has-focus', focus.size > 0 || active.size > 0 || !!step.sequence?.length)
  applyBadges(step)
  applySequence(step)
}

onMounted(async () => {
  if (!xml.value) { error.value = `Diagram not found: ${props.diagram}`; return }
  // Brand: Poppins (never the Arial default) and Black #1B1B1B for strokes and labels
  viewer.value = new NavigatedViewer({
    container: el.value,
    additionalModules: [templateIconModule],
    bpmnRenderer: { defaultStrokeColor: '#1B1B1B', defaultLabelColor: '#1B1B1B', defaultFillColor: '#FFFFFF' },
    textRenderer: {
      defaultStyle: { fontFamily: 'Poppins, sans-serif', fontSize: 11, fontWeight: 400, lineHeight: 1.25 },
      externalStyle: { fontFamily: 'Poppins, sans-serif', fontSize: 10, fontWeight: 400 },
    },
  })
  try {
    // measure label wrapping with the real brand font
    await document.fonts?.load('400 11px Poppins').catch(() => {})
    await viewer.value.importXML(xml.value)
    ready.value = true
    applyState()
    applyView(false)
  }
  catch (e: any) {
    error.value = e?.message || String(e)
  }
  ro = new ResizeObserver(() => applyView(false))
  ro.observe(el.value!)
})

onBeforeUnmount(() => {
  ro?.disconnect()
  cancelAnimationFrame(raf)
  if (seqTimer) clearInterval(seqTimer)
  viewer.value?.destroy()
})

watch([stepIndex, () => props.focus, () => props.hide], () => { applyState(); applyView() })
</script>

<template>
  <div ref="frame" class="bpmn-frame" :style="{ height }" :class="{ 'pointer-events-none': !interactive }">
    <div ref="el" class="bpmn-canvas" />
    <div v-if="error" class="placeholder" style="position:absolute;inset:12px">{{ error }}</div>
  </div>
</template>

<style scoped>
.bpmn-canvas { position: absolute; inset: 0; }
</style>
