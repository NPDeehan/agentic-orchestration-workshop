<script setup lang="ts">
/** Camunda brand line icon from public/icons (purple stroke, 32px grid). */
import { asset } from '../composables/asset'

withDefaults(defineProps<{ name: string; size?: number }>(), { size: 36 })
</script>

<template>
  <img :src="asset(`/icons/${name}.svg`)" :width="size" :height="size" alt="" class="brand-icon">
</template>

<style scoped>
.brand-icon { display: block; flex: none; }
</style>
