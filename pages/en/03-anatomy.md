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

<DiagramTour diagram="Patterns/Guardrail patterns" height="340px" :steps="[
  { title: 'Prompts guide. Processes enforce.', text: 'An agent can be talked out of its prompt. It can’t skip a sequence flow. Three guardrails drawn into the model: a gatekeeper, a judge, and a way out.' },
  { view: ['StartEvent_1','Activity_0wut2wz','Event_1mfjs6d'], focus: ['Activity_0wut2wz'], badges: { Activity_0wut2wz: 'Only these tools exist' }, icon: 'ai-agent', title: 'The boundary is the first guardrail', text: 'Everything the agent may do is drawn inside the ad-hoc sub-process. No instruction talks it into a tool you didn’t give it.' },
  { view: ['StartEvent_1','Activity_0wut2wz','Event_1mfjs6d'], focus: ['Activity_0d7zogn','Activity_09dmz06'], tone: 'green', icon: 'people-human-task', title: '1. A gatekeeper in front of the risky tool', text: 'Query the knowledge base freely. To take an action that changes something, a person verifies first — a sequence flow the agent has no say over.' },
  { view: ['Event_1faxuvl','Activity_1f0tqu2','Activity_17p2bls','Gateway_06gq7jv','Event_0ok3duo','Event_1tdwn94'], focus: ['Activity_17p2bls'], tone: 'orange', badges: { Activity_17p2bls: 'Reviews, cannot act' }, icon: 'decision-monitoring', title: '2. A judge reviews the run', text: 'A second agent grades what the first one did. It has no tools of its own, so its verdict is an opinion the process acts on, never an action.' },
  { view: ['Activity_17p2bls','Gateway_06gq7jv','Activity_1ees3jr','Activity_0tevsjb','Event_0ok3duo','Event_1tdwn94','Event_1jgr46l'], focus: ['Gateway_06gq7jv','Activity_1ees3jr','Activity_0tevsjb'], tone: 'orange', icon: 'continuously-optimized', title: 'The verdict has to go somewhere', text: 'Good runs are stored in long-term memory, so the next one starts smarter. Poor runs go to a person to evaluate. A gateway decides, not the LLM.' },
  { view: ['Event_0173ijq','Activity_1krj211','Activity_0u50ecs','Gateway_1c7cyzd','Event_05r5bls','Activity_1f16oqq','Event_085isyb','Event_1jhkx90'], focus: ['Event_1p6u4xt','Event_1593mxe','Activity_1f16oqq','Event_085isyb'], tone: 'orange', icon: 'compliance-risk-ops', title: '3. A way out of the agent', text: 'Out of scope, or out of its depth, the agent throws an escalation. A boundary event catches it, ends the run and hands a person the full context.' },
  { view: ['Activity_1krj211','Event_0ky0oug','Event_1jhkx90'], focus: ['Event_0ky0oug','Event_1jhkx90'], tone: 'orange', icon: 'governance-control', title: 'And a ceiling it can’t argue with', text: 'A timer on the agent ends the run whatever it thinks it is doing. Max model calls and context window size cap what any single instance can cost.' },
  { focus: ['Activity_0wut2wz','Activity_1f0tqu2','Activity_1krj211'], icon: 'guardrails-policy-enforcement', title: 'Layer them', text: 'None of these is enough on its own. Together they bound what the agent can reach, review what it did, and give it a door marked ask a human.' },
]" />
