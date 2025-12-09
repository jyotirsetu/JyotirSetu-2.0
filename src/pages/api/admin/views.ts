import type { APIRoute } from 'astro';
import { getTursoClient, ensureSavedViewsTable } from '../../../lib/turso';

export const prerender = false;

type SavedView = {
  id: string;
  user: string;
  page: string;
  name: string;
  filters: string; // JSON string
  created_at: string;
};

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureSavedViewsTable();
    const url = new URL(request.url);
    const page = url.searchParams.get('page');
    const client = await getTursoClient();
    const args: (string | number | boolean | bigint | null)[] = [];
    let where = 'WHERE user = ?';
    const actor = await getActor(request);
    args.push(actor);
    if (page) {
      where += ' AND page = ?';
      args.push(String(page));
    }
    const res = await client.execute({
      sql: `SELECT id, user, page, name, filters, created_at FROM saved_views ${where} ORDER BY datetime(created_at) DESC`,
      args,
    });
    const rows = (res.rows || []) as unknown as SavedView[];
    return new Response(JSON.stringify({ ok: true, data: rows }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed', data: [] }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { isValidCsrf } = await import('../../../lib/csrf');
    if (!isValidCsrf(request)) {
      return new Response(JSON.stringify({ ok: false, error: 'csrf_failed' }), { status: 403 });
    }
    const body = await request.json();
    const { page, name, filters } = (body || {}) as { page?: string; name?: string; filters?: unknown };
    if (!page || !name || filters == null) {
      return new Response(JSON.stringify({ ok: false, error: 'page, name, filters required' }), { status: 400 });
    }
    await ensureSavedViewsTable();
    const client = await getTursoClient();
    const id = `view_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const createdAt = new Date().toISOString();
    const filtersJson = typeof filters === 'string' ? filters : JSON.stringify(filters);
    const actor = await getActor(request);
    await client.execute({
      sql: `INSERT INTO saved_views (id, user, page, name, filters, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [id, actor, String(page), String(name), String(filtersJson), createdAt],
    });
    return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed', data: [] }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { isValidCsrf } = await import('../../../lib/csrf');
    if (!isValidCsrf(request)) {
      return new Response(JSON.stringify({ ok: false, error: 'csrf_failed' }), { status: 403 });
    }
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400 });
    await ensureSavedViewsTable();
    const client = await getTursoClient();
    const actor = await getActor(request);
    await client.execute({ sql: `DELETE FROM saved_views WHERE id = ? AND user = ?`, args: [String(id), actor] });
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
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
