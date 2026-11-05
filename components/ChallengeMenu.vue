<script setup lang="ts">
/** One-page overview of every challenge, grouped by difficulty. */
import { computed } from 'vue'
import { useWorkshop } from '../composables/useWorkshop'
import type { Level } from '../locales/types'

const { t } = useWorkshop()
const list = computed(() => t.value.challenges.map((c, i) => ({ ...c, n: i + 1 })))
const levels: Level[] = [1, 2, 3]
</script>

<template>
  <div class="menu">
    <div v-for="lv in levels" :key="lv" class="col">
      <div class="head"><Difficulty :level="lv" /></div>
      <div v-for="c in list.filter(x => x.level === lv)" :key="c.id" class="item">
        <span class="n">{{ c.n }}.</span>
        <div>
          <div class="title">{{ c.title }} <span class="pts">{{ c.done.reduce((s, d) => s + d.points, 0) }}</span><span v-if="c.bonus" class="bn">+50%</span></div>
          <div class="goal">{{ c.goal }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.col { background: var(--c-sand); border: 0; border-radius: 0; padding: 16px 18px; }
.head { padding-bottom: 10px; margin-bottom: 6px; border-bottom: 1px solid var(--c-warm-light-gray); }
.item { display: grid; grid-template-columns: 34px 1fr; gap: 4px; padding: 6px 0; min-width: 0; }
.item > div { min-width: 0; }
.n { font-family: var(--font-display); font-size: 22px; color: var(--c-purple); line-height: 1.1; }
.title { font-size: 16px; line-height: 1.3; }
.pts { font-size: 11px; letter-spacing: 0.02em; padding: 1px 7px; border-radius: 0; background: var(--c-black); color: var(--c-white); vertical-align: 2px; margin-left: 4px; }
.bn { font-size: 11px; padding: 1px 7px; border-radius: 0; background: var(--c-green-100); color: var(--c-green-800); vertical-align: 2px; margin-left: 4px; }
.goal { font-size: 11.5px; color: var(--text-muted); line-height: 1.35; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
