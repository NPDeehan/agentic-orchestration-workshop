<script setup lang="ts">
/**
 * A guided walk through a BPMN diagram. Each click focuses part of the diagram and
 * shows a caption explaining it. steps[0] is the intro state (before any click).
 *
 *   <DiagramTour diagram="invoice-deterministic" :steps="[
 *     { title: 'Every path is designed up front', text: '...' },
 *     { focus: ['categorize'], title: 'Rules decide', text: '...', icon: 'decision-monitoring' },
 *   ]" />
 */
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

interface TourStep {
  title: string
  text?: string
  icon?: string
  focus?: string[]
  tone?: 'purple' | 'orange' | 'green'
  badges?: Record<string, string>
  sequence?: string[]
  reveal?: string[]
  active?: string[]
}

const props = withDefaults(defineProps<{
  diagram: string
  steps: TourStep[]
  height?: string
  layout?: 'below' | 'side'
  at?: number
}>(), { height: '380px', layout: 'below', at: 0 })

const { $clicks } = useSlideContext()
const idx = computed(() => Math.max(0, Math.min(props.steps.length - 1, ($clicks.value ?? 0) - props.at)))
const step = computed(() => props.steps[idx.value])
const diagramSteps = computed(() => props.steps.map(({ focus, tone, badges, sequence, reveal, active }) => ({ focus, tone, badges, sequence, reveal, active })))
</script>

<template>
  <div class="tour" :class="layout">
    <BpmnDiagram :diagram="diagram" :steps="diagramSteps" :height="height" :at="at" />
    <div class="caption">
      <div class="dots">
        <span v-for="(s, i) in steps" :key="i" class="dot" :class="{ on: i === idx, done: i < idx }" />
      </div>
      <Transition name="cap" mode="out-in">
        <div :key="idx" class="cap-body">
          <BrandIcon v-if="step.icon" :name="step.icon" :size="40" />
          <div>
            <div class="cap-title display">{{ step.title }}</div>
            <div v-if="step.text" class="cap-text">{{ step.text }}</div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.tour.below { display: grid; grid-template-rows: auto auto; gap: 18px; }
.tour.side { display: grid; grid-template-columns: 1.7fr 1fr; gap: 32px; align-items: center; }
.caption { display: grid; gap: 12px; }
.dots { display: flex; gap: 6px; }
.dot { width: 22px; height: 4px; background: var(--c-warm-light-gray); transition: background 300ms; }
.dot.done { background: var(--c-purple-200); }
.dot.on { background: var(--c-orange); }
.cap-body { display: flex; gap: 18px; align-items: flex-start; min-height: 86px; }
.cap-title { font-size: 32px; line-height: 1.1; margin-bottom: 6px; }
.cap-text { font-size: 19px; color: var(--text-muted); max-width: 62ch; line-height: 1.4; }
.cap-enter-active, .cap-leave-active { transition: opacity 220ms ease, transform 220ms ease; }
.cap-enter-from { opacity: 0; transform: translateY(8px); }
.cap-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
