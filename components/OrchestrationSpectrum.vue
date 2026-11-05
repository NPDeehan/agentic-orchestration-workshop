<script setup lang="ts">
/**
 * Template layout "Camunda 07 Three-column comparison": fully deterministic | agentic | fully dynamic.
 * Clicks: 1 deterministic, 2 dynamic, 3 the blend in the middle.
 */
import { computed, onBeforeUnmount } from 'vue'
import { useSlideContext } from '@slidev/client'
import { useWorkshop } from '../composables/useWorkshop'

const props = withDefaults(defineProps<{ at?: number }>(), { at: 0 })
const { t } = useWorkshop()
const s = computed(() => t.value.spectrum)

const { $clicks, $clicksContext } = useSlideContext()
const key = `spectrum-${Math.random().toString(36).slice(2)}`
$clicksContext?.register(key, { max: props.at + 3, delta: 0 })
onBeforeUnmount(() => $clicksContext?.unregister(key))
const step = computed(() => Math.max(0, ($clicks.value ?? 0) - props.at))
</script>

<template>
  <div class="cols">
    <div class="card outline-green col" :class="{ show: step >= 1 }">
      <div class="lbl">{{ s.deterministic.label }}</div>
      <div class="ttl display">{{ s.deterministic.title }}</div>
      <p>{{ s.deterministic.text }}</p>
      <ul class="tight bullets-green"><li v-for="x in s.deterministic.examples" :key="x">{{ x }}</li></ul>
    </div>

    <div class="card outline-purple col mid" :class="{ show: step >= 3 }">
      <span class="meet">Meet</span>
      <div class="lbl">{{ s.agentic.label }}</div>
      <div class="ttl display">{{ s.agentic.title }}</div>
      <p>{{ s.agentic.text }}</p>
      <ul class="tight bullets-purple"><li v-for="x in s.agentic.examples" :key="x">{{ x }}</li></ul>
    </div>

    <div class="card outline-orange col" :class="{ show: step >= 2 }">
      <div class="lbl">{{ s.dynamic.label }}</div>
      <div class="ttl display">{{ s.dynamic.title }}</div>
      <p>{{ s.dynamic.text }}</p>
      <ul class="tight bullets-orange"><li v-for="x in s.dynamic.examples" :key="x">{{ x }}</li></ul>
    </div>
  </div>
</template>

<style scoped>
.cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.col { position: relative; min-height: 0; padding: 16px 26px 18px; opacity: 0; transform: translateY(12px); transition: opacity 450ms ease, transform 450ms ease; }
.col.show { opacity: 1; transform: none; }
.mid.show { background: var(--c-purple-50); }
.lbl { font-weight: 500; font-size: 16px; letter-spacing: 0.02em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; }
.ttl { font-size: 30px; line-height: 1.15; margin-bottom: 12px; }
.col p { font-size: 19px; line-height: 1.4; color: var(--text-muted); margin: 0 0 16px; min-height: 4.2em; }
.col li { font-size: 18px; }
.meet { position: absolute; top: -14px; left: 28px; background: var(--c-black); color: var(--c-white); font-size: 12px; letter-spacing: 0.02em; text-transform: uppercase; padding: 4px 12px; }
</style>
