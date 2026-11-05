<script setup lang="ts">
/**
 * Official logo files go in /brand (never recreate the logo):
 *   brand/camunda-logo-black.svg  (light backgrounds)
 *   brand/camunda-logo-white.svg  (dark or saturated backgrounds)
 * Until they are added, a neutral placeholder is shown.
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{ variant?: 'black' | 'white'; height?: number }>(), { variant: 'black', height: 22 })
const files = import.meta.glob('../brand/*.{svg,png}', { query: '?url', import: 'default', eager: true }) as Record<string, string>
const src = computed(() => {
  const want = Object.keys(files).find(k => k.includes(`logo-${props.variant}`))
    ?? Object.keys(files).find(k => k.includes('logo'))
  return want ? files[want] : ''
})
</script>

<template>
  <img v-if="src" :src="src" alt="Camunda" :style="{ height: `${height}px` }">
  <span v-else class="logo-placeholder" :style="{ height: `${height}px` }">logo</span>
</template>

<style scoped>
.logo-placeholder {
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  border: 1.5px dashed var(--c-gray);
  border-radius: 3px;
  font-size: 11px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--text-muted);
}
</style>
