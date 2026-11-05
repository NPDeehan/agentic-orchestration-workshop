<script setup lang="ts">
/**
 * The agent loop, split by who does the work: the LLM (purple) or the Camunda engine (orange).
 *  click 1     the prompt enters the loop (first pass only)
 *  clicks 2-6  pass 1: reason, decide, run tools, return results, goal achieved?
 *  click 7     not yet: pass 2 starts from the tool results, no new prompt
 *  click 8     goal met: the agent exits the loop
 */
import { computed, onBeforeUnmount } from 'vue'
import { useSlideContext } from '@slidev/client'
import { useWorkshop } from '../composables/useWorkshop'

const props = withDefaults(defineProps<{ at?: number }>(), { at: 0 })
const { t } = useWorkshop()
const loop = computed(() => t.value.loop)
const steps = computed(() => loop.value.steps)
const N = 5

const { $clicks, $clicksContext } = useSlideContext()
const key = `loop-${Math.random().toString(36).slice(2)}`
$clicksContext?.register(key, { max: props.at + 8, delta: 0 })
onBeforeUnmount(() => $clicksContext?.unregister(key))
const c = computed(() => Math.min(8, Math.max(0, ($clicks.value ?? 0) - props.at)))

const phase = computed(() => {
  if (c.value === 0) return 'idle'
  if (c.value === 1) return 'entry'
  if (c.value <= 6) return 'pass1'
  if (c.value === 7) return 'again'
  return 'exit'
})
/** index of the highlighted loop node, -1 for none */
const activeNode = computed(() => phase.value === 'pass1' ? c.value - 2 : phase.value === 'again' ? 0 : -1)
const pass = computed(() => (c.value >= 7 ? 2 : 1))

const R = 180, CX = 410, CY = 290
const angle = (i: number) => (-90 + i * (360 / N)) * Math.PI / 180
const pos = (i: number) => ({ x: CX + R * Math.cos(angle(i)), y: CY + R * Math.sin(angle(i)) })
const arc = (i: number) => {
  const a1 = angle(i) + 0.34, a2 = angle(i + 1) - 0.34
  return `M ${CX + R * Math.cos(a1)} ${CY + R * Math.sin(a1)} A ${R} ${R} 0 0 1 ${CX + R * Math.cos(a2)} ${CY + R * Math.sin(a2)}`
}
const ENTRY = { x: 120, y: 62 }
const EXIT = { x: 120, y: 520 }

/** arc i runs from node i to node i+1; arc N-1 is the "go again" arc back to Reasons */
function arcState(i: number) {
  if (phase.value === 'pass1') {
    if (i === N - 1) return ''
    return i < activeNode.value ? 'done' : ''
  }
  if (phase.value === 'again') return i === N - 1 ? 'now' : 'done'
  if (phase.value === 'exit') return 'faded'
  return ''
}

const detail = computed(() => {
  switch (phase.value) {
    case 'entry': return loop.value.entry
    case 'pass1': return steps.value[activeNode.value]
    case 'again': return loop.value.again
    case 'exit': return loop.value.exit
    default: return null
  }
})
</script>

<template>
  <div class="loop">
    <div class="wheel">
      <svg viewBox="0 0 680 580" class="arcs">
        <defs>
          <marker id="loop-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
          </marker>
        </defs>
        <path
          v-for="i in N" :key="i"
          :d="arc(i - 1)"
          class="arc" :class="arcState(i - 1)"
          marker-end="url(#loop-arrow)"
        />

        <!-- entry: only on the first pass -->
        <path
          :d="`M ${ENTRY.x + 78} ${ENTRY.y} C ${ENTRY.x + 150} ${ENTRY.y}, ${pos(0).x - 150} ${pos(0).y}, ${pos(0).x - 80} ${pos(0).y}`"
          class="flow" :class="{ on: phase === 'entry', used: c > 1 }" marker-end="url(#loop-arrow)"
        />

        <!-- exit -->
        <path
          :d="`M ${pos(4).x - 30} ${pos(4).y + 28} C ${pos(4).x - 50} ${pos(4).y + 140}, ${EXIT.x + 20} ${EXIT.y - 110}, ${EXIT.x} ${EXIT.y - 34}`"
          class="flow exitp" :class="{ on: phase === 'exit' }" marker-end="url(#loop-arrow)"
        />
      </svg>

      <div class="lbl" :class="{ on: phase === 'again' }" :style="{ left: `${CX - 112}px`, top: `${CY - 106}px` }">No: go again<small>from the tool results</small></div>
      <div class="lbl" :class="{ on: phase === 'entry' }" :style="{ left: `${ENTRY.x + 150}px`, top: `${ENTRY.y - 20}px` }">first pass only</div>
      <div class="lbl" :class="{ on: phase === 'exit' }" :style="{ left: `${pos(4).x - 72}px`, top: `${pos(4).y + 116}px` }">Yes</div>

      <div class="center">
        <div class="xs muted" style="text-transform:uppercase;letter-spacing:.02em">AI agent</div>
        <div class="display" style="font-size:24px;line-height:1.1">sub-process</div>
        <div class="pass" :class="{ show: c >= 2 }">Pass {{ pass }}</div>
      </div>

      <div
        v-for="(s, i) in steps" :key="s.key"
        class="node" :class="[s.actor, { now: i === activeNode, done: phase === 'pass1' && i < activeNode }]"
        :style="{ left: `${pos(i).x}px`, top: `${pos(i).y}px` }"
      >
        <span class="who">{{ loop.actors[s.actor] }}</span>
        <span class="ttl">{{ s.short }}</span>
      </div>

      <div class="node edge engine" :class="{ now: phase === 'entry', used: c > 1 }" :style="{ left: `${ENTRY.x}px`, top: `${ENTRY.y}px` }">
        <span class="who">{{ loop.actors.engine }}</span>
        <span class="ttl">{{ loop.entry.short }}</span>
      </div>
      <div class="node edge exit engine" :class="{ now: phase === 'exit' }" :style="{ left: `${EXIT.x}px`, top: `${EXIT.y}px` }">
        <span class="who">{{ loop.actors.engine }}</span>
        <span class="ttl">{{ loop.exit.short }}</span>
      </div>
    </div>

    <div class="detail">
      <Transition name="cap" mode="out-in">
        <div v-if="detail" :key="c">
          <span class="pill" :class="detail.actor">{{ loop.actors[detail.actor] }}</span>
          <h2 class="display">{{ detail.title }}</h2>
          <p class="lead muted">{{ detail.text }}</p>
        </div>
        <div v-else key="idle">
          <div class="eyebrow">{{ loop.idle.eyebrow }}</div>
          <h2 class="display">{{ loop.idle.title }}</h2>
          <p class="lead muted">{{ loop.idle.text }}</p>
        </div>
      </Transition>
      <div class="legend small">
        <span><i class="sw llm" />{{ loop.actors.llm }}: thinks and decides</span>
        <span><i class="sw engine" />{{ loop.actors.engine }}: runs, waits, records</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loop { display: grid; grid-template-columns: 680px 1fr; gap: 20px; align-items: center; margin-top: -14px; }
.wheel { position: relative; width: 680px; height: 580px; }
.arcs { position: absolute; inset: 0; overflow: visible; }
.arc { fill: none; stroke: var(--c-gray); stroke-width: 2.5; stroke-dasharray: 6 6; transition: stroke 300ms, opacity 300ms; }
.arc.done { stroke: var(--c-black); stroke-dasharray: none; }
.arc.now { stroke: var(--c-orange); stroke-dasharray: none; stroke-width: 3.5; }
.arc.faded { opacity: 0.3; }
.lbl {
  position: absolute; transform: translate(-50%, -50%); z-index: 1;
  background: var(--c-sand); padding: 2px 8px 4px; text-align: center;
  font-size: 14px; line-height: 1.25; color: var(--c-mid-gray); white-space: nowrap; transition: color 300ms;
}
.lbl small { display: block; font-size: 12px; }
.lbl.on { color: var(--c-black); }
.flow { fill: none; stroke: var(--c-gray); stroke-width: 2.5; stroke-dasharray: 6 6; transition: stroke 300ms, opacity 300ms; }
.flow.on { stroke: var(--c-orange); stroke-dasharray: none; stroke-width: 3.5; }
.flow.used { opacity: 0.4; }
.flow.exitp.on { stroke: var(--c-success); }

.center {
  position: absolute; left: 410px; top: 290px; transform: translate(-50%, -50%);
  width: 170px; height: 170px; border-radius: 50%;
  display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
  background: radial-gradient(circle at 40% 35%, var(--c-purple-50), var(--c-white) 70%);
  border: 1px solid var(--line);
}
.pass { margin-top: 8px; font-size: 12px; letter-spacing: 0.02em; text-transform: uppercase; padding: 2px 10px; border-radius: 0; background: var(--c-black); color: var(--c-white); opacity: 0; transition: opacity 300ms; }
.pass.show { opacity: 1; }

.node {
  position: absolute; transform: translate(-50%, -50%);
  width: 150px; padding: 8px 10px 10px; text-align: center;
  background: var(--c-white); border: 1.5px solid var(--line); border-radius: var(--radius);
  transition: all 300ms;
}
.node .who { display: block; font-size: 10.5px; letter-spacing: 0.02em; text-transform: uppercase; margin-bottom: 3px; }
.node.llm .who { color: var(--c-purple-700); }
.node.engine .who { color: var(--c-orange-700); }
.node .ttl { font-size: 15px; line-height: 1.25; }
.node .who::before { content: ''; display: inline-block; width: 8px; height: 8px; margin-right: 6px; vertical-align: 0; }
.node.llm .who::before { background: var(--c-purple); }
.node.engine .who::before { background: var(--c-orange); }
.node.done { background: var(--c-sand); }
.node.now { transform: translate(-50%, -50%) scale(1.1); border-color: var(--c-black); }
.node.now.llm { background: var(--c-purple-50); }
.node.now.engine { background: var(--c-orange-50); }
.node.edge { border-style: dashed; }
.node.edge.now { border-style: solid; }
.node.edge.used, .node.exit:not(.now) { background: var(--c-sand); }
.node.edge.used .who::before, .node.exit:not(.now) .who::before { background: var(--c-gray); }
.node.edge.used .who, .node.edge.used .ttl, .node.exit:not(.now) .who, .node.exit:not(.now) .ttl { color: var(--c-mid-gray); }
.node.exit.now { border-color: var(--c-success); background: var(--c-green-50); }

.detail h2 { font-size: 38px; margin: 14px 0 14px; }
.detail .lead { font-size: 21px; }
.pill { display: inline-block; font-size: 13px; letter-spacing: 0.02em; text-transform: uppercase; padding: 4px 12px; border-radius: 0; }
.pill.llm { background: var(--c-purple-100); color: var(--c-purple-700); }
.pill.engine { background: var(--c-orange-100); color: var(--c-orange-700); }
.legend { display: flex; flex-direction: column; gap: 6px; margin-top: 26px; color: var(--text-muted); }
.sw { display: inline-block; width: 12px; height: 12px; margin-right: 8px; vertical-align: -1px; }
.sw.llm { background: var(--c-purple); }
.sw.engine { background: var(--c-orange); }
.cap-enter-active, .cap-leave-active { transition: opacity 220ms ease, transform 220ms ease; }
.cap-enter-from { opacity: 0; transform: translateY(8px); }
.cap-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
