<script setup lang="ts">
/** Full challenge card. Content lives in locales/<lang>.ts so it can be translated and reordered. */
import { computed } from 'vue'
import { useSlideLink } from '../composables/useSlideLink'
import { useWorkshop } from '../composables/useWorkshop'

const props = defineProps<{ id: string }>()
const { t, toolName } = useWorkshop()
const idx = computed(() => t.value.challenges.findIndex(c => c.id === props.id))
const c = computed(() => t.value.challenges[idx.value])
const { find, goTo } = useSlideLink()
const hasMenu = computed(() => !!find('challenges'))
const total = computed(() => c.value?.done.reduce((s, d) => s + d.points, 0) ?? 0)
</script>

<template>
  <div v-if="c" class="ch">
    <div class="left">
      <div class="top">
        <span class="eyebrow" style="margin:0">Challenge {{ idx + 1 }}</span>
        <Difficulty :level="c.level" />
        <span class="pts-total">{{ total }} points</span>
      </div>
      <h1>{{ c.title }}</h1>
      <p class="lead">{{ c.goal }}</p>

      <div class="eyebrow purple" style="margin-top:12px">{{ t.ui.tryPrompts }}</div>
      <div v-for="p in c.prompts" :key="p" class="prompt">“{{ p }}”</div>

      <button v-if="hasMenu" class="back ch-back" @click="goTo('challenges')">← Challenge menu</button>
    </div>

    <div class="right">
      <div class="card">
        <div class="eyebrow green">{{ t.ui.doneWhen }}</div>
        <ul class="tight small crit"><li v-for="d in c.done" :key="d.text"><span>{{ d.text }}</span><b>{{ d.points }}</b></li></ul>
        <div v-if="c.bonus" class="bonus"><BrandIcon name="guardrails-policy-enforcement" :size="22" />{{ t.scoring.bonusLabel }}</div>
      </div>
      <div class="meta">
        <div>
          <div class="xs muted label">{{ t.ui.connectors }}</div>
          <div class="chips">
            <span v-for="k in c.connectors" :key="k" class="tag">{{ toolName(k) }}</span>
            <span v-if="!c.connectors.length" class="tag">{{ t.ui.connectorsNone }}</span>
          </div>
        </div>
        <div>
          <div class="xs muted label">{{ t.ui.practice }}</div>
          <div class="small">{{ c.practice.join(' · ') }}</div>
        </div>
      </div>
      <div v-if="c.hint" v-click class="hint">
        <span class="xs label">{{ t.ui.hint }}</span>
        <span class="small">{{ c.hint }}</span>
      </div>
    </div>
  </div>
  <div v-else class="placeholder">Unknown challenge: {{ id }}</div>
</template>

<style scoped>
.ch { display: grid; grid-template-columns: 1.1fr 1fr; gap: 48px; height: 100%; }
.top { display: flex; align-items: center; gap: 18px; margin-bottom: 16px; }
.ch h1 { margin-bottom: 18px; }
.pts-total { margin-left: auto; font-size: 14px; letter-spacing: 0.02em; text-transform: uppercase; padding: 4px 12px; border-radius: 0; background: var(--c-black); color: var(--c-white); }
.crit li { display: grid; grid-template-columns: 1fr auto; gap: 14px; }
.crit b { font-weight: 400; font-family: var(--font-display); font-size: 22px; line-height: 1; color: var(--c-purple-700); }
.bonus { display: flex; align-items: center; gap: 10px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--line); font-size: 15px; color: var(--c-green-800); }
.prompt {
  background: var(--c-sand); border: 0; border-radius: 0;
  padding: 12px 16px 12px 40px; font-size: 19px; margin-bottom: 10px; max-width: 34ch; position: relative;
}
.left { display: flex; flex-direction: column; }
.back { margin-top: auto; align-self: flex-start; padding: 6px 0; border: 0; background: none; font: inherit; font-size: 14px; color: var(--c-mid-gray); cursor: pointer; text-decoration: underline; text-decoration-color: var(--c-orange); text-underline-offset: 4px; }
.back:hover { color: var(--c-black); }
.right { display: flex; flex-direction: column; gap: 18px; padding-top: 8px; }
.meta { display: grid; gap: 14px; }
.label { text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 6px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.prompt::before { content: ''; position: absolute; left: 16px; top: 1.05em; width: 10px; height: 10px; background: var(--c-purple); }
.hint { display: grid; gap: 4px; background: var(--c-orange-50); border: 0; border-radius: 0; padding: 12px 16px; }
</style>

<style>
/* Unscoped on purpose: a scoped ":global(html.print) .back" compiles to "html.print" and hides the
   whole page in print/export mode. The back link is no use in the PDF, so hide just that. */
html.print .ch-back { display: none; }
</style>
