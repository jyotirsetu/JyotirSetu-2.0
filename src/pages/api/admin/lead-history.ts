import type { APIRoute } from 'astro'
import { getTursoClient, ensureLeadsTables } from '../../../lib/turso'

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureLeadsTables()
    const url = new URL(request.url)
    const lead_id = String(url.searchParams.get('lead_id') || '')
    if (!lead_id) return new Response(JSON.stringify({ ok: false, error: 'lead_id required' }), { status: 400 })
    const db = await getTursoClient()
    const res = await db.execute({ sql: `SELECT id, lead_id, from_stage, to_stage, changed_at, changed_by, note FROM lead_stage_history WHERE lead_id = ? ORDER BY changed_at DESC LIMIT 100`, args: [lead_id] })
    return new Response(JSON.stringify({ ok: true, data: res.rows || [] }), { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed'
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 })
  }
}
