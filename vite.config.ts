import type { Plugin } from 'vite'
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { defineConfig } from 'vite'

/**
 * Dev-only endpoint behind the export buttons on /nav:
 *   GET /__export-handout?name=challenges  ->  the handout PDF, as a download
 * It runs scripts/export-handout.mjs (the same as `npm run export:challenges`) into a temp
 * folder and streams the result back. One export at a time.
 */
function handoutExport(): Plugin {
  let busy = false
  return {
    name: 'handout-export',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__export-handout', async (req, res) => {
        const name = new URL(req.url ?? '', 'http://x').searchParams.get('name') ?? ''
        if (!/^[\w-]+$/.test(name)) {
          res.statusCode = 400
          return res.end('Missing or invalid handout name')
        }
        if (busy) {
          res.statusCode = 409
          return res.end('An export is already running')
        }
        busy = true
        const dir = await mkdtemp(join(tmpdir(), 'handout-'))
        try {
          const log: string[] = []
          const code = await new Promise<number | null>((done) => {
            const child = spawn(process.execPath, ['scripts/export-handout.mjs', name, '--output', join(dir, name)], { cwd: server.config.root })
            child.stdout.on('data', d => log.push(String(d)))
            child.stderr.on('data', d => log.push(String(d)))
            child.on('close', done)
          })
          if (code !== 0) {
            res.statusCode = 500
            return res.end(log.join('').slice(-2000) || `Export failed (exit ${code})`)
          }
          const pdf = await readFile(join(dir, `${name}.pdf`))
          res.setHeader('Content-Type', 'application/pdf')
          res.setHeader('Content-Disposition', `attachment; filename="agentic-orchestration-${name}.pdf"`)
          res.end(pdf)
        }
        catch (e: any) {
          res.statusCode = 500
          res.end(String(e?.message ?? e))
        }
        finally {
          busy = false
          rm(dir, { recursive: true, force: true }).catch(() => {})
        }
      })
    },
  }
}

// `slidev export` starts its own Vite server. Sharing node_modules/.vite with a running
// `npm run dev` makes each server re-optimise and wipe the other's deps, which reloads the
// export page mid-capture and leaves "Loading slide" pages in the PDF. Exports get their own cache.
const isExport = process.argv.slice(2).includes('export')

export default defineConfig({
  cacheDir: isExport ? 'node_modules/.vite-export' : undefined,
  optimizeDeps: {
    // imported only by BpmnDiagram; listing it avoids a late "deps changed, reloading" on first use
    include: ['bpmn-js/lib/NavigatedViewer'],
  },
  plugins: [handoutExport()],
})
