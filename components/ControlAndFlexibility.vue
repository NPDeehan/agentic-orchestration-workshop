<script setup lang="ts">
/**
 * "Deterministic where you need control. Dynamic where you need flexibility."
 *  step 0  deterministic: a token runs a fixed path
 *  step 1  dynamic: tools fire inside the agent in no fixed order
 *  step 2  merged: one process, the token hands off to the agent and comes back
 *  step 3  the payoff
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{ at?: number }>(), { at: 0 })
const { $clicks, $clicksContext } = useSlideContext()
const key = `cf-${Math.random().toString(36).slice(2)}`
$clicksContext?.register(key, { max: props.at + 3, delta: 0 })
onBeforeUnmount(() => $clicksContext?.unregister(key))
const step = computed(() => Math.max(0, ($clicks.value ?? 0) - props.at))

const dynTools = ['Get account', 'Contact rep', 'Check policy', 'Draft reply', 'Search docs', 'Update CRM']
const mergedTools = ['Get account', 'Contact rep', 'Draft reply']
const litA = ref(0)
const litB = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  timer = setInterval(() => {
    let n = litA.value
    while (n === litA.value) n = Math.floor(Math.random() * dynTools.length)
    litA.value = n
    let m = litB.value
    while (m === litB.value) m = Math.floor(Math.random() * mergedTools.length)
    litB.value = m
  }, 750)
})
onBeforeUnmount(() => timer && clearInterval(timer))
</script>

<template>
  <div class="cf" :class="`s${Math.min(step, 3)}`">
    <!-- Stage A: the two halves -->
    <div class="stage-a">
      <div class="half det">
        <div class="eyebrow">Deterministic</div>
        <div class="line display">Deterministic where you need <span class="key orange">control.</span></div>
        <div class="vis card">
          <div class="rigid">
            <span class="ev" /><span class="ln" />
            <span class="bx">Validate</span><span class="ln" />
            <span class="gw" /><span class="ln" />
            <span class="bx">Approve</span><span class="ln" />
            <span class="bx">Pay</span><span class="ln" />
            <span class="ev end" />
            <span class="token" />
          </div>
          <div class="cap xs muted">Same path, every time</div>
        </div>
      </div>

      <div class="half dyn">
        <div class="eyebrow purple">Dynamic</div>
        <div class="line display">Dynamic where you need <span class="key purple">flexibility.</span></div>
        <div class="vis card">
          <div class="sandbox">
            <span class="llm">LLM decides</span>
            <span v-for="(tl, i) in dynTools" :key="tl" class="tool" :class="{ lit: i === litA }">{{ tl }}</span>
            <span class="tilde">~</span>
          </div>
          <div class="cap xs muted">Different tools, different order, every case</div>
        </div>
      </div>
    </div>

    <!-- Stage B: merged -->
    <div class="stage-b">
      <div class="eyebrow green">Agentic orchestration</div>
      <div class="merged card">
        <div class="mflow">
          <span class="ev" /><span class="ln" />
          <span class="bx">Receive</span><span class="ln" />
          <span class="gw" /><span class="ln" />
          <span class="agent">
            <span class="agent-lbl">AI agent</span>
            <span v-for="(tl, i) in mergedTools" :key="tl" class="tool" :class="{ lit: i === litB }">{{ tl }}</span>
            <span class="tilde">~</span>
          </span>
          <span class="ln" />
          <span class="bx">Resolve</span><span class="ln" />
          <span class="ev end" />
          <span class="token t2" />
        </div>
      </div>
      <div class="big display">Both, in <span class="key green">one process.</span></div>
      <div class="payoff">
        <div class="pay card">
          <BrandIcon name="people-human-task" :size="40" />
          <div><h3>No more manual case work</h3><p>Automates work that used to need human case management.</p></div>
        </div>
        <div class="pay card">
          <BrandIcon name="speed" :size="40" />
          <div><h3>Flexible straight-through processing</h3><p>Handles the exceptions that used to drop out to a person.</p></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cf { position: relative; height: 560px; }
.stage-a, .stage-b { position: absolute; inset: 0; transition: opacity 600ms ease, transform 600ms ease; }

/* ---------- Stage A ---------- */
.stage-a { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding-top: 30px; }
.half { transition: opacity 500ms ease, transform 500ms ease; }
.half.dyn { opacity: 0; transform: translateX(30px); }
.s1 .half.dyn, .s2 .half.dyn, .s3 .half.dyn { opacity: 1; transform: none; }
.s1 .half.det .line, .s1 .half.det .bx, .s1 .half.det .cap { color: var(--c-mid-gray); }
.s1 .half.det .key.orange { background: var(--c-warm-light-gray); }
.s1 .half.det .bx, .s1 .half.det .gw, .s1 .half.det .ev { border-color: var(--c-gray); }
.s1 .half.det .ln { background: var(--c-gray); }
.s2 .stage-a, .s3 .stage-a { opacity: 0; transform: translateY(-30px); pointer-events: none; }
.line { font-size: 46px; line-height: 1.08; min-height: 2.2em; margin-bottom: 22px; }
.key { padding: 0 0.1em 0.03em; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
.key.orange { background: var(--c-orange-200); }
.key.purple { background: var(--c-purple-200); }
.key.green { background: var(--c-green-400); }
.vis { height: 230px; display: flex; flex-direction: column; justify-content: center; gap: 18px; padding: 20px 22px; }
.cap { text-transform: uppercase; letter-spacing: 0.02em; text-align: center; }

/* BPMN-ish primitives */
.rigid, .mflow { position: relative; display: flex; align-items: center; }
.ev, .bx, .gw, .agent { position: relative; z-index: 2; }
.ev { width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--c-black); background: #fff; flex: none; }
.ev.end { border-width: 4px; }
.ln { flex: 1; height: 2px; background: var(--c-black); min-width: 10px; }
.bx { flex: none; padding: 14px 12px; border: 1.5px solid var(--c-black); border-radius: 8px; background: #fff; font-size: 14px; }
.gw { flex: none; width: 24px; height: 24px; border: 1.5px solid var(--c-black); background: #fff; transform: rotate(45deg); margin: 0 6px; }
.token {
  position: absolute; top: 50%; width: 16px; height: 16px; margin-top: -8px; border-radius: 50%;
  background: var(--c-orange); left: 0; z-index: 1; animation: run 3.2s linear infinite;
}
@keyframes run { from { left: 1%; } to { left: 96%; } }

.sandbox, .agent { display: grid; gap: 10px;
  border: 1.5px solid var(--c-black); border-radius: 10px; background: #fff;
}
.sandbox { position: relative; grid-template-columns: repeat(3, 1fr); padding: 30px 18px 22px; }
.tool {
  padding: 10px 8px; border: 1.5px solid var(--c-gray); border-radius: 7px; text-align: center; font-size: 13.5px;
  transition: all 250ms ease;
}
.tool.lit { border-color: var(--c-success); background: var(--c-green-100); transform: scale(1.06); }
.llm { position: absolute; top: -12px; right: 14px; font-size: 11px; letter-spacing: 0.02em; text-transform: uppercase; padding: 3px 10px; border-radius: 0; background: var(--c-purple); color: #fff; }
.tilde { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); font-size: 18px; line-height: 1; }

/* ---------- Stage B ---------- */
.stage-b { opacity: 0; transform: translateY(30px); pointer-events: none; padding-top: 8px; }
.s2 .stage-b, .s3 .stage-b { opacity: 1; transform: none; pointer-events: auto; }
.merged { padding: 26px 26px; }
.agent { grid-template-columns: repeat(3, 1fr); padding: 26px 14px 20px; width: 430px; flex: none; animation: agentglow 4.4s linear infinite; }
.agent-lbl { position: absolute; top: 5px; left: 50%; transform: translateX(-50%); font-size: 11px; letter-spacing: 0.02em; text-transform: uppercase; color: var(--c-purple-700); }
@keyframes agentglow {
  0%, 30% { border-color: var(--c-black); background: #fff; }
  36%, 62% { border-color: var(--c-purple); background: var(--c-purple-50); }
  68%, 100% { border-color: var(--c-black); background: #fff; }
}
.token.t2 { animation: run2 4.4s linear infinite; }
@keyframes run2 {
  0% { left: 1%; opacity: 1; }
  32% { left: 30%; opacity: 1; }
  34% { left: 31%; opacity: 0; }
  64% { left: 66%; opacity: 0; }
  66% { left: 67%; opacity: 1; }
  100% { left: 96%; opacity: 1; }
}
.big { font-size: 60px; line-height: 1.05; margin: 28px 0 22px; }
.payoff { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; opacity: 0; transform: translateY(14px); transition: all 500ms ease; }
.s3 .payoff { opacity: 1; transform: none; }
.pay { display: flex; gap: 16px; align-items: flex-start; padding: 18px 20px; }
.pay h3 { font-size: 20px; margin-bottom: 4px; }
.pay p { font-size: 16px; }
</style>
