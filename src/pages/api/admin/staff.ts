import type { APIRoute } from 'astro'
import { getTursoClient, ensureStaffTables } from '../../../lib/turso'

export const prerender = false

function getSecret() {
  const metaEnv = (import.meta as unknown as { env?: Record<string, unknown> }).env
  const fromImportMeta = typeof metaEnv?.['SESSION_SECRET'] === 'string' ? (metaEnv?.['SESSION_SECRET'] as string) : undefined
  const fromProcess = typeof process !== 'undefined' ? process.env?.['SESSION_SECRET'] : undefined
  return fromImportMeta ?? fromProcess ?? 'change-me'
}

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureStaffTables()
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const db = await getTursoClient()
    if (id) {
      const res = await db.execute({ sql: `SELECT * FROM staff WHERE id = ? LIMIT 1`, args: [String(id)] })
      const row = res.rows?.[0] || null
      return new Response(JSON.stringify({ ok: true, data: row }), { headers: { 'Content-Type': 'application/json' } })
    }
    const res = await db.execute({ sql: `SELECT * FROM staff ORDER BY datetime(updated_at) DESC`, args: [] })
    return new Response(JSON.stringify({ ok: true, data: res.rows || [] }), { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed'
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 })
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const secret = getSecret()
    const { requireRole } = await import('../../../lib/rbac')
    const { isValidCsrf } = await import('../../../lib/csrf')
    if (!(await requireRole(request, String(secret), ['admin']))) return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 403 })
    if (!isValidCsrf(request)) return new Response(JSON.stringify({ ok: false, error: 'csrf_failed' }), { status: 403 })
    await ensureStaffTables()
    const db = await getTursoClient()
    const body = await request.json()
    const action = String(body.action || 'upsert')
    if (action === 'upsert') {
      const id = String(body.id || 'stf_' + Date.now() + Math.random().toString(36).slice(2,8))
      const now = new Date().toISOString()
      await db.execute({ sql: `INSERT INTO staff (id, name, email, phone, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name=excluded.name, email=excluded.email, phone=excluded.phone, role=excluded.role, updated_at=excluded.updated_at`, args: [id, String(body.name||''), body.email? String(body.email): null, body.phone? String(body.phone): null, String(body.role||'consultant'), now, now] })
      return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } })
    }
    if (action === 'delete') {
      const id = String(body.id || '')
      if (!id) return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400 })
      await db.execute({ sql: `DELETE FROM staff WHERE id = ?`, args: [id] })
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
    }
    return new Response(JSON.stringify({ ok: false, error: 'invalid_action' }), { status: 400 })
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed'
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 })
  }
}
