import type { APIRoute } from 'astro';
import { getTursoClient, ensureNotificationsTable } from '../../../lib/turso';
import { isValidCsrf } from '../../../lib/csrf';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, unknown> }).env;
    const getEnv = (name: string): string | undefined => {
      const fromImportMeta = typeof metaEnv?.[name] === 'string' ? (metaEnv?.[name] as string) : undefined;
      const fromProcess = typeof process !== 'undefined' ? process.env?.[name] : undefined;
      return fromImportMeta ?? fromProcess ?? undefined;
    };
    const secret = getEnv('SESSION_SECRET') || 'change-me';
    const { requireRole } = await import('../../../lib/rbac');
    // Secure GET endpoint
    if (!(await requireRole(request, String(secret), ['admin', 'super_admin', 'manager']))) {
      // Allow unauthenticated access only if explicitly intended? No, notifications should be private.
      // However, current behavior was public. We secure it now.
      return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 403 });
    }

    try { await ensureNotificationsTable(); } catch { /* read-only deployments */ }
    const url = new URL(request.url);
    const countOnly = url.searchParams.get('count_only') === '1';
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || '10'), 1), 50);
    const unreadOnly = url.searchParams.get('unread_only') === '1';
    const client = await getTursoClient();
    try {
      if (countOnly) {
        const countRes = await client.execute({ sql: `SELECT COUNT(*) AS unread FROM notifications WHERE read = 0`, args: [] });
        const unreadRow = (countRes.rows?.[0] ?? {}) as Record<string, unknown>;
        const unread = Number((unreadRow.unread as number | string | undefined) ?? 0);
        return new Response(JSON.stringify({ ok: true, unread }), { headers: { 'Content-Type': 'application/json' } });
      }

      let sql = `SELECT id, title, message, type, read, created_at FROM notifications`;
      if (unreadOnly) {
        sql += ` WHERE read = 0`;
      }
      sql += ` ORDER BY datetime(created_at) DESC LIMIT ?`;

      const res = await client.execute({
        sql,
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
    if (!(await requireRole(request, String(secret), ['admin', 'super_admin', 'manager']))) return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 403 });
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

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, unknown> }).env;
    const getEnv = (name: string): string | undefined => {
      const fromImportMeta = typeof metaEnv?.[name] === 'string' ? (metaEnv?.[name] as string) : undefined;
      const fromProcess = typeof process !== 'undefined' ? process.env?.[name] : undefined;
      return fromImportMeta ?? fromProcess ?? undefined;
    };
    const secret = getEnv('SESSION_SECRET') || 'change-me';
    const { requireRole } = await import('../../../lib/rbac');
    if (!(await requireRole(request, String(secret), ['admin', 'super_admin', 'manager']))) return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 403 });
    if (!isValidCsrf(request)) return new Response(JSON.stringify({ ok: false, error: 'csrf_failed' }), { status: 403 });
    await ensureNotificationsTable();
    const body = await request.json();
    const { all } = (body || {}) as { all?: boolean };
    if (!all) return new Response(JSON.stringify({ ok: false, error: 'invalid' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    const client = await getTursoClient();
    await client.execute({ sql: `UPDATE notifications SET read = 1 WHERE read = 0`, args: [] });
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, unknown> }).env;
    const getEnv = (name: string): string | undefined => {
      const fromImportMeta = typeof metaEnv?.[name] === 'string' ? (metaEnv?.[name] as string) : undefined;
      const fromProcess = typeof process !== 'undefined' ? process.env?.[name] : undefined;
      return fromImportMeta ?? fromProcess ?? undefined;
    };
    const secret = getEnv('SESSION_SECRET') || 'change-me';
    const { requireRole } = await import('../../../lib/rbac');
    if (!(await requireRole(request, String(secret), ['admin', 'super_admin', 'manager']))) return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 403 });
    if (!isValidCsrf(request)) return new Response(JSON.stringify({ ok: false, error: 'csrf_failed' }), { status: 403 });
    await ensureNotificationsTable();
    const client = await getTursoClient();
    // Soft delete: Mark all as read instead of deleting
    await client.execute({ sql: `UPDATE notifications SET read = 1 WHERE read = 0`, args: [] });
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
