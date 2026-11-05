<script setup lang="ts">
/** Inline customer name from headmatter, or the fallback text for open workshops. */
import { useWorkshop } from '../composables/useWorkshop'

defineProps<{ fallback?: string }>()
const { customer } = useWorkshop()
</script>

<template><span>{{ customer || fallback || '' }}</span></template>
