import type { APIRoute } from 'astro';
import { getTursoClient, ensureAdminPreferencesTable } from '../../../lib/turso';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureAdminPreferencesTable();
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    const client = await getTursoClient();
    if (key) {
      const res = await client.execute({ sql: `SELECT value FROM admin_preferences WHERE key = ? AND user = ? LIMIT 1`, args: [String(key), 'admin'] });
      const row = (res.rows?.[0] ?? {}) as Record<string, unknown>;
      const value = typeof row.value === 'string' ? row.value : null;
      return new Response(JSON.stringify({ ok: true, key, value }), { headers: { 'Content-Type': 'application/json' } });
    }
    const res = await client.execute({ sql: `SELECT key, value FROM admin_preferences WHERE user = ?`, args: ['admin'] });
    return new Response(JSON.stringify({ ok: true, data: res.rows || [] }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const err = e as Error;
    return new Response(JSON.stringify({ ok: false, error: err.message || 'failed' }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    await ensureAdminPreferencesTable();
    const body = await request.json();
    const { key, value } = (body || {}) as { key?: string; value?: string };
    if (!key) return new Response(JSON.stringify({ ok: false, error: 'key required' }), { status: 400 });
    const client = await getTursoClient();
    const now = new Date().toISOString();
    await client.execute({ sql: `INSERT INTO admin_preferences (key, value, user, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`, args: [String(key), String(value ?? ''), 'admin', now] });
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const err = e as Error;
    return new Response(JSON.stringify({ ok: false, error: err.message || 'failed' }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};