---
layout: section
number: 7
icon: orchestration-masterclasses
---

# Phase 2: challenges

More challenges than anyone has time for. Pick the problems you want to solve.

---
eyebrow: How it works
center: true
---

# Choose your own path

<div class="grid-3" style="margin-top:26px">
  <div class="card">
    <div class="stat" style="color:var(--c-orange)">1.</div>
    <h3 style="margin-top:14px">Pick 3 or 4</h3>
    <p>Start wherever you like. Harder challenges are worth more points.</p>
  </div>
  <div class="card">
    <div class="stat" style="color:var(--c-purple)">2.</div>
    <h3 style="margin-top:14px">Solve it your way</h3>
    <p>There is no single answer. Prompt, tool or process: if it meets "done when", it counts.</p>
  </div>
  <div class="card">
    <div class="stat" style="color:var(--c-green-700)">3.</div>
    <h3 style="margin-top:14px">Demo to score</h3>
    <p>Show your working process to the judge. Only what works in the demo scores.</p>
  </div>
</div>

<div class="legend">
  <span class="small muted">Difficulty</span>
  <Difficulty :level="1" />
  <Difficulty :level="2" />
  <Difficulty :level="3" />
</div>

<style>
.legend { display: flex; gap: 28px; align-items: center; margin-top: 34px; }
</style>

---
eyebrow: Winning
---

# How you are scored

<ScoringRules />

---
eyebrow: The challenges
center: true
---

# Challenge menu

<div style="margin-top:-6px"><ChallengeMenu /></div>

---
layout: split
ratio: 380px 1fr
align: center
eyebrow: On your laptop
---

<!-- QR code: public/images/qr-site.svg, generated from the GitHub Pages URL below with uqr.
     If the site URL changes, regenerate it and update the link. -->
<img src="/images/qr-site.svg" alt="QR code for the workshop slides" style="width:340px;height:340px;display:block">

::right::

# Open the challenges on your own screen

<p class="lead muted">Every challenge, its “done when” criteria and the tool details, at your own pace.</p>

<p class="site-url"><a href="https://npdeehan.github.io/agentic-orchestration-workshop/" target="_blank">npdeehan.github.io/agentic-orchestration-workshop</a></p>

<ul class="tight small">
  <li>Arrow keys move between slides; <code>o</code> shows them all</li>
  <li>Click a tool card to see its operations and inputs</li>
</ul>

<style>
.site-url { font-size: 24px; margin: 8px 0 22px; }
.site-url a { text-decoration-color: var(--c-orange); }
</style>

---
layout: breakout
eyebrow: Challenge time
---

<Countdown :minutes="120" />

<p style="margin-top:28px">Pick a challenge from the menu. Click the timer to start or pause it; double-click to reset.</p>

---
layout: default
---

<ChallengeDetail id="customer-360" />

---

<ChallengeDetail id="no-duplicates" />

---

<ChallengeDetail id="ask-dont-invent" />

---

<ChallengeDetail id="find-colleague" />

---

<ChallengeDetail id="sanctions-gate" />

---
layout: split
ratio: 1fr 1.25fr
eyebrow: Sanctions gate
---

# What success could look like

<p class="muted">One possible run. Where you put the check is up to you: prompt, tool or process.</p>

<p class="small muted">Here we assume the employer is flagged as sanctioned in the data.</p>

::right::

<AgentRun :events="[
  { kind: 'user', text: 'Can you create a customer record for Nele Ulemann who works at Camunda?' },
  { kind: 'tool', text: 'Query for company', detail: 'companyName: &quot;Camunda&quot;' },
  { kind: 'result', text: 'Company found', detail: 'sanctioned: true' },
  { kind: 'guard', text: 'Customer creation blocked: employer is under sanction' },
  { kind: 'tool', text: 'Show response to user', detail: 'I can\'t create this customer because their employer is under sanction.' },
  { kind: 'done', text: 'No customer record created. The decision is visible in Operate.' },
]" />

---

<ChallengeDetail id="human-approval" />

---
layout: split
ratio: 1fr 1.25fr
eyebrow: Human in the loop for accounts
---

# What success could look like

<p class="muted">The agent can decide that an account is needed. It cannot create one on its own.</p>

::right::

<AgentRun :events="[
  { kind: 'user', text: 'Create a new personal account for Niall Deehan.' },
  { kind: 'tool', text: 'Search for customer', detail: 'customerName: &quot;Niall Deehan&quot;' },
  { kind: 'agent', text: 'Customer found. A PERSONAL account is needed.' },
  { kind: 'human', text: 'Approval requested from a bank employee in Tasklist' },
  { kind: 'human', text: 'Approved' },
  { kind: 'tool', text: 'Manage account record', detail: 'operation: CREATE, accountType: PERSONAL' },
  { kind: 'tool', text: 'Manage customer account link', detail: 'role: OWNER' },
  { kind: 'done', text: 'Account created and linked, only after approval.' },
]" />

---

<ChallengeDetail id="stay-in-your-lane" />

---
layout: split
ratio: 1fr 1.25fr
eyebrow: Stay in your lane
---

# What success could look like

<p class="muted">The request leaves the agent instead of being attempted, and a person decides what happens next.</p>

::right::

<AgentRun :events="[
  { kind: 'user', text: 'Delete all users from the database!' },
  { kind: 'agent', text: 'This is outside my goal of onboarding customers.' },
  { kind: 'guard', text: 'Escalation: out-of-scope request' },
  { kind: 'human', text: 'Operations team receives the original request' },
  { kind: 'done', text: 'Nothing deleted. The escalation is on record.' },
]" />

---

<ChallengeDetail id="onboard-business" />

---

<ChallengeDetail id="update-with-care" />

---

<ChallengeDetail id="account-numbers" />

---

<ChallengeDetail id="trust-rules" />

---

<ChallengeDetail id="joint-accounts" />

---

<ChallengeDetail id="approvals-that-wait" />

---

<ChallengeDetail id="specialist-agents" />

---

<ChallengeDetail id="explain-yourself" />

---
eyebrow: Stuck?
center: true
---

# Where to look when it doesn't work

<div class="grid-2" style="margin-top:22px">
  <div class="card">
    <div style="display:flex;gap:14px;align-items:center;margin-bottom:8px"><BrandIcon name="operate" :size="34" /><h3 style="margin:0">Check Operate first</h3></div>
    <p>Incidents, variables and the order of tool calls show what the agent actually saw and did.</p>
  </div>
  <div class="card">
    <div style="display:flex;gap:14px;align-items:center;margin-bottom:8px"><BrandIcon name="explainability-decision-trail" :size="34" /><h3 style="margin:0">Read the agent context</h3></div>
    <p>The <code>agent</code> variable holds the conversation, including every tool call and result.</p>
  </div>
  <div class="card">
    <div style="display:flex;gap:14px;align-items:center;margin-bottom:8px"><BrandIcon name="connectors-marketplace" :size="34" /><h3 style="margin:0">Check your tool documentation</h3></div>
    <p>If the agent ignores a tool, the description probably doesn't say when to use it.</p>
  </div>
  <div class="card">
    <div style="display:flex;gap:14px;align-items:center;margin-bottom:8px"><BrandIcon name="people-and-agents" :size="34" /><h3 style="margin:0">Ask</h3></div>
    <p>Ask your neighbor, then raise a hand.</p>
  </div>
</div>

---
layout: breakout
eyebrow: Show and tell
---

<Countdown :minutes="15" />

<p style="margin-top:28px">Demos start when the timer runs out. Have your processes deployed and ready to run.</p>
