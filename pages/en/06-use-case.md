---
layout: section
number: 5
icon: client-onboarding
---

# Customer onboarding at <Customer fallback="a bank" />

You have an agent. Now for the real process, and every tool you can give it.

---
layout: split
ratio: 1.15fr 1fr
eyebrow: The scenario
---

# Requests arrive in plain language

<p class="muted">Bank staff ask for things the way they would ask a colleague. The agent has to work out what is needed, use the right systems, and follow the rules.</p>

<div class="reqs">
  <div class="prompt-bubble">“Is Niall Deehan a customer?”</div>
  <div class="prompt-bubble">“Show me details for Niall and Aoife.”</div>
  <div class="prompt-bubble">“If Dan O’Brian doesn’t exist as a customer, can you create it?”</div>
</div>

::right::

<img src="/images/workshop-group.jpg" alt="A presenter talks a small group through a BPMN process on a laptop" class="scenario-photo">

<style>
.reqs { display: grid; gap: 10px; margin-top: 22px; }
.scenario-photo { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 58% 50%; }
.prompt-bubble { position: relative; background: var(--c-sand); padding: 12px 16px 12px 40px; font-size: 18px; max-width: 34ch; }
.prompt-bubble::before { content: ''; position: absolute; left: 16px; top: 1.05em; width: 10px; height: 10px; background: var(--c-purple); }
</style>

---
eyebrow: The bigger picture
---

# From your agent to the full picture

<DiagramTour diagram="onboarding-agent-full" height="310px" :steps="[
  { title: 'Same pattern, more tools', text: 'One possible full onboarding agent. Your challenges will take you in this direction, each in your own way.' },
  { focus: ['Activity_18020de','Activity_0u2tzmn','Activity_048s4i5'], tone: 'green', icon: 'first-agent', title: 'What you built in phase 1', text: 'Search for and create customers, and talk to the user.' },
  { focus: ['Activity_11nrikr','Activity_0ol2lhr'], icon: 'banking', title: 'Companies', text: 'Who customers work for, and whether those companies are under sanction.' },
  { focus: ['Activity_16iuwit','Activity_1juddfo'], tone: 'orange', icon: 'people-and-agents', title: 'Employees', text: 'The bank’s own people, who are linked to customers.' },
  { focus: ['Activity_0zzpxe2','Activity_0m074b1'], icon: 'payment-exceptions', title: 'Accounts', text: 'Search and create accounts, and link customers to them with a role.' },
  { focus: ['Activity_09ymdth'], tone: 'orange', badges: { Activity_09ymdth: 'Your rules go here' }, icon: 'guardrails-policy-enforcement', title: 'The tools are the easy part', text: 'The challenges are about the rules around them: sanctions, approvals, scope and limits.' },
]" />

---
eyebrow: The data
---

# Four kinds of record

<div style="margin-top:12px"><DataModel /></div>

---
eyebrow: The tools
---

# Connectors available today

<p class="small muted" style="margin:-12px 0 18px">Click a tool to see its operations and inputs. You used two in phase 1; the challenges use the rest.</p>

<ToolCards />
