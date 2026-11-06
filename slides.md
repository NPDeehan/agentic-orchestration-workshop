---
# ─── Workshop settings: change these per workshop ────────────────────────────
customer: ''                   # leave empty ('') for an open, customer-agnostic workshop
host: Niall Deehan
hostRole: Camunda
coHost: Marco Lopes            # leave empty ('') when presenting alone
coHostRole: Camunda
coHostPhoto: /images/people/marco.jpg   # empty shows a placeholder
eventDate: ''                  # e.g. December 15, 2026 (no ordinal suffixes)
locale: en                     # strings for components come from locales/<locale>.ts
# ─── Deck settings ───────────────────────────────────────────────────────────
theme: none
favicon: /favicon.png
title: Agentic orchestration workshop
info: Hands-on workshop on Camunda agentic orchestration.
canvasWidth: 1280
aspectRatio: 16/9
fonts:
  provider: none
transition: fade
presenter: dev                 # presenter mode (and its notes) only with npm run dev, never on the hosted site
drawings:
  persist: false
exportFilename: agentic-orchestration-workshop
highlighter: shiki
lineNumbers: false
layout: cover
---

# Transparent agentic orchestration

Build an AI agent you can see, steer and trust.

---
src: ./pages/en/00-opening.md
---

---
src: ./pages/en/01-why.md
---

---
src: ./pages/en/02-spectrum.md
---

---
src: ./pages/en/03-anatomy.md
---

---
src: ./pages/en/04-demo.md
---

---
src: ./pages/en/05-build.md
---

---
src: ./pages/en/06-use-case.md
---

---
src: ./pages/en/07-solo.md
---

---
src: ./pages/en/08-challenges.md
handout: challenges            # slides tagged for "npm run export:challenges" and the /nav export button
---

---
src: ./pages/en/09-observe.md
---

---
src: ./pages/en/10-close.md
---

---
src: ./pages/en/99-appendix.md
---
