<script setup lang="ts">
/**
 * One agentic pattern: a click-through walk of the real BPMN model, captioned.
 * Content (including the steps) lives in locales/<lang>.ts; the model lives in bpmn/Patterns/.
 */
import { computed } from 'vue'
import { useSlideLink } from '../composables/useSlideLink'
import { useWorkshop } from '../composables/useWorkshop'

const props = defineProps<{ id: string }>()
const { t } = useWorkshop()
const p = computed(() => t.value.patterns.find(x => x.id === props.id))
const { find, goTo } = useSlideLink()
const hasMenu = computed(() => !!find('patterns'))

/** step 0 of the tour falls back to the pattern's own one-liner and description */
const steps = computed(() => {
  const pat = p.value
  if (!pat) return []
  return pat.steps?.length ? pat.steps : [{ title: pat.short, text: pat.text }]
})
</script>

<template>
  <div v-if="p" class="pat">
    <div class="pat-head">
      <div class="eyebrow">{{ t.ui.pattern }}</div>
      <h1>{{ p.title }}</h1>
      <button v-if="hasMenu" class="back pat-back" @click="goTo('patterns')">← {{ t.ui.patternMenu }}</button>
    </div>
    <DiagramTour :diagram="p.diagram" :steps="steps" layout="fill" height="100%" />
  </div>
  <div v-else class="placeholder">Unknown pattern: {{ id }}</div>
</template>

<style scoped>
.pat { display: grid; grid-template-rows: auto minmax(0, 1fr); gap: 14px; height: 100%; min-height: 0; }
.pat-head { display: flex; align-items: baseline; gap: 20px; flex-wrap: wrap; }
.pat-head .eyebrow { margin: 0; }
/* compact title: the diagram needs the height more than the heading does */
.pat h1 { font-size: 38px; line-height: 1.05; margin: 0; flex: 1 1 auto; }
.back { padding: 6px 0; border: 0; background: none; font: inherit; font-size: 14px; color: var(--c-mid-gray); cursor: pointer; text-decoration: underline; text-decoration-color: var(--c-orange); text-underline-offset: 4px; }
.back:hover { color: var(--c-black); }
</style>

<style>
/* Unscoped on purpose, for the same reason as ChallengeDetail's back link: a scoped
   ":global(html.print)" rule would hide the whole page in print/export mode. */
html.print .pat-back { display: none; }
</style>
