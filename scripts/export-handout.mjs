// Export one handout (a tagged set of slides) to its own PDF.
//
//   node scripts/export-handout.mjs challenges            -> agentic-orchestration-challenges.pdf
//   node scripts/export-handout.mjs challenges --format png   (extra args go to `slidev export`)
//
// A slide belongs to handout <name> when its frontmatter has `handout: <name>`. Put it on a
// `src:` import in slides.md and every slide in that file inherits it. Breakout (countdown)
// slides are left out: a timer means nothing on paper. The /nav page uses the same rule.
//
// The page range is worked out from the deck each time, so it stays right when slides are
// added, removed or hidden elsewhere.
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { load } from '@slidev/parser/fs'

const SKIP_LAYOUTS = ['breakout'] // keep in step with navigator/Navigator.vue

const [name, ...extra] = process.argv.slice(2)
if (!name || name.startsWith('-')) {
  console.error('Usage: node scripts/export-handout.mjs <handout-name> [slidev export args]')
  process.exit(1)
}

const root = process.cwd()
const { slides } = await load({ userRoot: root, roots: [root] }, resolve(root, 'slides.md'))

// slide numbers here match Slidev's page numbers (hidden slides are already excluded)
const pages = slides
  .map((s, i) => ({ no: i + 1, fm: s.frontmatter }))
  .filter(s => s.fm.handout === name && !SKIP_LAYOUTS.includes(s.fm.layout))
  .map(s => s.no)

if (!pages.length) {
  console.error(`No slides tagged "handout: ${name}". Add it to the section's src: import in slides.md.`)
  process.exit(1)
}

// compress 36,37,38,41 -> "36-38,41"
const range = pages.reduce((runs, n) => {
  const last = runs.at(-1)
  if (last && n === last[1] + 1) last[1] = n
  else runs.push([n, n])
  return runs
}, []).map(([a, b]) => (a === b ? `${a}` : `${a}-${b}`)).join(',')

const hasOutput = extra.includes('--output')
const args = [
  'export', '--range', range, '--timeout', '120000', '--wait', '1500',
  ...(hasOutput ? [] : ['--output', `agentic-orchestration-${name}`]),
  ...extra,
]

const require = createRequire(import.meta.url)
const cli = resolve(dirname(require.resolve('@slidev/cli/package.json')), 'bin/slidev.mjs')

// Exports use their own Vite cache (see vite.config.ts). When that cache is cold, Vite is still
// bundling dependencies while the first pages are captured, and they come out as "Loading slide".
// So when the cache is missing or older than what invalidates it, do a throwaway pass first.
const meta = resolve(root, 'node_modules/.vite-export/deps/_metadata.json')
const mtime = p => (existsSync(p) ? statSync(p).mtimeMs : 0)
const cold = !existsSync(meta)
  || mtime(meta) < Math.max(mtime(resolve(root, 'package-lock.json')), mtime(resolve(root, 'vite.config.ts')))
if (cold) {
  console.log('Preparing the export cache (first export after a dependency or config change)...')
  const tmp = mkdtempSync(join(tmpdir(), 'handout-warm-'))
  spawnSync(process.execPath, [cli, 'export', '--range', range, '--timeout', '120000', '--output', join(tmp, 'warm')], { stdio: 'ignore' })
  rmSync(tmp, { recursive: true, force: true })
}

console.log(`Exporting ${pages.length} "${name}" slides (pages ${range})`)
const { status } = spawnSync(process.execPath, [cli, ...args], { stdio: 'inherit' })
process.exit(status ?? 1)
