---
layout: section
number: 1
icon: agentic-orchestration
---

# Why agentic orchestration

AI agents can reason, decide and act. Getting them into production is the hard part.

---
layout: statement
eyebrow: The idea
---

<TasksToProcess />

---
eyebrow: The problem
center: true
---

# Why agents on their own stall before production

<p class="subtitle">Four gaps between a clever demo and something you can run in production.</p>

<div class="icon-cols" style="margin-top:34px">
  <div v-click>
    <BrandIcon name="observability-visibility" :size="40" />
    <h3>Black box</h3>
    <p>You can't see why it did what it did, or which systems it touched.</p>
  </div>
  <div v-click>
    <BrandIcon name="guardrails-policy-enforcement" :size="40" />
    <h3>Unbounded</h3>
    <p>Nothing stops it from taking actions it shouldn't.</p>
  </div>
  <div v-click>
    <BrandIcon name="approval-cycle-time" :size="40" />
    <h3>Impatient</h3>
    <p>It can't wait days for a person or a system without losing context.</p>
  </div>
  <div v-click>
    <BrandIcon name="audit-trail" :size="40" />
    <h3>Unaccountable</h3>
    <p>There is no independent record of what happened.</p>
  </div>
</div>

<p v-click class="lead" style="margin:44px auto 0;text-align:center">Today you will build an agent that solves <strong>all four</strong>.</p>

---
eyebrow: The platform
center: true
---

# Camunda orchestrates people, agents and systems

<PlatformFlow />
