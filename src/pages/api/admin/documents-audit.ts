import type { APIRoute } from 'astro'
import { getTursoClient, ensureDocumentShareTables } from '../../../lib/turso'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    await ensureDocumentShareTables()
    const db = await getTursoClient()
    const body = await request.json()
    const document_id = String(body.document_id || '')
    const by_user = body.by_user ? String(body.by_user) : null
    const ip = (request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || '').split(',')[0].trim() || null
    if (!document_id) return new Response(JSON.stringify({ ok: false, error: 'document_id required' }), { status: 400 })
    const id = 'dd_' + Date.now() + Math.random().toString(36).slice(2,8)
    await db.execute({ sql: `INSERT INTO document_downloads (id, document_id, by_user, downloaded_at, ip) VALUES (?, ?, ?, ?, ?)`, args: [id, document_id, by_user, new Date().toISOString(), ip] })
    return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed'
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 })
  }
}
