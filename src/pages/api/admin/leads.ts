import type { APIRoute } from 'astro';
import { getTursoClient, ensureLeadsTables } from '../../../lib/turso';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureLeadsTables();
    const url = new URL(request.url);
    const stage = url.searchParams.get('stage');
    const owner = url.searchParams.get('owner');
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;
    const db = await getTursoClient();
    const filters: string[] = [];
    const args: (string | number | boolean | bigint | null)[] = [];
    if (stage) { filters.push('stage = ?'); args.push(String(stage)); }
    if (owner) { filters.push('owner = ?'); args.push(String(owner)); }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const [rowsRes, countRes] = await Promise.all([
      db.execute({ sql: `SELECT id, name, email, phone, source, stage, owner, sla_due_at, notes, created_at, updated_at FROM leads ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, args: [...args, limit, offset] }),
      db.execute({ sql: `SELECT COUNT(*) AS total FROM leads ${where}`, args }),
    ]);
    const totalRow = (countRes.rows || [])[0] as Record<string, unknown> | undefined;
    const total = Number(totalRow?.total || 0);
    return new Response(JSON.stringify({ ok: true, data: rowsRes.rows || [], pagination: { page, limit, total } }), { headers: { 'Content-Type': 'application/json' } });
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
    await ensureLeadsTables();
    const db = await getTursoClient();
    const body = await request.json();
    const action = String((body && body.action) || 'create');
    if (action === 'create') {
      const name = String(body.name || '');
      const email = String(body.email || '');
      const phone = String(body.phone || '');
      const source = String(body.source || 'manual');
      const owner = String(body.owner || 'admin');
      const stage = String(body.stage || 'prospect');
      const sla_due_at = body.sla_due_at ? String(body.sla_due_at) : null;
      const notes = body.notes ? String(body.notes) : null;
      if (!name) return new Response(JSON.stringify({ ok: false, error: 'name required' }), { status: 400 });
      const id = 'lead_' + Date.now() + Math.random().toString(36).slice(2, 8);
      const ts = new Date().toISOString();
      await db.execute({ sql: `INSERT INTO leads (id, name, email, phone, source, stage, owner, sla_due_at, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, args: [id, name, email, phone, source, stage, owner, sla_due_at, notes, ts, ts] });
      await db.execute({ sql: `INSERT INTO lead_stage_history (id, lead_id, from_stage, to_stage, changed_at, changed_by) VALUES (?, ?, ?, ?, ?, ?)`, args: ['lsh_' + Date.now() + Math.random().toString(36).slice(2, 8), id, null, stage, ts, owner] });
      return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'advance_stage') {
      const id = String(body.id || '');
      const to_stage = String(body.to_stage || 'consultation');
      const owner = String(body.owner || 'admin');
      if (!id) return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400 });
      await ensureLeadsTables();
      const find = await db.execute({ sql: `SELECT stage FROM leads WHERE id = ? LIMIT 1`, args: [id] });
      const prev = (find.rows?.[0] as Record<string, unknown> | undefined)?.stage as string | undefined;
      const ts = new Date().toISOString();
      await db.execute({ sql: `UPDATE leads SET stage = ?, updated_at = ? WHERE id = ?`, args: [to_stage, ts, id] });
      await db.execute({ sql: `INSERT INTO lead_stage_history (id, lead_id, from_stage, to_stage, changed_at, changed_by) VALUES (?, ?, ?, ?, ?, ?)`, args: ['lsh_' + Date.now() + Math.random().toString(36).slice(2, 8), id, prev || null, to_stage, ts, owner] });
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'update_sla') {
      const id = String(body.id || '');
      const sla_due_at = body.sla_due_at ? String(body.sla_due_at) : null;
      if (!id) return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400 });
      const ts = new Date().toISOString();
      await db.execute({ sql: `UPDATE leads SET sla_due_at = ?, updated_at = ? WHERE id = ?`, args: [sla_due_at, ts, id] });
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ ok: false, error: 'unknown_action' }), { status: 400 });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};
