import type { APIRoute } from 'astro';
import { getTursoClient, ensureServicesTable } from '../../../lib/turso';

export const prerender = false;

type ServicePayload = {
  id?: string;
  title?: string;
  description?: string;
  image?: string;
  price?: number;
  default_gst?: number;
  hsn_sac?: string;
};

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureServicesTable();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;
    const db = await getTursoClient();
    if (id) {
      const res = await db.execute({ sql: `SELECT * FROM services WHERE id = ? LIMIT 1`, args: [String(id)] });
      const row = res.rows?.[0];
      if (!row) return new Response(JSON.stringify({ ok: false, error: 'not_found' }), { status: 404 });
      return new Response(JSON.stringify({ ok: true, data: row }), { headers: { 'Content-Type': 'application/json' } });
    }
    const res = await db.execute({
      sql: `SELECT id, title, description, image, price, default_gst, hsn_sac, updated_at FROM services ORDER BY datetime(updated_at) DESC LIMIT ? OFFSET ?`,
      args: [limit, offset],
    });
    return new Response(JSON.stringify({ ok: true, data: res.rows || [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const err = e as Error;
    return new Response(JSON.stringify({ ok: false, error: err.message || 'failed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await ensureServicesTable();
    const db = await getTursoClient();
    const body = await request.json();
    const action = String((body || {}).action || 'upsert');
    if (action === 'upsert') {
      const b: ServicePayload = body as ServicePayload;
      const id = b.id || 'svc_' + Date.now() + Math.random().toString(36).slice(2, 8);
      const now = new Date().toISOString();
      await db.execute({
        sql: `INSERT INTO services (id, title, description, image, price, default_gst, hsn_sac, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, description=excluded.description, image=excluded.image, price=excluded.price, default_gst=excluded.default_gst, hsn_sac=excluded.hsn_sac, updated_at=excluded.updated_at`,
        args: [
          id,
          String(b.title || ''),
          String(b.description || ''),
          String(b.image || ''),
          Number(b.price || 0),
          Number(b.default_gst || 0),
          String(b.hsn_sac || ''),
          now,
          now,
        ],
      });
      return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'delete') {
      const id = String((body as { id?: string }).id || '');
      if (!id) return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400 });
      await db.execute({ sql: `DELETE FROM services WHERE id = ?`, args: [id] });
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ ok: false, error: 'unsupported_action' }), { status: 400 });
  } catch (e) {
    const err = e as Error;
    return new Response(JSON.stringify({ ok: false, error: err.message || 'failed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};
