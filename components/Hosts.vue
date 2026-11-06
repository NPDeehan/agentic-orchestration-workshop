<script setup lang="ts">
/**
 * Host slide. Reads host / coHost settings from the slides.md headmatter.
 * With no coHost it shows a single host; coHostPhoto empty shows an image placeholder.
 */
import { computed } from 'vue'
import { asset } from '../composables/asset'
import { useWorkshop } from '../composables/useWorkshop'

const { cfg, presenter, presenterRole } = useWorkshop()

const hosts = computed(() => {
  const list = [{ name: presenter.value, role: presenterRole.value, photo: asset(cfg.value.hostPhoto || '/images/people/presenter.png') }]
  const co = (cfg.value.coHost || '').trim()
  if (co) list.push({ name: co, role: cfg.value.coHostRole || '', photo: asset(cfg.value.coHostPhoto || '') })
  return list
})
</script>

<template>
  <div class="hosts" :class="{ single: hosts.length === 1 }">
    <div class="eyebrow">{{ hosts.length > 1 ? 'Your hosts' : 'Your host' }}</div>
    <div class="row">
      <div v-for="(h, i) in hosts" :key="h.name" class="host">
        <img v-if="h.photo" :src="h.photo" alt="" class="photo screenshot">
        <Placeholder v-else class="photo" height="340px" :label="`Photo: ${h.name}`" note="Head and shoulders, same crop as the other host photo." />
        <h2>{{ h.name }}</h2>
        <p class="role">{{ h.role }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hosts { height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; }
.row { display: flex; gap: 96px; margin-top: 22px; }
.host { width: 320px; }
.photo { display: block; width: 320px; height: 340px; object-fit: cover; object-position: 50% 15%; } /* portrait photos: keep the head in frame */
.host h2 { font-family: var(--font-display); font-weight: 400; font-size: 44px; line-height: 1.1; margin: 20px 0 4px; }
.role { font-size: 22px; color: var(--text-muted); margin: 0; }
.single .host { width: 400px; }
.single .photo { width: 400px; height: 440px; }
</style>
