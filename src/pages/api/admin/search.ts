import type { APIRoute } from 'astro';
import { getTursoClient } from '../../../lib/turso';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').trim();
    if (!q) return new Response(JSON.stringify({ ok: true, clients: [], quotes: [], appointments: [] }), { headers: { 'Content-Type': 'application/json' } });
    const db = await getTursoClient();
    const like = `%${q}%`;
    const [clientsRes, quotesRes, apptsRes] = await Promise.all([
      db.execute({ sql: `SELECT id, name, email, phone FROM clients WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? ORDER BY datetime(created_at) DESC LIMIT 20`, args: [like, like, like] }),
      db.execute({ sql: `SELECT id, number, client_name, client_email, status, total, purchased_amount FROM quotes WHERE number LIKE ? OR client_name LIKE ? OR client_email LIKE ? ORDER BY datetime(created_at) DESC LIMIT 20`, args: [like, like, like] }),
      db.execute({ sql: `SELECT id, name, email, phone, service, date, time, status FROM appointments WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR service LIKE ? ORDER BY datetime(created_at) DESC LIMIT 20`, args: [like, like, like, like] }),
    ]);
    return new Response(JSON.stringify({ ok: true, clients: clientsRes.rows || [], quotes: quotesRes.rows || [], appointments: apptsRes.rows || [] }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};

