<script setup lang="ts">
/** Marks where a permanent image goes in iteration 2. Search the repo for <Placeholder to find them all. */
import { useWorkshop } from '../composables/useWorkshop'

defineProps<{ label: string; note?: string; height?: string }>()
const { t } = useWorkshop()
</script>

<template>
  <div class="placeholder" :style="{ height: height || '100%' }">
    <span class="xs" style="text-transform:uppercase;letter-spacing:.02em">{{ t.ui.imagePlaceholder }}</span>
    <strong style="background:none;color:var(--text)">{{ label }}</strong>
    <span v-if="note" class="xs">{{ note }}</span>
  </div>
</template>
