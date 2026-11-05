<script setup lang="ts">
/** Difficulty shown as filled squares plus a text label, so it never relies on colour alone. */
import { computed } from 'vue'
import { useWorkshop } from '../composables/useWorkshop'
import type { Level } from '../locales/types'

const props = withDefaults(defineProps<{ level: Level; label?: boolean }>(), { label: true })
const { t } = useWorkshop()
const tone = computed(() => ({ 1: 'var(--c-green-600)', 2: 'var(--c-purple)', 3: 'var(--c-orange)' })[props.level])
</script>

<template>
  <span class="difficulty" :style="{ '--tone': tone }">
    <span v-for="i in 3" :key="i" class="sq" :class="{ on: i <= level }" />
    <span v-if="label" class="lbl">{{ t.ui.levels[level] }}</span>
  </span>
</template>

<style scoped>
.difficulty { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; letter-spacing: 0.02em; text-transform: uppercase; }
.sq { width: 10px; height: 10px; border: 1.5px solid var(--tone); }
.sq.on { background: var(--tone); }
.lbl { margin-left: 6px; }
</style>
