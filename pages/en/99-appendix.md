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
routeAlias: patterns
---

# Seven agentic patterns

<p class="small muted" style="margin-top:-8px">Click a pattern to see how it looks in BPMN.</p>

<div style="margin-top:18px"><PatternMenu /></div>

---
layout: default
routeAlias: pattern-react
---

<PatternDetail id="react" />

---
routeAlias: pattern-modern-tool-use
---

<PatternDetail id="modern-tool-use" />

---
routeAlias: pattern-agentic-rag
---

<PatternDetail id="agentic-rag" />

---
routeAlias: pattern-self-reflection
---

<PatternDetail id="self-reflection" />

---
routeAlias: pattern-multi-agent
---

<PatternDetail id="multi-agent" />

---
routeAlias: pattern-human-in-the-loop
---

<PatternDetail id="human-in-the-loop" />

---
routeAlias: pattern-long-running
---

<PatternDetail id="long-running" />

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
