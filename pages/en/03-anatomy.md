---
layout: section
number: 3
icon: ai-agent
mix: cool
---

# Anatomy of a Camunda agent

The agent, its loop, its tools and its guardrails.

---
layout: split
ratio: 1fr 1.25fr
align: center
eyebrow: The AI agent sub-process
---

# The agent is built with BPMN

<v-clicks>

- **The agent** is an ad-hoc sub-process: no fixed order inside
- **Every element inside is a tool** the agent can choose to run
- **Configuration** sets the model, prompts, memory and limits

</v-clicks>

::right::

<BpmnDiagram diagram="onboarding-phase1" height="420px" :steps="[{}, { focus: ['agent'] }, { focus: ['tool_search_customer','tool_create_customer','tool_respond'], tone: 'green' }, { focus: ['agent'], tone: 'orange' }]" />

---
eyebrow: The agent loop
---

<AgentLoop />

---
layout: split
ratio: 1fr 1.1fr
eyebrow: What makes a tool
---

# The LLM only knows what you tell it

<v-clicks>

- **Documentation** tells the LLM what the tool does and when to use it
- **`fromAi()`** defines the inputs the LLM must provide, with a description and type
- **`toolCallResult`** hands the result back to the agent

</v-clicks>

::right::

<div class="card" style="margin-bottom:14px">
  <div class="xs muted" style="text-transform:uppercase;letter-spacing:.02em;margin-bottom:6px">Element documentation</div>
  <div class="small">Use this tool to search for details of a customer.</div>
</div>

```js
// Input mappings on "Search for customer"
customerName  = fromAi(toolCall.customerName,
  "Optional name filter.", "string")
fuzzyMatching = fromAi(toolCall.fuzzyMatching,
  "Enable fuzzy matching. Use true or false.", "boolean")
searchMode    = "FLEXIBLE"   // fixed by you, not the LLM

// Output mapping
toolCallResult = customerSearchResult
```

---
layout: split
ratio: 1fr 1.3fr
align: center
eyebrow: Tool types
---

# Any BPMN construction can be a tool

<v-clicks>

- A single task: service, user, script or connector
- A call activity: a whole reusable process
- A sequence of tasks that always run together
- Deterministic logic the agent can't skip

</v-clicks>

::right::

<BpmnDiagram diagram="agent-tool-types" height="420px" :steps="[{}, { focus: ['single'] }, { focus: ['call'] }, { focus: ['seq_one','seq_two'] }, { focus: ['review','gw_ok','next','end_no'], tone: 'orange' }]" />

---
eyebrow: Guardrails
---

# Guardrails that can’t be talked around

<DiagramTour diagram="agent-guardrails" height="310px" :steps="[
  { title: 'Prompts guide. Processes enforce.', text: 'An agent can be persuaded to ignore its prompt. It can’t skip a gateway. Four layers from soft to hard, plus a way out and a ceiling.' },
  { focus: ['agent'], badges: { agent: 'System prompt: goal and scope' }, icon: 'ai-agent', title: '1. The prompt sets goal and scope', text: 'Tell the agent what it is for, what it must never do, and to prefer tools over guessing. Necessary, but not enough on its own.' },
  { focus: ['search'], badges: { search: 'fromAi: formats and rules' }, icon: 'guardrails-policy-enforcement', title: '2. Tool inputs constrain what the LLM can send', text: 'fromAi descriptions define formats and limits. Fixed values and process variables take choices away from the LLM entirely.' },
  { focus: ['policy','gw_policy','create_account','end_refused'], tone: 'orange', icon: 'decision-monitoring', title: '3. Rules inside a tool decide', text: 'The agent can ask to create an account, but a DMN policy check runs first. If the policy says no, the account is never created.' },
  { focus: ['approve','gw_approve','delete','end_rejected'], tone: 'green', icon: 'people-human-task', title: '4. People approve the risky actions', text: 'Deleting a customer needs a human. The agent waits, with its context intact, until someone approves or rejects.' },
  { focus: ['escalate','boundary_esc','handle','end_esc'], tone: 'orange', icon: 'compliance-risk-ops', title: 'Escalation: a way out of the agent', text: 'Out-of-scope requests trigger an escalation event. The process catches it and hands the case to a person.' },
  { focus: ['agent'], badges: { agent: 'Max 10 model calls' }, icon: 'governance-control', title: 'Limits stop runaway agents', text: 'Max model calls and context window size cap what any single run can do.' },
]" />
