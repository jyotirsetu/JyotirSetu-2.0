import type { APIRoute } from 'astro';
import { getTursoClient, ensureFulfillmentTables } from '../../../lib/turso';
import { logActivity } from '../../../lib/activity-logger';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureFulfillmentTables();
    const url = new URL(request.url);
    const client_id = url.searchParams.get('client_id');
    const status = url.searchParams.get('status');
    const db = await getTursoClient();
    const filters: string[] = [];
    const args: (string | number | boolean | bigint | null)[] = [];
    if (client_id) { filters.push('client_id = ?'); args.push(String(client_id)); }
    if (status) { filters.push('status = ?'); args.push(String(status)); }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const res = await db.execute({ sql: `SELECT * FROM fulfillment_tasks ${where} ORDER BY datetime(created_at) DESC`, args });
    return new Response(JSON.stringify({ ok: true, data: res.rows || [] }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, unknown> }).env;
    const getEnv = (name: string): string | undefined => {
      const fromImportMeta = typeof metaEnv?.[name] === 'string' ? (metaEnv?.[name] as string) : undefined;
      const fromProcess = typeof process !== 'undefined' ? process.env?.[name] : undefined;
      return fromImportMeta ?? fromProcess ?? undefined;
    };
    const secret = getEnv('SESSION_SECRET') || 'change-me';
    const { requireRole } = await import('../../../lib/rbac');
    const { isValidCsrf } = await import('../../../lib/csrf');
    if (!(await requireRole(request, String(secret), ['super_admin','admin','manager','consultant']))) return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 403 });
    if (!isValidCsrf(request)) {
      return new Response(JSON.stringify({ ok: false, error: 'csrf_failed' }), { status: 403 });
    }
    await ensureFulfillmentTables();
    const db = await getTursoClient();
    const body = await request.json();
    const action = String((body && body.action) || 'create');
    if (action === 'create') {
      const client_id = String(body.client_id || '');
      const service = String(body.service || '');
      const due_date = body.due_date ? String(body.due_date) : null;
      const checklist = body.checklist ? JSON.stringify(body.checklist) : JSON.stringify([]);
      const notes = body.notes ? String(body.notes) : null;
      if (!client_id || !service) return new Response(JSON.stringify({ ok: false, error: 'missing_fields' }), { status: 400 });
      const id = 'ful_' + Date.now() + Math.random().toString(36).slice(2, 8);
      const ts = new Date().toISOString();
      await db.execute({ sql: `INSERT INTO fulfillment_tasks (id, client_id, service, status, due_date, checklist, notes, created_at, updated_at) VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?)`, args: [id, client_id, service, due_date, checklist, notes, ts, ts] });
      await logActivity('task_created', 'fulfillment_task', id, JSON.stringify({ client_id, service, due_date }));
      return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'update_status') {
      const id = String(body.id || '');
      const status = String(body.status || 'pending');
      if (!id) return new Response(JSON.stringify({ ok: false, error: 'missing_id' }), { status: 400 });
      const ts = new Date().toISOString();
      await db.execute({ sql: `UPDATE fulfillment_tasks SET status = ?, updated_at = ? WHERE id = ?`, args: [status, ts, id] });
      await logActivity('task_status_changed', 'fulfillment_task', id, JSON.stringify({ status }));
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'update_fields') {
      const id = String(body.id || '');
      if (!id) return new Response(JSON.stringify({ ok: false, error: 'missing_id' }), { status: 400 });
      const service = body.service != null ? String(body.service) : null;
      const due_date = body.due_date != null ? String(body.due_date) : null;
      const checklist = body.checklist != null ? JSON.stringify(body.checklist) : null;
      const notes = body.notes != null ? String(body.notes) : null;
      const sets: string[] = [];
      const args: (string | number | boolean | bigint | null)[] = [];
      if (service !== null) { sets.push('service = ?'); args.push(service); }
      if (due_date !== null) { sets.push('due_date = ?'); args.push(due_date); }
      if (checklist !== null) { sets.push('checklist = ?'); args.push(checklist); }
      if (notes !== null) { sets.push('notes = ?'); args.push(notes); }
      const ts = new Date().toISOString();
      sets.push('updated_at = ?'); args.push(ts);
      if (!sets.length) return new Response(JSON.stringify({ ok: false, error: 'no_fields' }), { status: 400 });
      await db.execute({ sql: `UPDATE fulfillment_tasks SET ${sets.join(', ')} WHERE id = ?`, args: [...args, id] });
      await logActivity('task_updated', 'fulfillment_task', id, JSON.stringify({ service, due_date }));
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'delete') {
      const id = String(body.id || '');
      if (!id) return new Response(JSON.stringify({ ok: false, error: 'missing_id' }), { status: 400 });
      await db.execute({ sql: `DELETE FROM fulfillment_tasks WHERE id = ?`, args: [id] });
      await logActivity('task_deleted', 'fulfillment_task', id);
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ ok: false, error: 'unknown_action' }), { status: 400 });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};
