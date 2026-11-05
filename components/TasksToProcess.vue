<script setup lang="ts">
/**
 * Emphasis slide: "Agents can automate tasks. Agentic orchestration automates the process."
 *  click 1: the scattered tasks snap into one connected, end-to-end process,
 *           and the second line lands with the emphasis.
 *  click 2: the last tasks lift into an AI agent sub-process: a sandbox with no fixed
 *           order, where the agent picks what to run. The first task stays a fixed step.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{
  at?: number
  tasks?: string[]
  lineOne?: string
  lineTwoLead?: string
  lineTwoKey?: string
  sandboxLabel?: string
  caption?: string
}>(), {
  at: 0,
  tasks: () => ['Check documents', 'Look up customer', 'Draft reply', 'Update CRM'],
  lineOne: 'Agents can automate tasks.',
  lineTwoLead: 'Agentic orchestration automates',
  lineTwoKey: 'the process.',
  sandboxLabel: 'AI agent',
  caption: 'The process stays in control. Inside its sandbox, the agent decides what to run.',
})

const { $clicks, $clicksContext } = useSlideContext()
const key = `t2p-${Math.random().toString(36).slice(2)}`
$clicksContext?.register(key, { max: props.at + 2, delta: 0 })
onBeforeUnmount(() => $clicksContext?.unregister(key))
const step = computed(() => Math.min(2, Math.max(0, ($clicks.value ?? 0) - props.at)))
const joined = computed(() => step.value >= 1)
const sandbox = computed(() => step.value >= 2)

// positions inside an 1150 x 230 stage
const scattered = [
  { x: 40, y: 20, r: -5 }, { x: 330, y: 120, r: 4 }, { x: 640, y: 10, r: -3 }, { x: 920, y: 110, r: 6 },
]
// evenly spaced between the start event (ends at 62px) and the end event (starts at 1084px)
const inLine = [{ x: 110, y: 70 }, { x: 360, y: 70 }, { x: 610, y: 70 }, { x: 860, y: 70 }]
// first task stays a fixed step; the rest float, unconnected, inside the agent box
const inSandbox = [{ x: 120, y: 70 }, { x: 420, y: 56 }, { x: 625, y: 92 }, { x: 830, y: 62 }]

const style = (i: number) => {
  const p = sandbox.value ? { ...inSandbox[i], r: 0 } : joined.value ? { ...inLine[i], r: 0 } : scattered[i]
  const delay = sandbox.value ? (i === 0 ? 0 : 150 + i * 90) : i * 70
  return { transform: `translate(${p.x}px, ${p.y}px) rotate(${p.r}deg)`, transitionDelay: `${delay}ms` }
}

// inside the sandbox, tools light up in a changing order
const lit = ref(1)
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  timer = setInterval(() => {
    let n = lit.value
    while (n === lit.value) n = 1 + Math.floor(Math.random() * (props.tasks.length - 1))
    lit.value = n
  }, 850)
})
onBeforeUnmount(() => timer && clearInterval(timer))
</script>

<template>
  <div class="t2p" :class="{ joined, sandbox }">
    <div class="one display">{{ lineOne }}</div>

    <div class="stage">
      <!-- sequence flow, in the same px units as the tasks so it always meets both events -->
      <div class="track" />
      <div class="ev start" />
      <div class="ev end" />

      <div class="agent">
        <span class="agent-lbl">{{ sandboxLabel }}</span>
        <span class="llm">LLM decides</span>
        <span class="tilde">~</span>
      </div>

      <div
        v-for="(tsk, i) in tasks" :key="tsk"
        class="task" :class="{ tool: i > 0, lit: sandbox && i === lit }"
        :style="style(i)"
      >
        <span class="spark" />
        <span>{{ tsk }}</span>
      </div>
    </div>

    <div class="two display">
      {{ lineTwoLead }} <span class="key">{{ lineTwoKey }}</span>
    </div>
    <div class="caption">{{ caption }}</div>
  </div>
</template>

<style scoped>
.t2p { position: relative; }
.one { font-size: 44px; line-height: 1.1; margin: 0 0 10px; transition: color 500ms, font-size 500ms; }
.joined .one { color: var(--text-muted); font-size: 34px; }

.stage { position: relative; height: 230px; margin: 6px 0 18px; }
.track {
  position: absolute; left: 60px; width: 1026px; top: 109px; height: 2.5px;
  background: var(--c-black);
  transform: scaleX(0); transform-origin: left center;
  transition: transform 900ms ease 250ms;
}
.joined .track { transform: scaleX(1); }

.ev {
  position: absolute; top: 92px; width: 36px; height: 36px; border-radius: 50%;
  border: 2.5px solid var(--c-black); background: var(--c-white);
  opacity: 0; transform: scale(0.6); transition: all 400ms ease;
}
.ev.start { left: 26px; }
.ev.end { left: 1084px; border-width: 5px; }
.joined .ev { opacity: 1; transform: none; transition-delay: 900ms; }
.sandbox .ev { transition-delay: 0ms; }

/* the agent sub-process: covers the line, so the tools inside have no connections */
.agent {
  position: absolute; left: 380px; top: 8px; width: 660px; height: 214px;
  border: 2px solid var(--c-purple); border-radius: 14px; background: var(--c-purple-50);
  opacity: 0; transform: scale(0.94); transition: opacity 450ms ease, transform 450ms ease;
  pointer-events: none;
}
.sandbox .agent { opacity: 1; transform: none; }
.agent-lbl { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); font-size: 12px; letter-spacing: 0.02em; text-transform: uppercase; color: var(--c-purple-700); }
.llm { position: absolute; top: -12px; right: 18px; font-size: 11px; letter-spacing: 0.02em; text-transform: uppercase; padding: 3px 10px; border-radius: 0; background: var(--c-purple); color: var(--c-white); }
.tilde { position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); font-size: 20px; line-height: 1; }

.task {
  position: absolute; left: 0; top: 0; width: 170px; height: 80px; z-index: 2;
  display: flex; flex-direction: column; justify-content: center; gap: 6px; padding: 0 16px;
  background: var(--c-white); border: 1.5px solid var(--c-gray); border-radius: 10px;
  font-size: 16px; line-height: 1.2;
  transition: transform 750ms cubic-bezier(.2,.8,.2,1), border-color 300ms, background 300ms;
}
.spark { width: 10px; height: 10px; background: var(--c-purple); }
.joined .task { border-color: var(--c-black); }
.sandbox .task.tool { border-color: var(--c-purple-400); }
.sandbox .task.lit { border-color: var(--c-success); background: var(--c-green-100); }

.two { font-size: 64px; line-height: 1.05; margin: 0; opacity: 0; transform: translateY(14px); transition: all 600ms ease 700ms; }
.joined .two { opacity: 1; transform: none; }
.key { background: var(--c-green-400); padding: 0 0.12em 0.04em; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
.caption { font-size: 22px; color: var(--text-muted); margin-top: 14px; opacity: 0; transform: translateY(8px); transition: all 500ms ease 500ms; }
.sandbox .caption { opacity: 1; transform: none; }
</style>
