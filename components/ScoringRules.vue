<script setup lang="ts">
/** "How you are scored": point levels as template stat tiles, then the rules as an icon list. */
import { computed } from 'vue'
import { useWorkshop } from '../composables/useWorkshop'
import type { Level } from '../locales/types'

const { t } = useWorkshop()
const s = computed(() => t.value.scoring)
const levels: { lv: Level; tone: string }[] = [{ lv: 1, tone: 'green' }, { lv: 2, tone: 'purple' }, { lv: 3, tone: 'orange' }]
</script>

<template>
  <div class="scoring">
    <div class="levels">
      <div v-for="l in levels" :key="l.lv" class="tile lvtile" :class="l.tone">
        <Difficulty :level="l.lv" class="dif" />
        <div><span class="num">{{ s.levels[l.lv] }}</span> <span class="lbl">points</span></div>
      </div>
    </div>
    <div class="rules">
      <div v-for="(r, i) in s.rules" :key="r.title" v-click="i + 1" class="rule">
        <BrandIcon :name="r.icon" :size="34" />
        <div>
          <h3>{{ r.title }}</h3>
          <p>{{ r.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scoring { display: grid; grid-template-columns: 300px 1fr; gap: 44px; margin-top: 4px; }
.levels { display: grid; gap: 12px; align-content: start; }
.lvtile { min-height: 0; padding: 14px 18px 12px; gap: 6px; }
.lvtile .num { font-size: 60px; }
.dif :deep(.sq) { border-color: var(--c-black) !important; }
.dif :deep(.sq.on) { background: var(--c-black) !important; }
.rules { display: grid; gap: 0; }
.rule { display: grid; grid-template-columns: 40px 1fr; gap: 16px; align-items: start; padding: 12px 0; border-top: 1px solid var(--line); }
.rule:first-child { border-top: 0; padding-top: 0; }
.rule h3 { font-weight: 500; font-size: 20px; margin: 2px 0 2px; }
.rule p { font-size: 17px; color: var(--text-muted); margin: 0; max-width: 64ch; }
</style>
