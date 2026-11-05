<script setup lang="ts">
/** Two columns. Left: default slot. Right: `::right::` slot. */
withDefaults(defineProps<{ eyebrow?: string; ratio?: string; align?: string }>(), { ratio: '1fr 1fr', align: 'start' })
</script>

<template>
  <div class="slidev-layout split">
    <div class="cols" :style="{ gridTemplateColumns: ratio, alignItems: align }">
      <div class="col">
        <div v-if="eyebrow" class="eyebrow">{{ eyebrow }}</div>
        <slot />
      </div>
      <div class="col right"><slot name="right" /></div>
    </div>
  </div>
</template>

<style scoped>
.cols { display: grid; gap: 48px; height: 100%; }
.col { min-width: 0; min-height: 0; }
.right { height: 100%; display: flex; flex-direction: column; }
.cols[style*="center"] .right { justify-content: center; }
</style>
