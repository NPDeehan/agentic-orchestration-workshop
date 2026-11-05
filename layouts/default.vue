<script setup lang="ts">
/**
 * Content slide. Frontmatter:
 *   eyebrow   small caps label above the title
 *   center    true to centre title and subtitle (template grid, stat and comparison layouts)
 *   bg        'sand' for a Sand slide (template split statement and icon list)
 */
defineProps<{ eyebrow?: string; center?: boolean; bg?: string }>()
</script>

<template>
  <div class="slidev-layout default" :class="{ 'title-center': center, 'bg-sand': bg === 'sand' }">
    <div v-if="eyebrow" class="eyebrow">{{ eyebrow }}</div>
    <slot />
  </div>
</template>

<style scoped>
.bg-sand { background: var(--c-sand); }
</style>
