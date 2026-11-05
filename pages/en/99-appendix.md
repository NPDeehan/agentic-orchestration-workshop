---
layout: section
eyebrow: Optional
icon: process-bpmn
mix: cool
---

# Appendix

Agentic patterns and best practices in more depth.

---
eyebrow: Patterns
center: true
---

# Seven agentic patterns

<div class="grid-4 patterns" style="margin-top:26px">
  <div class="card"><BrandIcon name="explainability-decision-trail" :size="36" style="margin-bottom:10px" /><h3>ReAct agent</h3><p>Act, then reason about the result</p></div>
  <div class="card"><BrandIcon name="mcp-model-context-protocol" :size="36" style="margin-bottom:10px" /><h3>Modern tool use</h3><p>Many systems, one agent</p></div>
  <div class="card"><BrandIcon name="document-intake" :size="36" style="margin-bottom:10px" /><h3>Agentic RAG</h3><p>Knowledge bases as tools</p></div>
  <div class="card"><BrandIcon name="compare-what-held-up" :size="36" style="margin-bottom:10px" /><h3>Self reflection</h3><p>A judge reviews the reasoning</p></div>
  <div class="card"><BrandIcon name="people-and-agents" :size="36" style="margin-bottom:10px" /><h3>Multi-agent</h3><p>Specialists coordinated by a parent</p></div>
  <div class="card"><BrandIcon name="human-in-the-loop" :size="36" style="margin-bottom:10px" /><h3>Human in the loop</h3><p>People as tools and fallbacks</p></div>
  <div class="card"><BrandIcon name="approval-cycle-time" :size="36" style="margin-bottom:10px" /><h3>Long running</h3><p>Waiting without losing context</p></div>
</div>

<style>.patterns .card { min-height: 130px; }</style>

---
layout: split
ratio: 1fr 1.4fr
align: center
eyebrow: Pattern
---

# ReAct agent

<p class="muted">An action agent uses tools, then a reasoning agent reviews what happened and decides the output.</p>

::right::

<img src="/images/patterns/react.png" alt="ReAct agent pattern in BPMN" class="screenshot" style="max-height:420px">

---
layout: split
ratio: 1fr 1.4fr
align: center
eyebrow: Pattern
---

# Modern tool use

<p class="muted">One agent reaches many systems: MCP servers, CRMs, databases, email and chat, each as a tool.</p>

::right::

<img src="/images/patterns/modern-tool-use.png" alt="Modern tool use pattern in BPMN" class="screenshot" style="max-height:420px">

---
layout: split
ratio: 1fr 1.4fr
align: center
eyebrow: Pattern
---

# Agentic RAG

<p class="muted">Querying and updating a knowledge base are tools the agent chooses to use, not a fixed pre-step.</p>

::right::

<img src="/images/patterns/agentic-rag.png" alt="Agentic RAG pattern in BPMN" class="screenshot" style="max-height:420px">

---
layout: split
ratio: 1fr 1.4fr
align: center
eyebrow: Pattern
---

# Self reflection

<p class="muted">A judge agent checks the reasoning. If it isn't good enough, the agent goes round again with recommendations stored in long-term memory.</p>

::right::

<img src="/images/patterns/self-reflection.png" alt="Self reflection pattern in BPMN" class="screenshot" style="max-height:420px">

---
layout: split
ratio: 1fr 1.4fr
align: center
eyebrow: Pattern
---

# Multi-agent

<p class="muted">A parent agent coordinates specialist agents, each modeled as a call activity with its own tools.</p>

::right::

<img src="/images/patterns/multi-agent.png" alt="Multi-agent pattern in BPMN" class="screenshot" style="max-height:420px">

---
layout: split
ratio: 1fr 1.4fr
align: center
eyebrow: Pattern
---

# Human in the loop

<p class="muted">People can be tools the agent asks, a takeover path when the agent escalates, and validators of the final result.</p>

::right::

<img src="/images/patterns/human-in-the-loop.png" alt="Human in the loop pattern in BPMN" class="screenshot" style="max-height:420px">

---
layout: split
ratio: 1fr 1.4fr
align: center
eyebrow: Pattern
---

# Long running

<p class="muted">Tools can wait for replies, time out and send reminders, while the agent keeps its context.</p>

::right::

<img src="/images/patterns/long-running.png" alt="Long running pattern in BPMN" class="screenshot" style="max-height:420px">

---
eyebrow: Best practices
center: true
---

# Process goal is not the agent's goal

<div class="grid-2" style="margin-top:24px">
  <div class="card">
    <h3>The process</h3>
    <ul class="tight small" style="margin-top:10px">
      <li>Understand the goal of the whole process</li>
      <li>Separate deterministic from dynamic logic</li>
    </ul>
  </div>
  <div class="card">
    <h3>The agent</h3>
    <ul class="tight small" style="margin-top:10px">
      <li>Define the goal of the agent</li>
      <li>Limit the agent to achieving that goal</li>
    </ul>
  </div>
</div>

---
layout: split
ratio: 1fr 1.2fr
eyebrow: Best practices
---

# A system prompt with clear goals

<p class="muted">Goals, a fallback for when they can't be met, and a preference for tools. No step-by-step instructions.</p>

::right::

```md
You have specific goals when given a document. After all goals
are achieved, produce a final report for an analyst and expect
follow-up questions.

1. Validate EVERY person or entity in the letter against
   existing data sources. If one can't be verified, note your
   attempts and why they didn't work.
2. Extract all relevant financial information. Find the
   required formulas for this document type, run them with the
   discovered data and show the result to the user.
3. Generate a high-level summary of the financial soundness of
   the company and persons involved.

If tools are provided, prefer them over guessing an answer.
If you can't achieve a goal with the tools available, give a
detailed summary of what you tried, why it failed, and your
suggested next steps.
```

---
eyebrow: Best practices
center: true
---

# Other configuration

<div class="grid-3" style="margin-top:24px">
  <div class="card">
    <h3>Picking the LLM</h3>
    <ul class="tight small" style="margin-top:10px">
      <li>Have the LLM discussion after modeling</li>
      <li>Start with a capable model and work your way down</li>
    </ul>
  </div>
  <div class="card">
    <h3>User prompt</h3>
    <ul class="tight small" style="margin-top:10px">
      <li>Usually dynamic, from process data</li>
      <li>Send documents for extra context</li>
    </ul>
  </div>
  <div class="card">
    <h3>Response</h3>
    <ul class="tight small" style="margin-top:10px">
      <li>Not every LLM supports JSON output</li>
      <li>Agent memory is useful for checks after the run</li>
    </ul>
  </div>
</div>

---
eyebrow: Best practices
center: true
---

# Agent tools are not just tasks

<div class="grid-3" style="margin-top:24px">
  <div class="card">
    <h3>Call activities</h3>
    <p>Use full BPMN for complex, reusable tools.</p>
  </div>
  <div class="card">
    <h3>Gatekeeper tasks</h3>
    <p>Stop the agent from triggering dangerous tools on its own.</p>
  </div>
  <div class="card">
    <h3>Events</h3>
    <p>Let the agent trigger the engine into action, such as escalations.</p>
  </div>
</div>
