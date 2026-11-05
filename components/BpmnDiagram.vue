<script setup lang="ts">
/**
 * Renders a .bpmn file from /bpmn with bpmn-js.
 *
 * Step-throughs: pass `steps`, one entry per state. steps[0] is the state before any
 * click, steps[1] after the first click, and so on. Each step can
 *   reveal: element ids that appear at this step (hidden before it)
 *   focus:  element ids highlighted at this step (everything else is dimmed)
 *   active: element ids shown as "currently running" (simulated token)
 *   tone:   'purple' | 'orange' | 'green' focus colour
 * The component registers its clicks with Slidev, so no frontmatter is needed.
 */
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer'

interface Step {
  reveal?: string[]
  focus?: string[]
  active?: string[]
  tone?: 'purple' | 'orange' | 'green'
  /** small labels pinned to elements, e.g. { agent: 'LLM decides' } */
  badges?: Record<string, string>
  /** element ids lit up one after another, on a loop (simulated execution) */
  sequence?: string[]
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

const files = import.meta.glob('../bpmn/*.bpmn', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const xml = computed(() => files[`../bpmn/${props.diagram}.bpmn`])

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
const viewer = shallowRef<any>()
const ready = ref(false)
const error = ref('')
let ro: ResizeObserver | undefined

function fit() {
  const v = viewer.value
  if (!v || !el.value || !el.value.clientWidth) return
  const canvas = v.get('canvas')
  canvas.resized()
  canvas.zoom('fit-viewport', 'auto')
  // add breathing room
  const vb = canvas.viewbox()
  const pad = props.padding / (vb.scale || 1)
  canvas.viewbox({ x: vb.x - pad, y: vb.y - pad, width: vb.width + pad * 2, height: vb.height + pad * 2 })
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
  const container = el.value!

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
  container.classList.toggle('has-focus', focus.size > 0 || active.size > 0 || !!step.sequence?.length)
  applyBadges(step)
  applySequence(step)
}

onMounted(async () => {
  if (!xml.value) { error.value = `Diagram not found: ${props.diagram}`; return }
  // Brand: Poppins (never the Arial default) and Black #1B1B1B for strokes and labels
  viewer.value = new NavigatedViewer({
    container: el.value,
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
    fit()
    applyState()
  }
  catch (e: any) {
    error.value = e?.message || String(e)
  }
  ro = new ResizeObserver(() => fit())
  ro.observe(el.value!)
})

onBeforeUnmount(() => { ro?.disconnect(); if (seqTimer) clearInterval(seqTimer); viewer.value?.destroy() })

watch([stepIndex, () => props.focus, () => props.hide], applyState)
</script>

<template>
  <div class="bpmn-frame" :style="{ height }" :class="{ 'pointer-events-none': !interactive }">
    <div ref="el" class="bpmn-canvas" />
    <div v-if="error" class="placeholder" style="position:absolute;inset:12px">{{ error }}</div>
  </div>
</template>

<style scoped>
.bpmn-canvas { position: absolute; inset: 0; }
</style>
