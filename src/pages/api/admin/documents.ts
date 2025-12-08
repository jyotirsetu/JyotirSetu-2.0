import type { APIRoute } from 'astro';
import { getTursoClient, ensureDocumentsTables } from '../../../lib/turso';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureDocumentsTables();
    const url = new URL(request.url);
    const entity_type = url.searchParams.get('entity_type');
    const entity_id = url.searchParams.get('entity_id');
    const client_id = url.searchParams.get('client_id');
    const db = await getTursoClient();
    const filters: string[] = [];
    const args: (string | number | boolean | bigint | null)[] = [];
    if (client_id) { filters.push('client_id = ?'); args.push(String(client_id)); }
    if (entity_type) { filters.push('entity_type = ?'); args.push(String(entity_type)); }
    if (entity_id) { filters.push('entity_id = ?'); args.push(String(entity_id)); }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const res = await db.execute({ sql: `SELECT * FROM documents ${where} ORDER BY datetime(created_at) DESC`, args });
    return new Response(JSON.stringify({ ok: true, data: res.rows || [] }), { headers: { 'Content-Type': 'application/json' } });
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
    await ensureDocumentsTables();
    const db = await getTursoClient();
    const body = await request.json();
    const action = String((body && body.action) || 'add');
    if (action === 'add') {
      const client_id = body.client_id ? String(body.client_id) : null;
      const entity_type = body.entity_type ? String(body.entity_type) : null;
      const entity_id = body.entity_id ? String(body.entity_id) : null;
      const title = String(body.title || 'Document');
      const mime_type = body.mime_type ? String(body.mime_type) : null;
      const size = body.size != null ? Number(body.size) : null;
      const storage_url = String(body.storage_url || '');
      if (!storage_url) return new Response(JSON.stringify({ ok: false, error: 'storage_url required' }), { status: 400 });
      const id = 'doc_' + Date.now() + Math.random().toString(36).slice(2, 8);
      const ts = new Date().toISOString();
      await db.execute({ sql: `INSERT INTO documents (id, client_id, entity_type, entity_id, title, mime_type, size, storage_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, args: [id, client_id, entity_type, entity_id, title, mime_type, size, storage_url, ts] });
      return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'consent') {
      const client_id = String(body.client_id || '');
      const form_title = String(body.form_title || 'Consent');
      const signed_at = body.signed_at ? String(body.signed_at) : null;
      const file_url = body.file_url ? String(body.file_url) : null;
      if (!client_id) return new Response(JSON.stringify({ ok: false, error: 'client_id required' }), { status: 400 });
      const id = 'consent_' + Date.now() + Math.random().toString(36).slice(2, 8);
      const ts = new Date().toISOString();
      await db.execute({ sql: `INSERT INTO consent_forms (id, client_id, form_title, signed_at, file_url, created_at) VALUES (?, ?, ?, ?, ?, ?)`, args: [id, client_id, form_title, signed_at, file_url, ts] });
      return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ ok: false, error: 'unknown_action' }), { status: 400 });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};

