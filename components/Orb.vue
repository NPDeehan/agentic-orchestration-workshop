<script setup lang="ts">
/** Brand orb: soft orange/purple/green gradient form, always paired with the grid texture. */
withDefaults(defineProps<{
  x?: string
  y?: string
  size?: number
  mix?: 'all' | 'warm' | 'cool'
  grid?: boolean
}>(), { x: '78%', y: '50%', size: 620, mix: 'all', grid: true })
</script>

<template>
  <div class="orb-layer" aria-hidden="true">
    <div v-if="grid" class="grid-texture orb-grid" :style="{ '--ox': x, '--oy': y }" />
    <div
      class="orb"
      :class="mix"
      :style="{ left: x, top: y, width: `${size}px`, height: `${size}px` }"
    />
  </div>
</template>

<style scoped>
.orb-layer { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.orb-grid {
  -webkit-mask-image: radial-gradient(circle at var(--ox) var(--oy), #000 0, #000 22%, transparent 55%);
  mask-image: radial-gradient(circle at var(--ox) var(--oy), #000 0, #000 22%, transparent 55%);
}
.orb {
  position: absolute;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  filter: blur(36px);
  opacity: 0.95;
  background:
    radial-gradient(circle at 32% 34%, var(--c-orange-400) 0, transparent 52%),
    radial-gradient(circle at 70% 42%, var(--c-purple-400) 0, transparent 55%),
    radial-gradient(circle at 48% 74%, var(--c-green-400) 0, transparent 52%);
}
.orb.warm {
  background:
    radial-gradient(circle at 35% 40%, var(--c-orange-400) 0, transparent 55%),
    radial-gradient(circle at 65% 65%, var(--c-orange-200) 0, transparent 55%),
    radial-gradient(circle at 60% 30%, var(--c-purple-200) 0, transparent 50%);
}
.orb.cool {
  background:
    radial-gradient(circle at 38% 40%, var(--c-purple-400) 0, transparent 55%),
    radial-gradient(circle at 66% 62%, var(--c-green-400) 0, transparent 55%),
    radial-gradient(circle at 62% 28%, var(--c-purple-200) 0, transparent 50%);
}
</style>
