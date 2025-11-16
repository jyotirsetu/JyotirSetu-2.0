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
    args.push('admin');
    if (page) { where += ' AND page = ?'; args.push(String(page)); }
    const res = await client.execute({
      sql: `SELECT id, user, page, name, filters, created_at FROM saved_views ${where} ORDER BY datetime(created_at) DESC`,
      args
    });
    const rows = (res.rows || []) as unknown as SavedView[];
    return new Response(JSON.stringify({ ok: true, data: rows }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed' }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { page, name, filters } = (body || {}) as { page?: string; name?: string; filters?: unknown };
    if (!page || !name || filters == null) {
      return new Response(JSON.stringify({ ok: false, error: 'page, name, filters required' }), { status: 400 });
    }
    await ensureSavedViewsTable();
    const client = await getTursoClient();
    const id = `view_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
    const createdAt = new Date().toISOString();
    const filtersJson = typeof filters === 'string' ? filters : JSON.stringify(filters);
    await client.execute({
      sql: `INSERT INTO saved_views (id, user, page, name, filters, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [id, 'admin', String(page), String(name), String(filtersJson), createdAt]
    });
    return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
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
    await ensureSavedViewsTable();
    const client = await getTursoClient();
    await client.execute({ sql: `DELETE FROM saved_views WHERE id = ? AND user = ?`, args: [String(id), 'admin'] });
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed' }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};