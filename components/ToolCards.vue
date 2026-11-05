<script setup lang="ts">
/** All connectors available in the workshop, grouped by domain. Click a tool to see its operations and inputs. */
import { ref } from 'vue'
import { useWorkshop } from '../composables/useWorkshop'

const props = defineProps<{ open?: string }>()
const { t } = useWorkshop()
const selected = ref<string | undefined>(props.open)
const toggle = (k: string) => { selected.value = selected.value === k ? undefined : k }
const toneVar = (tone: string) => (tone === 'green' ? 'var(--c-green-600)' : `var(--c-${tone})`)
</script>

<template>
  <div class="tools">
    <div v-for="d in t.domains" :key="d.key" class="col">
      <div class="dhead">
        <BrandIcon v-if="d.icon" :name="d.icon" :size="30" />
        <div class="eyebrow" :style="{ '--marker': toneVar(d.tone) }">{{ d.title }}</div>
      </div>
      <button
        v-for="tool in d.tools" :key="tool.key"
        class="tool card"
        :class="{ open: selected === tool.key }"
        @click="toggle(tool.key)"
      >
        <div class="row">
          <span class="name">{{ tool.name }}</span>
          <span v-if="tool.phase1" class="tag p1">{{ t.ui.phase1 }}</span>
        </div>
        <div class="desc">{{ tool.text }}</div>
        <div v-if="selected === tool.key" class="more">
          <div v-if="tool.ops" class="xs"><span class="muted">{{ t.ui.operations }}:</span> {{ tool.ops.join(', ') }}</div>
          <div class="xs"><span class="muted">{{ t.ui.inputs }}:</span> <code v-for="i in tool.inputs" :key="i">{{ i }}</code></div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.tools { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
.col { display: flex; flex-direction: column; gap: 10px; }
.dhead { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.dhead .eyebrow { margin: 0; }
.tool { text-align: left; padding: 14px 16px; cursor: pointer; font: inherit; color: inherit; transition: border-color 200ms; }
.tool { border: 1.5px solid transparent !important; }
.tool:hover { border-color: var(--c-purple-200) !important; }
.tool.open { border-color: var(--c-purple) !important; background: var(--c-white); }
.row { display: flex; justify-content: space-between; gap: 8px; align-items: flex-start; }
.name { font-size: 17px; line-height: 1.3; }
.desc { font-size: 13.5px; color: var(--text-muted); margin-top: 4px; line-height: 1.4; }
.p1 { font-size: 10px; padding: 2px 7px; background: var(--c-green-400); border-color: transparent; }
.more { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--line); display: grid; gap: 6px; }
.more code { display: inline-block; margin: 2px 4px 2px 0; font-size: 11px !important; }
</style>
