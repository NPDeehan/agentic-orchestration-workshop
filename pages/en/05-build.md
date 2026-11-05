---
layout: section
number: 4
icon: first-agent
mix: cool
---

# Phase 1: build your first agent

We build it together, live. Follow along on your own cluster.

---
eyebrow: The goal of phase 1
---

# Where we are heading

<DiagramTour diagram="onboarding-phase1" height="300px" :steps="[
  { title: 'An agent with three tools', text: 'Small, but complete: it understands a request, uses tools to act, and talks back to the user.' },
  { focus: ['start'], icon: 'people-human-task', title: 'A form starts it', text: 'The user types a request. That text becomes the agent’s user prompt.' },
  { focus: ['agent'], badges: { agent: 'Hackday template' }, icon: 'ai-agent', title: 'The AI agent sub-process', text: 'Built from the AI Agent Sub-process - Hackday template, so the model, memory and limits are already set up.' },
  { focus: ['tool_search_customer'], tone: 'green', icon: 'kyc-aml-cdd', title: 'Tool 1: Search for customer', text: 'A service task that finds customers by name, email or ID.' },
  { focus: ['tool_create_customer'], tone: 'green', icon: 'client-onboarding', title: 'Tool 2: Create customer', text: 'A service task that creates a new customer record.' },
  { focus: ['tool_respond'], tone: 'orange', icon: 'chat-reach-leaders', title: 'Tool 3: Show response to user', text: 'A user task that shows the agent’s answer and collects follow-up questions. The agent uses it for all communication.' },
]" />

---
layout: breakout
eyebrow: Live build · follow along
---

# <span>Let’s build it</span> <span>together</span>

Open Web Modeler in your cluster. I will go step by step; shout if you fall behind.

---
layout: split
ratio: 1fr 1fr
eyebrow: Checkpoint
---

# Everyone has a working agent?

<ul class="check">
  <li>It starts from a form</li>
  <li>It answers you in Tasklist and reads your follow-ups</li>
  <li>It can find and create customers</li>
  <li>You have seen the run in Operate</li>
</ul>

::right::

<div class="eyebrow purple">Test it with</div>

<div class="reqs">
  <div class="prompt-bubble">“Do we have a customer called Niall Deehan?”</div>
  <div class="prompt-bubble">“Find all customers with trust level L3.”</div>
  <div class="prompt-bubble">“Create a customer for Ada Byrne, ada@example.com, trust level L1.”</div>
</div>

<style>
.check li { font-size: 24px; margin-bottom: 16px; }
.reqs { display: grid; gap: 10px; }
.prompt-bubble { position: relative; background: var(--c-sand); padding: 12px 16px 12px 40px; font-size: 19px; }
.prompt-bubble::before { content: ''; position: absolute; left: 16px; top: 1.05em; width: 10px; height: 10px; background: var(--c-purple); }
</style>
