<script setup lang="ts">
/**
 * Simulated agent run: a trace that reveals one event per click.
 * kind: user | agent | tool | result | guard | human | done
 */
import { computed, onBeforeUnmount } from 'vue'
import { useSlideContext } from '@slidev/client'
import { useWorkshop } from '../composables/useWorkshop'

interface Ev { kind: 'user' | 'agent' | 'tool' | 'result' | 'guard' | 'human' | 'done'; text: string; detail?: string }
const props = withDefaults(defineProps<{ events: Ev[]; at?: number; title?: string }>(), { at: 0 })
const { t } = useWorkshop()

const { $clicks, $clicksContext } = useSlideContext()
const key = `run-${Math.random().toString(36).slice(2)}`
$clicksContext?.register(key, { max: props.at + props.events.length - 1, delta: 0 })
onBeforeUnmount(() => $clicksContext?.unregister(key))
const shown = computed(() => Math.max(1, ($clicks.value ?? 0) - props.at + 1))

const label: Record<Ev['kind'], string> = {
  user: 'User', agent: 'Agent', tool: 'Tool call', result: 'Result', guard: 'Guardrail', human: 'Human', done: 'Outcome',
}
</script>

<template>
  <div class="run">
    <div class="eyebrow purple">{{ title || t.ui.runTitle }}</div>
    <div class="trace">
      <div v-for="(e, i) in events" :key="i" class="ev" :class="[e.kind, { hidden: i >= shown, latest: i === shown - 1 }]">
        <span class="k">{{ label[e.kind] }}</span>
        <div>
          <div class="txt">{{ e.text }}</div>
          <code v-if="e.detail" class="det">{{ e.detail }}</code>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trace { display: flex; flex-direction: column; gap: 8px; }
.ev {
  display: grid; grid-template-columns: 96px 1fr; gap: 12px; align-items: start;
  background: var(--c-sand); border: 1.5px solid transparent; border-radius: 0; padding: 9px 14px;
  transition: opacity 300ms, transform 300ms;
}
.ev.hidden { opacity: 0; transform: translateY(6px); }
.ev.latest { border-color: var(--c-black); }
.k { font-size: 11px; text-transform: uppercase; letter-spacing: 0.02em; padding-top: 4px; color: var(--text-muted); }
.ev .k::before { content: ''; display: inline-block; width: 8px; height: 8px; margin-right: 6px; background: var(--c-gray); }
.ev.user .k::before { background: var(--c-black); }
.ev.agent .k::before { background: var(--c-purple); }
.ev.tool .k::before, .ev.result .k::before { background: var(--c-green-600); }
.ev.guard .k::before { background: var(--c-orange); }
.ev.human .k::before { background: var(--c-orange-600); }
.ev.done .k::before { background: var(--c-success); }
.ev.guard { background: var(--c-orange-50); border-color: var(--c-orange-200); }
.txt { font-size: 16px; line-height: 1.35; }
.det { display: inline-block; margin-top: 4px; font-size: 12px !important; }
</style>
