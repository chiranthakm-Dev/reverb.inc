import { createServer } from 'node:http'
import { DatabaseSync } from 'node:sqlite'
import { mkdirSync, readFileSync, existsSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateEnquiry } from './validation.js'

const root = join(fileURLToPath(new URL('..', import.meta.url)))
const production = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT || 8787)
const dataDir = join(root, 'data')
mkdirSync(dataDir, { recursive: true })
const db = new DatabaseSync(join(dataDir, 'reverb.sqlite'))
db.exec(`CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, company TEXT,
  service TEXT NOT NULL, languages TEXT NOT NULL, timeline TEXT, budget TEXT,
  scope TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL
)`)
const insert = db.prepare(`INSERT INTO enquiries (name,email,company,service,languages,timeline,budget,scope,created_at)
  VALUES (@name,@email,@company,@service,@languages,@timeline,@budget,@scope,@created_at)`)
const attempts = new Map()
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.json': 'application/json' }

function headers(extra = {}) {
  return { 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()', ...extra }
}
function json(res, status, payload) { res.writeHead(status, headers({ 'Content-Type': 'application/json; charset=utf-8' })); res.end(JSON.stringify(payload)) }
function limited(ip) {
  const now = Date.now(); const recent = (attempts.get(ip) || []).filter(time => now - time < 60_000)
  recent.push(now); attempts.set(ip, recent); return recent.length > 5
}
async function body(req) {
  let value = ''
  for await (const chunk of req) { value += chunk; if (value.length > 20_000) throw new Error('Request too large') }
  return JSON.parse(value || '{}')
}
function serveStatic(req, res) {
  if (!production) return false
  const dist = join(root, 'dist')
  const requested = req.url === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '')
  const safe = normalize(requested).replace(/^(\.\.(\/|\\|$))+/, '')
  let file = join(dist, safe)
  if (!existsSync(file) || !extname(file)) file = join(dist, 'index.html')
  if (!existsSync(file)) return false
  res.writeHead(200, headers({ 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': extname(file) === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable' }))
  res.end(readFileSync(file)); return true
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  if (url.pathname === '/api/health' && req.method === 'GET') return json(res, 200, { ok: true })
  if (url.pathname === '/api/enquiries' && req.method === 'POST') {
    const ip = req.socket.remoteAddress || 'unknown'
    if (limited(ip)) return json(res, 429, { error: 'Too many attempts. Please wait a minute and try again.' })
    try {
      const result = validateEnquiry(await body(req))
      if (!result.ok) return json(res, result.status, { error: result.error })
      const record = { ...result.value, created_at: new Date().toISOString() }
      const saved = insert.run(record)
      return json(res, 201, { id: Number(saved.lastInsertRowid), message: 'Thank you. Your enquiry has been received.' })
    } catch (error) { return json(res, error.message === 'Request too large' ? 413 : 400, { error: 'Invalid request.' }) }
  }
  if (url.pathname === '/api/admin/enquiries' && req.method === 'GET') {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) return json(res, 401, { error: 'Unauthorized' })
    const rows = db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 250').all()
    return json(res, 200, { enquiries: rows })
  }
  if (serveStatic(req, res)) return
  json(res, 404, { error: 'Not found' })
})

server.listen(port, () => console.log(`Reverb API listening on http://localhost:${port}`))
