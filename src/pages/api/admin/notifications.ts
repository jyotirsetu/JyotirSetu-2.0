import type { APIRoute } from 'astro';
import { getTursoClient, ensureNotificationsTable } from '../../../lib/turso';
import { isValidCsrf } from '../../../lib/csrf';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    try { await ensureNotificationsTable(); } catch { /* read-only deployments */ }
    const url = new URL(request.url);
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || '10'), 1), 50);
    const client = await getTursoClient();
    try {
      const res = await client.execute({
        sql: `SELECT id, title, message, type, read, created_at FROM notifications ORDER BY datetime(created_at) DESC LIMIT ?`,
        args: [limit],
      });
      const countRes = await client.execute({ sql: `SELECT COUNT(*) AS unread FROM notifications WHERE read = 0`, args: [] });
      const unreadRow = (countRes.rows?.[0] ?? {}) as Record<string, unknown>;
      const unread = Number((unreadRow.unread as number | string | undefined) ?? 0);
      return new Response(JSON.stringify({ ok: true, unread, data: res.rows || [] }), { headers: { 'Content-Type': 'application/json' } });
    } catch {
      return new Response(JSON.stringify({ ok: true, unread: 0, data: [] }), { headers: { 'Content-Type': 'application/json' } });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, unknown> }).env;
    const getEnv = (name: string): string | undefined => {
      const fromImportMeta = typeof metaEnv?.[name] === 'string' ? (metaEnv?.[name] as string) : undefined;
      const fromProcess = typeof process !== 'undefined' ? process.env?.[name] : undefined;
      return fromImportMeta ?? fromProcess ?? undefined;
    };
    const secret = getEnv('SESSION_SECRET') || 'change-me';
    const { requireRole } = await import('../../../lib/rbac');
    if (!(await requireRole(request, String(secret), ['admin']))) return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 403 });
    if (!isValidCsrf(request)) return new Response(JSON.stringify({ ok: false, error: 'csrf_failed' }), { status: 403 });
    await ensureNotificationsTable();
    const body = await request.json();
    const { id } = (body || {}) as { id?: string };
    if (!id) return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400 });
    const client = await getTursoClient();
    await client.execute({ sql: `UPDATE notifications SET read = 1 WHERE id = ?`, args: [String(id)] });
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
