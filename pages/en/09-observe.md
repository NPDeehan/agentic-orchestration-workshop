---
layout: section
number: 8
icon: observability-visibility
mix: cool
---

# See what your agent did

Every decision your agent makes is visible, measurable and on record.

---
layout: split
ratio: 1fr 1.5fr
align: center
eyebrow: Operate
---

<BrandIcon name="operate" :size="48" style="margin-bottom:12px" />

# Watch it run

<ul class="small">
  <li>See tool activations as they happen</li>
  <li>See which tools were used, and which were not</li>
  <li>Inspect every variable the agent read and wrote</li>
</ul>

::right::

<img src="/images/screens/operate-tool-progress.png" alt="Operate showing tool activations inside an agent" class="screenshot" style="max-height:470px">

---
layout: split
ratio: 1fr 1.3fr
align: center
eyebrow: Operate
---

<BrandIcon name="audit-trail" :size="48" style="margin-bottom:12px" />

# A full history, kept by the engine

<p class="muted">Every tool call, in order, with timestamps. The agent can't edit it, so it works as an independent audit trail.</p>

::right::

<img src="/images/screens/operate-instance-history.png" alt="Operate instance history listing agent tool calls" class="screenshot" style="max-height:470px">

---
eyebrow: Optimize
---

<BrandIcon name="optimize" :size="48" style="margin-bottom:12px" />

# Learn how your agents solve problems

<div class="grid-2" style="margin-top:8px">
  <div>
    <img src="/images/screens/optimize-heatmap-count.png" alt="Heatmap of how often each tool is activated" class="screenshot" style="height:330px;width:100%">
    <p class="small" style="margin-top:12px">How often each tool is used, across every run</p>
  </div>
  <div>
    <img src="/images/screens/optimize-heatmap-duration.png" alt="Heatmap of how long each tool takes" class="screenshot" style="height:330px;width:100%">
    <p class="small" style="margin-top:12px">How long each tool takes, to find bottlenecks</p>
  </div>
</div>

---
layout: split
ratio: 1fr 1.3fr
align: center
eyebrow: Optimize
---

<BrandIcon name="optimize" :size="48" style="margin-bottom:12px" />

# Set targets for your agents

<p class="muted">Define what good looks like, for example "solve the request in under 3 days on average", and see which runs miss it.</p>

::right::

<img src="/images/screens/optimize-target.png" alt="Optimize target duration report" class="screenshot" style="max-height:440px">
