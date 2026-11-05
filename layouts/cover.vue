<script setup lang="ts">
/** Template layout "Camunda 01 Cover": white, centred title and subtitle, brand dome with the white wordmark. */
import { useWorkshop } from '../composables/useWorkshop'

const { t, customer, presenter, presenterRole, eventDate } = useWorkshop()
defineProps<{ eyebrow?: string }>()
</script>

<template>
  <div class="slidev-layout cover">
    <img class="dome" src="/brand/cover-dome.png" alt="">
    <div class="logo"><CamundaLogo variant="white" :height="85" /></div>
    <div class="inner">
      <div class="label">{{ eyebrow || t.ui.openWorkshop }}<template v-if="customer"> · {{ t.ui.preparedFor }} {{ customer }}</template></div>
      <slot />
      <div v-if="presenter" class="who">
        {{ presenter }}<span v-if="presenterRole" class="muted"> · {{ presenterRole }}</span><span v-if="eventDate" class="muted"> · {{ eventDate }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cover { background: var(--c-white); padding: 0; }
.dome { position: absolute; left: 0; bottom: 0; width: 100%; height: 421px; object-fit: cover; object-position: center top; pointer-events: none; }
.logo { position: absolute; left: 50%; top: 580px; transform: translateX(-50%); }
.inner { position: relative; z-index: 1; padding: 56px 107px 0; text-align: center; }
.label { font-weight: 500; font-size: 16px; letter-spacing: 0.02em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 22px; }
.inner :deep(h1) { font-size: 80px; line-height: 1.05; margin: 0 auto 22px; max-width: 18ch; }
.inner :deep(p) { font-size: 28px; color: var(--text-muted); margin: 0 auto; max-width: 40ch; }
.who { margin-top: 26px; font-size: 20px; }
</style>
