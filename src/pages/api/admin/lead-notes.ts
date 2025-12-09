import type { APIRoute } from 'astro';
import { getTursoClient, ensureLeadsTables } from '../../../lib/turso';
import { isValidCsrf, getCsrfTokenFromCookie } from '../../../lib/csrf';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureLeadsTables();
    const url = new URL(request.url);
    const leadId = url.searchParams.get('lead_id');
    
    if (!leadId) {
      return new Response(JSON.stringify({ ok: false, error: 'lead_id required' }), { status: 400 });
    }

    const db = await getTursoClient();
    const result = await db.execute({
      sql: `SELECT id, lead_id, note, created_at, created_by FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC`,
      args: [leadId]
    });

    return new Response(JSON.stringify({ ok: true, data: result.rows }), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const cookieToken = getCsrfTokenFromCookie(request.headers.get('cookie') || '');
    if (cookieToken && !isValidCsrf(request)) {
      return new Response(JSON.stringify({ ok: false, error: 'csrf_failed' }), { status: 403 });
    }

    await ensureLeadsTables();
    const db = await getTursoClient();
    const body = await request.json();
    
    const leadId = String(body.lead_id || '');
    const note = String(body.note || '');
    const actor = await getActor(request);

    if (!leadId || !note) {
      return new Response(JSON.stringify({ ok: false, error: 'lead_id and note required' }), { status: 400 });
    }

    const id = 'note_' + Date.now() + Math.random().toString(36).slice(2, 8);
    const ts = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO lead_notes (id, lead_id, note, created_at, created_by) VALUES (?, ?, ?, ?, ?)`,
      args: [id, leadId, note, ts, actor]
    });

    return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const cookieToken = getCsrfTokenFromCookie(request.headers.get('cookie') || '');
    if (cookieToken && !isValidCsrf(request)) {
      return new Response(JSON.stringify({ ok: false, error: 'csrf_failed' }), { status: 403 });
    }

    await ensureLeadsTables();
    const db = await getTursoClient();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400 });
    }

    await db.execute({
      sql: `DELETE FROM lead_notes WHERE id = ?`,
      args: [id]
    });

    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};

async function getActor(request: Request): Promise<string> {
  try {
    const { verifySession } = await import('../../../lib/auth');
    const secret = ((import.meta as unknown as { env?: Record<string, unknown> }).env?.['SESSION_SECRET'] as string) || (process.env?.['SESSION_SECRET'] || 'change-me');
    const cookie = request.headers.get('cookie') || '';
    const m = /admin_session=([^;]+)/.exec(cookie);
    if (!m) return 'admin';
    const token = decodeURIComponent(m[1]);
    const s = await verifySession(token, String(secret)) as { user?: string };
    return String(s?.user || 'admin');
  } catch { return 'admin'; }
}
