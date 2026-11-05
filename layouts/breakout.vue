<script setup lang="ts">
/** Moments away from the deck (live demo, live build, timers): section background with a blocked-out headline. */
defineProps<{ eyebrow?: string }>()
</script>

<template>
  <div class="slidev-layout breakout">
    <img class="bg" src="/brand/section-bg.png" alt="">
    <div class="logo"><CamundaLogo variant="white" :height="35" /></div>
    <div class="inner">
      <div v-if="eyebrow" class="chip-dark">{{ eyebrow }}</div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.breakout { background: var(--c-sand); padding: 0; }
.bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.logo { position: absolute; left: 1148px; top: 656px; }
.inner { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: 0 80px 40px; }
.chip-dark { margin-bottom: 26px; }
.inner :deep(h1) { font-size: 92px; max-width: 14ch; margin: 0 0 26px; }
.inner :deep(h1 span) { background: var(--c-white); padding: 0 0.16em 0.1em; box-decoration-break: clone; -webkit-box-decoration-break: clone; line-height: 1.3; }
.inner :deep(p) { font-size: 24px; background: var(--c-white); padding: 10px 16px; max-width: 40ch; margin: 0; }
</style>
