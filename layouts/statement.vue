<script setup lang="ts">
defineProps<{ eyebrow?: string }>()
</script>

<template>
  <div class="slidev-layout statement">
    <div class="inner">
      <div v-if="eyebrow" class="eyebrow">{{ eyebrow }}</div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.inner { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; justify-content: center; }
.inner :deep(h1) { font-size: 74px; max-width: 18ch; }
.inner :deep(p) { font-size: 27px; color: var(--text-muted); max-width: 40ch; }
</style>
