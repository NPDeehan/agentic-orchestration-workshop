<script setup lang="ts">
/**
 * Judge sheet at /judge (dev mode only, never in builds or the PDF).
 * Tick criteria as each attendee demos. Totals and ranking follow the published rules:
 *   points per criterion, +50% on bonus challenges if enforced in BPMN,
 *   -20 per destructive action, -10 per invented data write,
 *   ties: most advanced challenges completed, most bonuses, earliest demo-ready time, then name.
 * Saved in this browser's local storage. Export CSV or JSON to keep a copy.
 */
import { computed, reactive, ref, watch } from 'vue'
import configs from '#slidev/configs'
import { getLocale } from '../locales'
import type { Challenge } from '../locales/types'
// hidden-prompts.ts is kept out of git (the repo is public). Load it only if it exists, so a
// fresh clone still builds; copy hidden-prompts.example.ts to create it.
const promptFiles = import.meta.glob('./hidden-prompts.ts', { eager: true }) as Record<string, { hiddenPrompts: Record<string, { prompt: string; check: string }[]> }>
const hiddenPrompts = Object.values(promptFiles)[0]?.hiddenPrompts ?? {}

interface ChallengeScore { checks: boolean[]; bonus: boolean; destructive: number; invented: number }
interface Attendee { id: string; name: string; readyAt: string; scores: Record<string, ChallengeScore> }

const t = getLocale((configs as any).locale)
const challenges: Challenge[] = t.challenges
const levelName = t.ui.levels
const KEY = 'agentic-workshop-judge-v1'

function load(): Attendee[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
  catch { return [] }
}
const state = reactive<{ attendees: Attendee[] }>({ attendees: load() })
watch(() => state.attendees, (v) => {
  try { localStorage.setItem(KEY, JSON.stringify(v)) }
  catch { /* storage unavailable: export to keep a copy */ }
}, { deep: true })

const newName = ref('')
const selectedId = ref<string | undefined>(state.attendees[0]?.id)
const openChallenge = ref<string | undefined>()

function addAttendee() {
  const name = newName.value.trim()
  if (!name) return
  const a: Attendee = { id: Math.random().toString(36).slice(2, 10), name, readyAt: '', scores: {} }
  state.attendees.push(a)
  selectedId.value = a.id
  newName.value = ''
}
function removeAttendee(id: string) {
  if (!confirm('Remove this attendee and their scores?')) return
  state.attendees = state.attendees.filter(a => a.id !== id)
  if (selectedId.value === id) selectedId.value = state.attendees[0]?.id
}
function scoreOf(a: Attendee, c: Challenge): ChallengeScore {
  if (!a.scores[c.id]) a.scores[c.id] = { checks: c.done.map(() => false), bonus: false, destructive: 0, invented: 0 }
  return a.scores[c.id]
}
function peek(a: Attendee, c: Challenge): ChallengeScore | undefined { return a.scores[c.id] }

function challengePoints(a: Attendee, c: Challenge) {
  const s = peek(a, c)
  if (!s) return 0
  const base = c.done.reduce((sum, d, i) => sum + (s.checks[i] ? d.points : 0), 0)
  const withBonus = c.bonus && s.bonus && base > 0 ? Math.round(base * 1.5) : base
  return withBonus - 20 * s.destructive - 10 * s.invented
}
const completed = (a: Attendee, c: Challenge) => !!peek(a, c)?.checks.every(Boolean)

function summary(a: Attendee) {
  return {
    total: challenges.reduce((s, c) => s + challengePoints(a, c), 0),
    advanced: challenges.filter(c => c.level === 3 && completed(a, c)).length,
    bonuses: challenges.filter(c => c.bonus && peek(a, c)?.bonus && challengePoints(a, c) > 0).length,
    completed: challenges.filter(c => completed(a, c)).length,
  }
}

const ranking = computed(() => state.attendees
  .map(a => ({ a, ...summary(a) }))
  .sort((x, y) =>
    y.total - x.total
    || y.advanced - x.advanced
    || y.bonuses - x.bonuses
    || (x.a.readyAt || '99:99').localeCompare(y.a.readyAt || '99:99')
    || x.a.name.localeCompare(y.a.name)))

const selected = computed(() => state.attendees.find(a => a.id === selectedId.value))
const maxFor = (c: Challenge) => c.done.reduce((s, d) => s + d.points, 0)

function download(name: string, text: string, type: string) {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url; link.download = name; link.click()
  URL.revokeObjectURL(url)
}
function exportCsv() {
  const head = ['rank', 'name', 'total', 'advanced_completed', 'bonuses', 'ready_at', ...challenges.map(c => c.id)]
  const rows = ranking.value.map((r, i) => [i + 1, r.a.name, r.total, r.advanced, r.bonuses, r.a.readyAt, ...challenges.map(c => challengePoints(r.a, c))])
  const csv = [head, ...rows].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  download('workshop-scores.csv', csv, 'text/csv')
}
function exportJson() { download('workshop-scores.json', JSON.stringify(state.attendees, null, 2), 'application/json') }
function importJson(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  file.text().then((txt) => {
    try {
      const data = JSON.parse(txt)
      if (Array.isArray(data) && confirm(`Replace current scores with ${data.length} attendees from the file?`)) {
        state.attendees = data
        selectedId.value = data[0]?.id
      }
    }
    catch { alert('That file is not a valid scores export.') }
  })
}
</script>

<template>
  <div class="judge">
    <header>
      <div>
        <div class="eyebrow">Judge only · not in the deck</div>
        <h1 class="display">Challenge scoring</h1>
      </div>
      <div class="actions">
        <button class="btn" @click="exportCsv">Export CSV</button>
        <button class="btn" @click="exportJson">Export JSON</button>
        <label class="btn">Import JSON<input type="file" accept="application/json" hidden @change="importJson"></label>
      </div>
    </header>

    <div class="cols">
      <!-- Ranking -->
      <section class="panel">
        <h2>Ranking</h2>
        <form class="add" @submit.prevent="addAttendee">
          <input v-model="newName" placeholder="Attendee name">
          <button class="btn dark" type="submit">Add</button>
        </form>
        <table v-if="ranking.length">
          <thead><tr><th>#</th><th>Name</th><th>Points</th><th title="Advanced challenges completed">Adv</th><th title="Process bonuses earned">Bonus</th><th>Ready</th></tr></thead>
          <tbody>
            <tr v-for="(r, i) in ranking" :key="r.a.id" :class="{ sel: r.a.id === selectedId }" @click="selectedId = r.a.id">
              <td>{{ i + 1 }}.</td><td>{{ r.a.name }}</td><td class="num">{{ r.total }}</td>
              <td class="num">{{ r.advanced }}</td><td class="num">{{ r.bonuses }}</td><td>{{ r.a.readyAt || '–' }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="muted small">Add attendees as they sign up for a demo.</p>
        <p class="muted xs rules">Ties: most advanced challenges completed, then most bonuses, then earliest ready time, then name.</p>
      </section>

      <!-- Scoring one attendee -->
      <section v-if="selected" class="panel wide">
        <div class="att-head">
          <h2>{{ selected.name }} <span class="muted">· {{ summary(selected).total }} points</span></h2>
          <label class="small">Ready to demo at <input v-model="selected.readyAt" type="time"></label>
          <button class="btn ghost" @click="removeAttendee(selected.id)">Remove</button>
        </div>

        <div v-for="c in challenges" :key="c.id" class="ch" :class="{ open: openChallenge === c.id, scored: challengePoints(selected, c) !== 0 }">
          <button class="ch-row" @click="openChallenge = openChallenge === c.id ? undefined : c.id">
            <span class="lvl" :class="`l${c.level}`">{{ levelName[c.level] }}</span>
            <span class="ttl">{{ c.title }}</span>
            <span v-if="c.bonus" class="tag">bonus</span>
            <span class="pts">{{ challengePoints(selected, c) }} / {{ maxFor(c) }}</span>
          </button>

          <div v-if="openChallenge === c.id" class="ch-body">
            <div class="grid">
              <div>
                <h3>Criteria</h3>
                <label v-for="(d, i) in c.done" :key="i" class="crit">
                  <input v-model="scoreOf(selected, c).checks[i]" type="checkbox">
                  <span>{{ d.text }}</span><b>{{ d.points }}</b>
                </label>
                <label v-if="c.bonus" class="crit bonus">
                  <input v-model="scoreOf(selected, c).bonus" type="checkbox">
                  <span>Rule enforced in BPMN (gateway, decision or gatekeeper task), not only the prompt</span><b>+50%</b>
                </label>
                <div class="pen">
                  <label>Destructive actions run <input v-model.number="scoreOf(selected, c).destructive" type="number" min="0"> × −20</label>
                  <label>Invented data written <input v-model.number="scoreOf(selected, c).invented" type="number" min="0"> × −10</label>
                </div>
              </div>
              <div>
                <h3>Published prompts</h3>
                <ul class="plist"><li v-for="p in c.prompts" :key="p">“{{ p }}”</li></ul>
                <h3>Hidden prompts</h3>
                <div v-for="h in hiddenPrompts[c.id] || []" :key="h.prompt" class="hidden-p">
                  <div>“{{ h.prompt }}”</div>
                  <div class="muted xs">Check: {{ h.check }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.judge { position: fixed; inset: 0; overflow-y: auto; background: var(--c-sand); color: var(--c-black); font-family: var(--font-body); letter-spacing: -0.02em; padding: 32px 40px 80px; }
header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 22px; }
h1 { font-size: 44px; margin: 0; font-weight: 400; }
h2 { font-size: 20px; font-weight: 400; margin: 0 0 12px; }
h3 { font-size: 13px; font-weight: 400; letter-spacing: 0.02em; text-transform: uppercase; color: var(--c-mid-gray); margin: 14px 0 8px; }
.muted { color: var(--c-mid-gray); }
.small { font-size: 14px; } .xs { font-size: 12px; }
.actions { display: flex; gap: 8px; }
.btn { font: inherit; font-size: 14px; padding: 8px 14px; border: 1px solid var(--c-warm-light-gray); border-radius: 999px; background: #fff; color: inherit; cursor: pointer; }
.btn:hover { border-color: var(--c-black); }
.btn.dark { background: var(--c-black); color: #fff; border-color: var(--c-black); }
.btn.ghost { background: none; }
.cols { display: grid; grid-template-columns: 420px 1fr; gap: 20px; align-items: start; }
.panel { background: #fff; border: 1px solid var(--c-warm-light-gray); border-radius: 6px; padding: 20px 22px; }
.add { display: flex; gap: 8px; margin-bottom: 14px; }
.add input { flex: 1; font: inherit; font-size: 14px; padding: 8px 12px; border: 1px solid var(--c-warm-light-gray); border-radius: 6px; }
table { width: 100%; border-collapse: collapse; font-size: 14px; }
th { text-align: left; font-weight: 400; color: var(--c-mid-gray); font-size: 12px; text-transform: uppercase; letter-spacing: 0.02em; padding: 6px 4px; border-bottom: 1px solid var(--c-warm-light-gray); }
td { padding: 8px 4px; border-bottom: 1px solid var(--c-sand); cursor: pointer; }
td.num { font-variant-numeric: tabular-nums; }
tr.sel td { background: var(--c-purple-50); }
.rules { margin-top: 14px; }
.att-head { display: flex; align-items: center; gap: 18px; margin-bottom: 10px; }
.att-head h2 { margin: 0; flex: 1; }
.att-head input { font: inherit; padding: 4px 6px; border: 1px solid var(--c-warm-light-gray); border-radius: 4px; }
.ch { border: 1px solid var(--c-warm-light-gray); border-radius: 6px; margin-bottom: 6px; }
.ch.scored { border-left: 4px solid var(--c-purple); }
.ch-row { width: 100%; display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: none; border: 0; font: inherit; color: inherit; cursor: pointer; text-align: left; }
.lvl { font-size: 11px; letter-spacing: 0.02em; text-transform: uppercase; width: 70px; }
.lvl.l1 { color: var(--c-green-800); } .lvl.l2 { color: var(--c-purple-700); } .lvl.l3 { color: var(--c-orange-700); }
.ttl { flex: 1; font-size: 15px; }
.tag { font-size: 11px; text-transform: uppercase; letter-spacing: 0.02em; padding: 2px 8px; border-radius: 999px; background: var(--c-green-100); }
.pts { font-variant-numeric: tabular-nums; font-size: 14px; }
.ch-body { padding: 0 14px 14px; border-top: 1px solid var(--c-sand); }
.grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 24px; }
.crit { display: grid; grid-template-columns: 20px 1fr 44px; gap: 8px; align-items: start; font-size: 14px; padding: 6px 0; border-bottom: 1px solid var(--c-sand); cursor: pointer; }
.crit b { font-weight: 400; text-align: right; font-variant-numeric: tabular-nums; }
.crit.bonus span { color: var(--c-green-800); }
.pen { display: grid; gap: 6px; margin-top: 10px; font-size: 13px; }
.pen input { width: 48px; font: inherit; padding: 2px 4px; border: 1px solid var(--c-warm-light-gray); border-radius: 4px; }
.plist { margin: 0; padding-left: 18px; font-size: 14px; }
.hidden-p { background: var(--c-orange-50); border: 1px dashed var(--c-orange-400); border-radius: 6px; padding: 8px 10px; margin-bottom: 6px; font-size: 14px; }
</style>
