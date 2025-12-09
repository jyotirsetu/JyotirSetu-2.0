import type { APIRoute } from 'astro'
import { ensureUsersTables, getTursoClient, ensureActivityLogTable } from '../../../lib/turso'

export const prerender = false

function getSecret(){
  const metaEnv = (import.meta as unknown as { env?: Record<string, unknown> }).env
  const fromImportMeta = typeof metaEnv?.['SESSION_SECRET'] === 'string' ? (metaEnv?.['SESSION_SECRET'] as string) : undefined
  const fromProcess = typeof process !== 'undefined' ? process.env?.['SESSION_SECRET'] : undefined
  return fromImportMeta ?? fromProcess ?? 'change-me'
}

async function getActor(request: Request){
  try {
    const secret = getSecret()
    const { verifySession } = await import('../../../lib/auth')
    const cookie = request.headers.get('cookie') || ''
    const m = /admin_session=([^;]+)/.exec(cookie)
    if (!m) return 'unknown'
    const token = decodeURIComponent(m[1])
    const s = await verifySession(token, String(secret)) as { user?: string }
    return String(s?.user || 'unknown')
  } catch { return 'unknown' }
}

async function hashPassword(pw: string){
  const crypto = await import('node:crypto')
  return crypto.createHash('sha256').update(pw).digest('hex')
}

export const GET: APIRoute = async () => {
  try {
    await ensureUsersTables()
    const db = await getTursoClient()
    const res = await db.execute(`SELECT id, username, role, created_at, updated_at FROM admin_users ORDER BY username ASC`)
    return new Response(JSON.stringify({ ok:true, data: res.rows || [] }), { headers:{ 'Content-Type':'application/json' } })
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed'
    return new Response(JSON.stringify({ ok:false, error: msg }), { status:500 })
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { isValidCsrf } = await import('../../../lib/csrf')
    if (!isValidCsrf(request)) return new Response(JSON.stringify({ ok:false, error:'csrf_failed' }), { status:403 })
    await ensureUsersTables(); await ensureActivityLogTable()
    const db = await getTursoClient()
    const body = await request.json()
    const username = String(body.username||'').trim()
    const password = String(body.password||'')
    const role = String(body.role||'support')
    if (!username || !password) return new Response(JSON.stringify({ ok:false, error:'missing_fields' }), { status:400 })
    const id = 'adm_'+Date.now()+Math.random().toString(36).slice(2,8)
    const now = new Date().toISOString()
    const ph = await hashPassword(password)
    await db.execute({ sql:`INSERT INTO admin_users (id, username, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`, args:[id, username, ph, role, now, now] })
    const actor = await getActor(request)
    await db.execute({ sql:`INSERT INTO activity_log (id, action, entity_type, entity_id, user, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, args:['act_'+Date.now()+Math.random().toString(36).slice(2,8),'create','admin_user',id,actor,JSON.stringify({ username, role }), now] })
    return new Response(JSON.stringify({ ok:true, id }), { headers:{ 'Content-Type':'application/json' } })
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed'
    return new Response(JSON.stringify({ ok:false, error: msg }), { status:500 })
  }
}

export const PUT: APIRoute = async ({ request }) => {
  try {
    const { isValidCsrf } = await import('../../../lib/csrf')
    if (!isValidCsrf(request)) return new Response(JSON.stringify({ ok:false, error:'csrf_failed' }), { status:403 })
    await ensureUsersTables(); await ensureActivityLogTable()
    const db = await getTursoClient()
    const body = await request.json()
    const id = String(body.id||'').trim()
    const role = String(body.role||'')
    const permissions = Array.isArray(body.permissions)? body.permissions.map(String): []
    if (!id) return new Response(JSON.stringify({ ok:false, error:'missing_id' }), { status:400 })
    const now = new Date().toISOString()
    if (role) await db.execute({ sql:`UPDATE admin_users SET role=?, updated_at=? WHERE id=?`, args:[role, now, id] })
    await db.execute({ sql:`DELETE FROM admin_permissions WHERE user_id=?`, args:[id] })
    for (const p of permissions) {
      const pid = 'perm_'+Date.now()+Math.random().toString(36).slice(2,8)
      await db.execute({ sql:`INSERT INTO admin_permissions (id, user_id, permission, created_at) VALUES (?, ?, ?, ?)`, args:[pid, id, p, now] })
    }
    const actor = await getActor(request)
    await db.execute({ sql:`INSERT INTO activity_log (id, action, entity_type, entity_id, user, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, args:['act_'+Date.now()+Math.random().toString(36).slice(2,8),'update','admin_user',id,actor,JSON.stringify({ role, permissions }), now] })
    return new Response(JSON.stringify({ ok:true }), { headers:{ 'Content-Type':'application/json' } })
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed'
    return new Response(JSON.stringify({ ok:false, error: msg }), { status:500 })
  }
}
