<script setup lang="ts">
/** One-page overview of every challenge, grouped by difficulty. Each item jumps to its challenge slide. */
import { computed } from 'vue'
import { challengeAlias, useSlideLink } from '../composables/useSlideLink'
import { useWorkshop } from '../composables/useWorkshop'
import type { Level } from '../locales/types'

const { t } = useWorkshop()
const list = computed(() => t.value.challenges.map((c, i) => ({ ...c, n: i + 1 })))
const levels: Level[] = [1, 2, 3]
const { find, goTo } = useSlideLink()
</script>

<template>
  <div class="menu">
    <div v-for="lv in levels" :key="lv" class="col">
      <div class="head"><Difficulty :level="lv" /></div>
      <component
        :is="find(challengeAlias(c.id)) ? 'button' : 'div'"
        v-for="c in list.filter(x => x.level === lv)" :key="c.id" class="item"
        :title="find(challengeAlias(c.id)) ? 'Open this challenge' : undefined"
        @click="goTo(challengeAlias(c.id))"
      >
        <span class="n">{{ c.n }}.</span>
        <div>
          <div class="title">{{ c.title }} <span class="pts">{{ c.done.reduce((s, d) => s + d.points, 0) }}</span><span v-if="c.bonus" class="bn">+50%</span></div>
          <div class="goal">{{ c.goal }}</div>
        </div>
      </component>
    </div>
  </div>
</template>

<style scoped>
.menu { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.col { background: var(--c-sand); border: 0; border-radius: 0; padding: 16px 18px; }
.head { padding-bottom: 10px; margin-bottom: 6px; border-bottom: 1px solid var(--c-warm-light-gray); }
.item { display: grid; grid-template-columns: 34px 1fr; gap: 4px; padding: 6px 0; min-width: 0; }
.item > div { min-width: 0; }
/* clickable items: reset button styles, then a quiet hover */
button.item { width: calc(100% + 16px); margin: 0 -8px; padding: 6px 8px; border: 0; background: none; font: inherit; color: inherit; text-align: left; cursor: pointer; transition: background 150ms; }
button.item:hover { background: var(--c-white); }
button.item:hover .title { text-decoration: underline; text-decoration-color: var(--c-orange); text-underline-offset: 3px; }
button.item:focus-visible { outline: 2px solid var(--c-purple); outline-offset: -2px; }
.n { font-family: var(--font-display); font-size: 22px; color: var(--c-purple); line-height: 1.1; }
.title { font-size: 16px; line-height: 1.3; }
.pts { display: inline-block; font-size: 11px; letter-spacing: 0.02em; padding: 1px 7px; border-radius: 0; background: var(--c-black); color: var(--c-white); vertical-align: 2px; margin-left: 4px; }
.bn { display: inline-block; font-size: 11px; padding: 1px 7px; border-radius: 0; background: var(--c-green-100); color: var(--c-green-800); vertical-align: 2px; margin-left: 4px; }
.goal { font-size: 11.5px; color: var(--text-muted); line-height: 1.35; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
