<script setup lang="ts">
/** Template layout "Camunda 28 Closing": like the cover, centred, brand dome with the white wordmark. */
</script>

<template>
  <div class="slidev-layout end">
    <img class="dome" src="/brand/cover-dome.png" alt="">
    <div class="logo"><CamundaLogo variant="white" :height="85" /></div>
    <div class="inner"><slot /></div>
  </div>
</template>

<style scoped>
.end { background: var(--c-white); padding: 0; }
.dome { position: absolute; left: 0; bottom: 0; width: 100%; height: 421px; object-fit: cover; object-position: center top; pointer-events: none; }
.logo { position: absolute; left: 50%; top: 580px; transform: translateX(-50%); }
.inner { position: relative; z-index: 1; padding: 170px 107px 0; text-align: center; }
.inner :deep(h1) { font-size: 80px; line-height: 1.05; margin: 0 auto 18px; }
.inner :deep(p) { font-size: 28px; color: var(--text-muted); margin: 0 auto; }
</style>
