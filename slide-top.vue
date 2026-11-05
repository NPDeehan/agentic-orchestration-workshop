<script setup lang="ts">
/**
 * Template footer: only the black wordmark, bottom right (57.7 x 19.7 pt at 645.7, 369 pt).
 * Cover, closing, section and breakout layouts place their own white wordmark.
 */
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import CamundaLogo from './components/CamundaLogo.vue'

const { $frontmatter } = useSlideContext()
const show = computed(() => !['cover', 'end', 'section', 'breakout'].includes($frontmatter?.layout))
</script>

<template>
  <div v-if="show" class="deck-logo"><CamundaLogo :height="35" /></div>
</template>

<style scoped>
.deck-logo { position: absolute; left: 1148px; top: 656px; line-height: 0; }
</style>
