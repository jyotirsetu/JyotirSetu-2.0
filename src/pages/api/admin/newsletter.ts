import type { APIRoute } from 'astro';
import { getTursoClient, ensureNewsletterSubscribersTable } from '../../../lib/turso';
import { logActivity } from '../../../lib/activity-logger';

export const prerender = false;

interface Subscriber {
  id: string;
  name: string | null;
  email: string;
  status: string;
  subscribed_at: string;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureNewsletterSubscribersTable();
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    const client = await getTursoClient();
    const filters: string[] = [];
    const argsBase: (string | number | boolean | bigint | null)[] = [];
    if (from) {
      if (from.length === 10) { filters.push(`date(subscribed_at) >= date(?)`); }
      else { filters.push(`subscribed_at >= ?`); }
      argsBase.push(from);
    }
    if (to) {
      if (to.length === 10) { filters.push(`date(subscribed_at) <= date(?)`); }
      else { filters.push(`subscribed_at <= ?`); }
      argsBase.push(to);
    }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const [dataRes, countRes] = await Promise.all([
      client.execute({
        sql: `SELECT id, name, email, status, subscribed_at
              FROM newsletter_subscribers ${where}
              ORDER BY datetime(subscribed_at) DESC LIMIT ? OFFSET ?`,
        args: [...argsBase, limit, offset]
      }),
      client.execute({
        sql: `SELECT COUNT(*) as total FROM newsletter_subscribers ${where}`,
        args: argsBase
      })
    ]);

    const rows = (dataRes.rows || []) as unknown as Subscriber[];
    const total = (countRes.rows[0] as unknown as { total?: number })?.total ?? 0;

    return new Response(JSON.stringify({ ok: true, data: rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed' }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, status } = body || {};
    if (!id) return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400 });

    await ensureNewsletterSubscribersTable();
    const client = await getTursoClient();
    if (status) {
      const oldRes = await client.execute({ sql: `SELECT status FROM newsletter_subscribers WHERE id = ?`, args: [String(id)] });
      const oldStatus = (oldRes.rows[0] as unknown as { status?: string })?.status;
      await client.execute({ sql: `UPDATE newsletter_subscribers SET status = ? WHERE id = ?`, args: [String(status), String(id)] });
      await logActivity('status_updated', 'newsletter', id, `Status changed from ${oldStatus} to ${status}`);
    }
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed' }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, name, email, status } = body || {};
    if (action === 'create') {
      if (!email) return new Response(JSON.stringify({ ok: false, error: 'email required' }), { status: 400 });
      await ensureNewsletterSubscribersTable();
      const client = await getTursoClient();
      const now = new Date().toISOString();
      const id = `n_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await client.execute({
        sql: `INSERT INTO newsletter_subscribers (id, name, email, status, subscribed_at) VALUES (?, ?, ?, ?, ?)`,
        args: [id, name ? String(name) : null, String(email), String(status || 'pending'), now]
      });
      await logActivity('newsletter_created', 'newsletter', id, `Manual subscriber created: ${name || ''} <${email}>`);
      return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ ok: false, error: 'invalid request' }), { status: 400 });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed' }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400 });
    await ensureNewsletterSubscribersTable();
    const client = await getTursoClient();
    await client.execute({ sql: `DELETE FROM newsletter_subscribers WHERE id = ?`, args: [String(id)] });
    await logActivity('newsletter_deleted', 'newsletter', id);
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed' }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};