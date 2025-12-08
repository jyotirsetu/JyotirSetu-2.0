import type { APIRoute } from 'astro'
import { getTursoClient, ensureDocumentsTables, ensureDocumentShareTables } from '../../../lib/turso'

export const prerender = false

function getSecret() {
  const metaEnv = (import.meta as unknown as { env?: Record<string, unknown> }).env
  const fromImportMeta = typeof metaEnv?.['SESSION_SECRET'] === 'string' ? (metaEnv?.['SESSION_SECRET'] as string) : undefined
  const fromProcess = typeof process !== 'undefined' ? process.env?.['SESSION_SECRET'] : undefined
  return fromImportMeta ?? fromProcess ?? 'change-me'
}

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureDocumentsTables()
    await ensureDocumentShareTables()
    const url = new URL(request.url)
    const token = String(url.searchParams.get('token') || '')
    const download = url.searchParams.get('download') === '1'
    if (!token) return new Response(JSON.stringify({ ok: false, error: 'token required' }), { status: 400 })
    const db = await getTursoClient()
    const res = await db.execute({ sql: `SELECT l.token, l.expires_at, l.download_count, l.last_download_at, d.id AS document_id, d.title, d.mime_type, d.size, d.storage_url FROM document_share_links l LEFT JOIN documents d ON d.id = l.document_id WHERE l.token = ? LIMIT 1`, args: [token] })
    const row = (res.rows?.[0] ?? {}) as Record<string, unknown>
    if (!row) return new Response(JSON.stringify({ ok: false, error: 'invalid_token' }), { status: 404 })
    const exp = row['expires_at'] ? new Date(String(row['expires_at'])).getTime() : null
    if (exp && Date.now() > exp) return new Response(JSON.stringify({ ok: false, error: 'expired' }), { status: 410 })
    
    // If download is requested, update download count and audit log
    if (download) {
      const now = new Date().toISOString()
      await db.execute({ sql: `UPDATE document_share_links SET download_count = COALESCE(download_count, 0) + 1, last_download_at = ? WHERE token = ?`, args: [now, token] })
      
      // Log the download
      const auditId = 'audit_' + Date.now() + Math.random().toString(36).slice(2,8)
      const ip = (request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || '').split(',')[0].trim()
      const userAgent = request.headers.get('user-agent') || ''
      await db.execute({ sql: `INSERT INTO document_audit_log (id, document_id, action, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?)`, args: [auditId, String(row['document_id']||''), 'download_via_share', ip, userAgent, now] })
      
      // Return the document data for download
      return new Response(JSON.stringify({ ok: true, download_url: String(row['storage_url']||''), filename: String(row['title']||'') }), { headers: { 'Content-Type': 'application/json' } })
    }
    
    return new Response(JSON.stringify({ ok: true, data: row }), { headers: { 'Content-Type': 'application/json' } })
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
    await ensureDocumentsTables()
    await ensureDocumentShareTables()
    const db = await getTursoClient()
    const body = await request.json()
    const document_id = String(body.document_id || '')
    const ttl_hours = Number(body.ttl_hours || 24)
    if (!document_id) return new Response(JSON.stringify({ ok: false, error: 'document_id required' }), { status: 400 })
    const token = 'share_' + Date.now() + Math.random().toString(36).slice(2,8)
    const now = new Date()
    const exp = new Date(now.getTime() + ttl_hours * 3600 * 1000).toISOString()
    await db.execute({ sql: `INSERT INTO document_share_links (token, document_id, expires_at, created_at) VALUES (?, ?, ?, ?)`, args: [token, document_id, exp, now.toISOString()] })
    return new Response(JSON.stringify({ ok: true, token, expires_at: exp }), { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed'
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 })
  }
}
