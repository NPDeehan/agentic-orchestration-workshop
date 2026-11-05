# Agentic orchestration workshop deck

Slidev deck for the hands-on Camunda agentic orchestration workshop, styled to Camunda brand v4.0 (light mode).

## Run and export

```bash
npm install
npm run dev       # presenter: press "p" for presenter mode, "o" for overview
npm run export    # PDF -> agentic-orchestration-workshop.pdf
npm run export:challenges                    # challenges only -> agentic-orchestration-challenges.pdf
npm run export:challenges -- --format png    # extra args are passed to `slidev export`
```

`export:challenges` exports the challenge slides, minus the countdown (breakout) slides. A slide is
part of a handout when its frontmatter has `handout: <name>`; the `src:` import of
`pages/en/08-challenges.md` in `slides.md` sets `handout: challenges`, so every slide in that file
inherits it. Page numbers are worked out from the deck each time, so the export keeps working when
slides are added, removed or hidden elsewhere. Slides are exported fully revealed, so hints and
complete example runs are included.

The same export is on the `/nav` page: with `npm run dev`, each handout has an **Export PDF**
button that runs the export and downloads the file (`vite.config.ts` provides the endpoint). To add
another handout, tag a section's import with `handout: <name>` and add an
`"export:<name>": "node scripts/export-handout.mjs <name>"` script.

Navigation while presenting:

- `/nav` (or press `n`): every slide as a thumbnail, grouped by section, with a filter. Click to jump.
- `o`: Slidev's quick overview grid. `/overview`: Slidev's overview with speaker notes.

## Brand template

Styling follows `sourceMaterial/Brand Template slidedeck/Brand Camunda Slide Template.pptx`:
white content slides with Sand cards, square corners, Libertinus Serif titles (30 pt = 53 px),
Poppins body, Poppins Light for big numbers, Poppins Medium for labels, orange square bullets,
and only the wordmark at the bottom right. Cover, closing, section and breakout slides use the
template's own artwork in `public/brand/`. Content slides take `center: true` (centred title, as on
the template's grid layouts) and `bg: sand`. Template illustrations and pictograms are in
`public/images/illustrations` and `public/images/pictograms`.

## Hosting

The deck is published at **https://npdeehan.github.io/agentic-orchestration-workshop/** by
`.github/workflows/deploy.yml`, which builds and deploys on every push to `main` (about two
minutes). Attendees get there from the QR code slide after the challenge menu.

This repo is **public**, so:

- Keep `customer: ''` in `slides.md` for anything you push. Set a customer name locally if you
  present a tailored version, but don't commit it.
- `sourceMaterial/` and `judging/hidden-prompts.ts` are git-ignored and exist only on your machine.
  To use `/judge` on a fresh clone, copy `judging/hidden-prompts.example.ts` to `hidden-prompts.ts`.
- The hosted site has no presenter mode (`presenter: dev`), so speaker notes stay private. `/judge`
  and the `/nav` Export PDF button only work with `npm run dev`.
- The site lives under `/agentic-orchestration-workshop/`. Static `src="/images/..."` paths are
  rewritten by the build, but paths built in script must go through `asset()` from
  `composables/asset.ts`.
- `public/images/qr-site.svg` encodes the site URL. If the URL changes, regenerate it with the
  `uqr` package (already installed with Slidev) and update the link on that slide.

## Per-workshop settings

Edit the headmatter at the top of `slides.md`:

| Key | Use |
|---|---|
| `customer` | Customer name shown on the cover, footer and use-case section. Set to `''` for an open workshop. |
| `host`, `hostRole` | Shown on the cover, host slide and closing slide. (Not `presenter`: that key is Slidev's presenter-mode switch.) |
| `coHost`, `coHostRole`, `coHostPhoto` | Second host on the host slide. Leave `coHost` empty to present alone; empty `coHostPhoto` shows a placeholder |
| `eventDate` | Optional, e.g. `December 15, 2026` |
| `locale` | Which `locales/<locale>.ts` the components use |

Hide a slide for one workshop by adding `hide: true` to its frontmatter.

## Structure

```
slides.md              headmatter + section imports
pages/en/*.md          slide content, one file per section
locales/en.ts          component strings, tools, challenges, agent loop, spectrum
components/            BpmnDiagram, DiagramTour, AgentLoop, OrchestrationSpectrum,
                       TasksToProcess, PlatformFlow, ToolCards, DataModel,
                       ChallengeMenu, ChallengeDetail, AgentRun, Countdown,
                       Difficulty, Orb, Placeholder, CamundaLogo, BrandIcon
navigator/             the /nav presenter navigator page
setup/                 /nav route and the "n" shortcut
layouts/               cover, end, section, statement, default, split, breakout (styled on the brand template)
slide-top.vue          footer (logo, title, customer, page number)
styles/                brand tokens, base styles, bpmn-js styling, code theme
styles/fonts/          Poppins Regular and Libertinus Serif Regular (from sourceMaterial/Fonts)
bpmn/                  diagrams rendered live with bpmn-js
brand/                 Camunda logo files (see brand/README.md)
public/icons/          Camunda brand line icons, used via <BrandIcon name="..." />
public/images/         screenshots and photos
```

## Challenges

Challenges live in `locales/en.ts` (`challenges`). Each has a `level` (1 starter, 2 core, 3 advanced),
goal, prompts, "done when" criteria, connectors and an optional hint. The challenge menu and
detail slides render from that data, so to add one: add an entry there and a
`<ChallengeDetail id="..." />` slide in `pages/en/08-challenges.md`.

## Scoring and judging

Each challenge's "done when" criteria carry fixed points (Starter 10, Core 30, Advanced 50), set in
`locales/en.ts`. Challenges with `bonus: true` earn +50% when the rule is enforced in BPMN.
Penalties: -20 per destructive action run, -10 per invented data write. Ties: most advanced
challenges completed, then most bonuses, then earliest demo-ready time, then name.

- `/judge` (only with `npm run dev`): the scoring sheet. Add attendees, tick criteria during each
  demo, and the ranking updates. Saved in the browser; use Export CSV/JSON to keep a copy.
- `judging/hidden-prompts.ts`: the unpublished test prompts, with what to check for each one.
  They appear only on `/judge`, never in the slides, the PDF or `slidev build` output.

## Diagrams

`<BpmnDiagram diagram="name" />` renders `bpmn/name.bpmn`. Click-through steps:

```html
<BpmnDiagram diagram="invoice-blended" :steps="[
  { focus: ['gw_approved'], tone: 'orange' },   // before any click
  { reveal: ['agent'], focus: ['agent'] },      // click 1
]" />
```

Steps can also pin `badges: { id: 'text' }` to elements and animate a `sequence: [ids]` (simulated execution).
`hide` and `focus` props give static views.

`<DiagramTour>` wraps a diagram with a caption per click (title, text, brand icon). It is used for
the deterministic, dispute, guardrails, phase 1 and full-agent slides:

```html
<DiagramTour diagram="invoice-deterministic" :steps="[
  { title: 'Every path is designed up front', text: '...' },
  { focus: ['categorize'], icon: 'decision-monitoring', title: 'Rules decide', text: '...' },
]" />
```

Use a typographic apostrophe (’) inside these attribute strings; a straight ' ends the string.

## Localizing

1. Copy `locales/en.ts` to e.g. `locales/de.ts`, translate, register it in `locales/index.ts`.
2. Copy `pages/en/` to `pages/de/` and translate.
3. Point `slides.md` at `pages/de/...` (or keep a `slides.de.md`) and set `locale: de`.

## Iteration 2 to-dos

- Logo: official CAMUNDA wordmark is in place (`brand/`); the C mark is kept as `camunda-mark-*.svg`
- Placeholders: search for `<Placeholder` (scenario photo)
- Screenshots in `public/images/screens` and `patterns` come from the previous deck; replace with
  current onboarding-agent screenshots
