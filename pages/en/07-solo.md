---
layout: section
number: 6
icon: guardrails-policy-enforcement
mix: warm
---

# Before you go solo

Four ideas that will save you hours in the challenges.

---
eyebrow: Best practice 1
---

# The process is not the agent

<p class="lead muted" style="margin-bottom:28px">The process owns the outcome. The agent owns the decisions inside its scope.</p>

<div class="grid-2">
  <div class="do">
    <h3>Let the agent</h3>
    <ul class="tight">
      <li>Choose which tools to run</li>
      <li>Interpret tool results</li>
      <li>Recontextualize existing data</li>
    </ul>
  </div>
  <div class="dont">
    <h3>Don't let the agent</h3>
    <ul class="tight">
      <li>Create brand-new data</li>
      <li>Make deterministic calculations or decisions</li>
      <li>Take out-of-scope actions</li>
    </ul>
  </div>
</div>

---
eyebrow: Best practice 2
---

# Is this a job for an agent?

<p class="muted">Good signs:</p>

<div class="grid-2" style="margin-top:12px">
  <ul>
    <li>Messy, unordered input</li>
    <li>Different data structures between service calls</li>
    <li>Several systems needed for one output</li>
  </ul>
  <ul>
    <li>The next step depends on a task's result</li>
    <li>Tasks that repeat until something is true</li>
  </ul>
</div>

<p class="small muted" style="margin-top:20px">If you can draw every path in advance, model it as a process instead.</p>

---
eyebrow: Best practice 3
---

# System prompts: goals, not instructions

<div class="grid-2" style="margin-top:24px">
  <div class="do">
    <h3>Do</h3>
    <ul class="tight">
      <li>Give one or more clearly defined goals</li>
      <li>Say what to do if a goal can't be achieved</li>
      <li>Tell it to prefer tools over its own reasoning</li>
      <li>Forbid inventing data, unless a tool requires it</li>
    </ul>
  </div>
  <div class="dont">
    <h3>Don't</h3>
    <ul class="tight">
      <li>Explain step by step how to achieve the goal</li>
      <li>Describe how specific tools should be used</li>
      <li>Contradict yourself about how to reach a goal</li>
      <li>Leave logical loopholes</li>
    </ul>
  </div>
</div>

---
layout: split
ratio: 1fr 1fr
eyebrow: Best practice 4
---

# Tools: describe them well, constrain their inputs

<ul class="small">
  <li><strong>Documentation:</strong> what the tool does, why the LLM would use it, and its restrictions</li>
  <li><strong>Inputs:</strong> prefer process variables over AI-generated values</li>
  <li><strong><code>fromAi</code>:</strong> put formats and guardrails in the description</li>
</ul>

::right::

<div class="card" style="margin-top:6px">
  <div class="xs muted" style="text-transform:uppercase;letter-spacing:.02em;margin-bottom:8px">Example documentation</div>
  <p style="color:var(--text);font-size:19px">This tool is used to get data about a user. You can use it to find out about the user's history with the company. Do not use this tool unless you have verified the user's identity first.</p>
</div>
