---
layout: section
number: 2
icon: deterministic-dynamic
mix: warm
---

# From fixed processes to dynamic agents

Two ways to orchestrate work, and why you want both.

---
eyebrow: Two kinds of orchestration
center: true
---

# Control or flexibility? Both.

<p class="subtitle">Most real processes live somewhere in between. Orchestration handles the full range.</p>

<OrchestrationSpectrum />

---
eyebrow: Deterministic orchestration
---

# Invoice approval: predictable by design

<DiagramTour diagram="invoice-deterministic" height="310px" :steps="[
  { title: 'Every path is designed up front', text: 'Nothing happens that isn’t in the model. Let’s look at what makes it predictable.' },
  { focus: ['categorize'], icon: 'decision-monitoring', title: 'Business rules make the decisions', text: 'A DMN decision table categorizes the invoice. The same input always gives the same result, and the rules are auditable.' },
  { focus: ['gw_amount','gw_approved','gw_join'], tone: 'orange', icon: 'process-bpmn', title: 'Gateways fix the paths', text: 'Every branch is drawn in advance. The engine can only follow a path that exists in the model.' },
  { focus: ['approve'], tone: 'green', icon: 'people-human-task', title: 'People step in where designed', text: 'Approval happens at a defined point, by a defined role, and only for invoices over 500.' },
  { focus: ['pay','archive','notify'], icon: 'systems-applications', title: 'Systems are called in a fixed order', text: 'Pay, then archive. Every time, in that order.' },
  { focus: ['start','end_paid','end_rejected'], tone: 'orange', icon: 'audit-trail', title: 'Known outcomes', text: 'Every instance ends in one of the outcomes you modeled: paid or rejected. Great for high volume, but only for what you anticipated.' },
]" />

---
eyebrow: Dynamic orchestration
---

# Invoice dispute: the agent decides

<DiagramTour diagram="invoice-dispute-agent" height="310px" :steps="[
  { title: 'Disputes are different every time', text: 'You can’t draw every path in advance. So instead of a path, we give an agent a goal and some tools.' },
  { focus: ['agent'], badges: { agent: 'AI agent' }, icon: 'ai-agent', title: 'The ad-hoc sub-process is a sandbox', text: 'Everything inside is available to the agent. The boundary defines what it may use, and nothing outside it.' },
  { focus: ['get_account','display','contact','cancel'], sequence: ['contact','get_account','display','get_account','cancel'], icon: 'dynamic-rerouting', title: 'No fixed order', text: 'There are no sequence flows between the tools. Any tool can run first, and the order changes from case to case.' },
  { focus: ['get_account','display','contact','cancel','create'], badges: { get_account: 'ran 2x', display: 'ran 3x', contact: 'ran 1x', cancel: 'not used', create: 'not used' }, icon: 'scale', title: 'Any number of executions', text: 'A tool can run many times, once, or not at all. The agent uses what it needs to reach the goal.' },
  { focus: ['agent'], tone: 'orange', badges: { agent: 'LLM chooses the next tools' }, icon: 'agentic-orchestration', title: 'The LLM decides, not the engine', text: 'No gateway picks the path. The LLM chooses the next tools from the goal and what it has learned. The engine still runs, waits for and records every tool.' },
  { focus: ['cancel','gw_new','create','end_no'], tone: 'green', icon: 'process-bpmn', title: 'Deterministic logic can live inside a tool', text: 'Once the agent cancels an invoice, a gateway decides whether a new one is needed. Fixed rules where they matter.' },
]" />

---
eyebrow: Agentic orchestration
---

# The agent takes over where rules run out

<BpmnDiagram diagram="invoice-blended" height="420px" :steps="[{ focus: ['gw_approved'], tone: 'orange' }, { reveal: ['agent','end_resolved'], focus: ['agent'] }, {}]" />

---
layout: default
---

<ControlAndFlexibility />
