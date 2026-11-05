<script setup lang="ts">
/** Click to start or pause. Double-click to reset. */
import { computed, onBeforeUnmount, ref } from 'vue'
import { useWorkshop } from '../composables/useWorkshop'

const props = withDefaults(defineProps<{ minutes?: number }>(), { minutes: 60 })
const { t } = useWorkshop()
const left = ref(props.minutes * 60)
const running = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

function toggle() {
  running.value = !running.value
  if (running.value) timer = setInterval(() => { left.value = Math.max(0, left.value - 1); if (!left.value) stop() }, 1000)
  else stop()
}
function stop() { running.value = false; if (timer) clearInterval(timer) }
function reset() { stop(); left.value = props.minutes * 60 }
onBeforeUnmount(stop)

const mm = computed(() => String(Math.floor(left.value / 60)).padStart(2, '0'))
const ss = computed(() => String(left.value % 60).padStart(2, '0'))
</script>

<template>
  <button class="cd" :class="{ running, over: left === 0 }" @click="toggle" @dblclick="reset">
    <span class="digits">{{ mm }}:{{ ss }}</span>
    <span class="xs muted">{{ left === 0 ? t.ui.timeUp : t.ui.minutesLeft }}</span>
  </button>
</template>

<style scoped>
.cd { display: inline-flex; flex-direction: column; align-items: flex-start; background: none; border: 0; padding: 0; cursor: pointer; color: inherit; font: inherit; }
.digits { font-family: var(--font-display); font-size: 150px; line-height: 0.95; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
.cd:not(.running) .digits { color: var(--c-mid-gray); }
.cd.over .digits { color: var(--c-orange-600); }
.xs { text-transform: uppercase; letter-spacing: 0.02em; margin-top: 8px; }
</style>
