---
layout: default
---

<Hosts />
---
eyebrow: The day
---

# How today works

<div class="agenda day">
  <div><span class="what">Why agentic orchestration</span><span class="note">The idea, in plain terms</span></div>
  <div><span class="what">How a Camunda agent works</span><span class="note">The agent loop, tools and guardrails</span></div>
  <div><span class="what">Live demo</span><span class="note">An agent running in Camunda</span></div>
  <div><span class="what">Build your first agent together</span><span class="note">Step by step, on your own cluster</span></div>
  <div class="hl"><span class="what">Challenges</span><span class="note"><span class="chip-dark">Most of the day</span></span></div>
  <div><span class="what">Show and tell</span><span class="note">Scored demos of what you built</span></div>
</div>

<style>
.day { margin-top: 6px; }
.day > div:last-child { border-bottom: 1px solid var(--line); }
</style>

---
eyebrow: Goals
center: true
---

# What you will leave with

<div class="grid-3" style="margin-top:22px">
  <div class="tile green goal" style="--d:0ms">
    <div class="num">01</div>
    <div><h3>A working agent</h3><p>Built by you, running in Camunda, connected to real tools.</p></div>
  </div>
  <div class="tile purple goal" style="--d:180ms">
    <div class="num">02</div>
    <div><h3>A way to think about it</h3><p>When to let an agent decide, and when the process should.</p></div>
  </div>
  <div class="tile orange goal" style="--d:360ms">
    <div class="num">03</div>
    <div><h3>Patterns you can reuse</h3><p>Guardrails, humans in the loop and long-running tools.</p></div>
  </div>
</div>

<style>
.goal { min-height: 330px; }
/* entrance: tiles rise in one after another, then the copy settles in */
.goal { animation: goal-rise 700ms cubic-bezier(.2,.8,.2,1) var(--d) both; }
.goal .num { animation: goal-num 600ms ease calc(var(--d) + 250ms) both; }
.goal h3,
.goal p { animation: goal-copy 500ms ease calc(var(--d) + 450ms) both; }
@keyframes goal-rise { from { opacity: 0; transform: translateY(60px); clip-path: inset(100% 0 0 0); } to { opacity: 1; transform: none; clip-path: inset(0); } }
@keyframes goal-num { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: none; } }
@keyframes goal-copy { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@media print { .goal, .goal * { animation: none !important; } }
.goal h3 { font-weight: 500; font-size: 24px; margin: 0 0 8px; }
</style>
