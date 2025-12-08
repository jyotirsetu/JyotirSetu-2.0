import type { APIRoute } from 'astro';
import { getTursoClient, ensureRemediesTable } from '../../../lib/turso';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureRemediesTable();
    const url = new URL(request.url);
    const client_id = url.searchParams.get('client_id');
    const db = await getTursoClient();
    const res = await db.execute({
      sql: client_id
        ? `SELECT * FROM remedies WHERE client_id = ? ORDER BY datetime(created_at) DESC`
        : `SELECT * FROM remedies ORDER BY datetime(created_at) DESC LIMIT 100`,
      args: client_id ? [String(client_id)] : [],
    });
    return new Response(JSON.stringify({ ok: true, data: res.rows || [] }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { isValidCsrf } = await import('../../../lib/csrf');
    if (!isValidCsrf(request)) {
      return new Response(JSON.stringify({ ok: false, error: 'csrf_failed' }), { status: 403 });
    }
    await ensureRemediesTable();
    const db = await getTursoClient();
    const body = await request.json();
    const action = String((body && body.action) || 'create');
    if (action === 'create') {
      const client_id = String(body.client_id || '');
      const type = String(body.type || 'gemstone');
      const title = String(body.title || '');
      const start_date = body.start_date ? String(body.start_date) : null;
      const end_date = body.end_date ? String(body.end_date) : null;
      const adherence = Number(body.adherence || 0);
      const notes = body.notes ? String(body.notes) : null;
      if (!client_id || !title) return new Response(JSON.stringify({ ok: false, error: 'missing_fields' }), { status: 400 });
      const id = 'rem_' + Date.now() + Math.random().toString(36).slice(2, 8);
      const ts = new Date().toISOString();
      await db.execute({
        sql: `INSERT INTO remedies (id, client_id, type, title, start_date, end_date, adherence, notes, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'planned', ?, ?)`,
        args: [id, client_id, type, title, start_date, end_date, adherence, notes, ts, ts],
      });
      return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'update_status') {
      const id = String(body.id || '');
      const status = String(body.status || 'planned');
      if (!id) return new Response(JSON.stringify({ ok: false, error: 'missing_id' }), { status: 400 });
      const ts = new Date().toISOString();
      await db.execute({ sql: `UPDATE remedies SET status = ?, updated_at = ? WHERE id = ?`, args: [status, ts, id] });
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ ok: false, error: 'unknown_action' }), { status: 400 });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};

