<script setup lang="ts">
/**
 * Camunda platform in the style of template layout "Camunda 20 Loop process":
 * four filled step tiles (green, purple, Sand, orange) joined by small orange markers,
 * with a "repeat" line underneath. Clicks 1-4 fill the steps; click 5 closes the loop.
 */
import { computed, onBeforeUnmount } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{ at?: number }>(), { at: 0 })

const stages = [
  { title: 'Design and implement', icon: 'modeler', tone: 'green', items: ['Modeler with AI copilots', 'Integrated AI agents', 'Forms, IDP and RPA', 'Connectors and marketplace'] },
  { title: 'Test and deploy', icon: 'testing', tone: 'purple', items: ['Rapid process testing', 'CI/CD integration'] },
  { title: 'Automate', icon: 'zeebe-orchestration-engine', tone: 'sand', items: ['Zeebe process and decision engine', 'Workers: agents, connectors, RPA', 'Operate and Tasklist'] },
  { title: 'Improve', icon: 'optimize', tone: 'orange', items: ['Optimize: KPIs, heatmaps and targets'] },
]

const { $clicks, $clicksContext } = useSlideContext()
const key = `platform-${Math.random().toString(36).slice(2)}`
$clicksContext?.register(key, { max: props.at + 5, delta: 0 })
onBeforeUnmount(() => $clicksContext?.unregister(key))
const step = computed(() => Math.max(0, ($clicks.value ?? 0) - props.at))
const looped = computed(() => step.value >= 5)
</script>

<template>
  <div class="pf" :class="{ looped }">
    <div class="steps">
      <template v-for="(s, i) in stages" :key="s.title">
        <div class="step" :class="[s.tone, { on: step >= i + 1 || looped, now: step === i + 1 }]">
          <div class="num">{{ String(i + 1).padStart(2, '0') }}</div>
          <BrandIcon :name="s.icon" :size="34" class="ic" />
          <h3>{{ s.title }}</h3>
          <ul class="tight">
            <li v-for="it in s.items" :key="it">{{ it }}</li>
          </ul>
        </div>
        <span v-if="i < stages.length - 1" class="joint" :class="{ on: step >= i + 2 || looped }" />
      </template>
    </div>
    <svg class="loop" viewBox="0 0 1120 70" preserveAspectRatio="none">
      <path d="M1000 2 V44 H125 V2" class="loop-path" />
      <rect x="121" y="0" width="8" height="8" class="loop-end" />
    </svg>
    <div class="loop-label">Repeat with what you learned: one model from design to runtime to analysis</div>
  </div>
</template>

<style scoped>
.pf { position: relative; margin-top: 6px; }
.steps { display: grid; grid-template-columns: 1fr 22px 1fr 22px 1fr 22px 1fr; align-items: stretch; }
.step {
  min-height: 300px; padding: 18px 20px 16px;
  background: var(--c-white); outline: 1px solid var(--line); outline-offset: -1px;
  transition: background 450ms ease, outline-color 450ms ease, transform 450ms ease;
}
.step.on { outline-color: transparent; }
.step.on.green { background: var(--c-green-400); }
.step.on.purple { background: var(--c-purple-400); }
.step.on.sand { background: var(--c-sand); }
.step.on.orange { background: var(--c-orange-400); }
.step.now { transform: translateY(-6px); }
.num { font-weight: 300; font-size: 40px; line-height: 1; margin-bottom: 10px; }
.ic { margin-bottom: 8px; }
.step h3 { font-weight: 500; font-size: 21px; line-height: 1.25; margin: 0 0 10px; }
.step li { font-size: 16px; line-height: 1.3; }
.step:not(.on) .num, .step:not(.on) h3, .step:not(.on) li { color: var(--c-mid-gray); }
.step:not(.on) .ic { opacity: 0.4; }
.step.on li::before { background: var(--c-black); }
.joint { align-self: center; justify-self: center; width: 8px; height: 8px; background: var(--c-gray); transition: background 300ms; }
.joint.on { background: var(--c-orange); }
.loop { width: 100%; height: 50px; display: block; margin-top: 4px; }
.loop-path { fill: none; stroke: var(--c-mid-gray); stroke-width: 1.5; stroke-dasharray: 1200; stroke-dashoffset: 1200; transition: stroke-dashoffset 900ms ease; }
.loop-end { fill: var(--c-orange); opacity: 0; transition: opacity 300ms ease 800ms; }
.looped .loop-path { stroke-dashoffset: 0; }
.looped .loop-end { opacity: 1; }
.loop-label { text-align: center; font-weight: 500; font-size: 17px; margin-top: -2px; opacity: 0; transition: opacity 500ms ease 600ms; }
.looped .loop-label { opacity: 1; }
</style>
