<script setup lang="ts">
/** Overview of every agentic pattern. Each card jumps to that pattern's slide. */
import { computed } from 'vue'
import { patternAlias, useSlideLink } from '../composables/useSlideLink'
import { useWorkshop } from '../composables/useWorkshop'

const { t } = useWorkshop()
const list = computed(() => t.value.patterns)
const { find, goTo } = useSlideLink()
</script>

<template>
  <div class="grid-4 pattern-menu">
    <component
      :is="find(patternAlias(p.id)) ? 'button' : 'div'"
      v-for="p in list" :key="p.id" class="card item"
      :title="find(patternAlias(p.id)) ? 'Open this pattern' : undefined"
      @click="goTo(patternAlias(p.id))"
    >
      <BrandIcon :name="p.icon" :size="36" style="margin-bottom:10px" />
      <h3>{{ p.title }}</h3>
      <p>{{ p.short }}</p>
    </component>
  </div>
</template>

<style scoped>
.pattern-menu .item { min-height: 130px; }
/* clickable cards: reset button styles, then a quiet hover */
button.item { display: block; width: 100%; font: inherit; color: inherit; text-align: left; cursor: pointer; transition: background 150ms; }
button.item:hover { background: var(--c-white); }
button.item:hover h3 { text-decoration: underline; text-decoration-color: var(--c-orange); text-underline-offset: 3px; }
button.item:focus-visible { outline: 2px solid var(--c-purple); outline-offset: -2px; }
</style>
