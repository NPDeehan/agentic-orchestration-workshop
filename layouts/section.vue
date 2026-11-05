<script setup lang="ts">
/** Template layout "Camunda 02 Section divider": Sand grid background with the brand orb, white wordmark on the orb. */
defineProps<{ number?: string | number; eyebrow?: string; icon?: string; mix?: string }>()
</script>

<template>
  <div class="slidev-layout section">
    <img class="bg" src="/brand/section-bg.png" alt="">
    <div class="logo"><CamundaLogo variant="white" :height="35" /></div>
    <div class="inner">
      <div v-if="number !== undefined || icon || eyebrow" class="labelrow">
        <BrandIcon v-if="icon" :name="icon" :size="44" />
        <span class="label">
          <template v-if="number !== undefined">{{ String(number).padStart(2, '0') }}</template>
          <template v-if="number !== undefined && eyebrow"> · </template>
          <template v-if="eyebrow">{{ eyebrow }}</template>
        </span>
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.section { background: var(--c-sand); padding: 0; }
.bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.logo { position: absolute; left: 1148px; top: 656px; }
.inner { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; justify-content: center; padding: 0 80px 40px; }
.labelrow { display: flex; align-items: center; gap: 16px; margin-bottom: 22px; }
.label { font-weight: 500; font-size: 18px; letter-spacing: 0.02em; text-transform: uppercase; color: var(--text-muted); }
.inner :deep(h1) { font-size: 74px; line-height: 1.05; max-width: 16ch; margin: 0 0 24px; }
.inner :deep(p) { font-size: 28px; color: var(--text-muted); max-width: 36ch; margin: 0; }
.inner :deep(ul) { margin-top: 8px; }
</style>
