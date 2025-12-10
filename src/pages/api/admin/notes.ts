import type { APIRoute } from 'astro';
import { getTursoClient, ensureNotesTable } from '../../../lib/turso';
import { logActivity } from '../../../lib/activity-logger';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureNotesTable();
    const url = new URL(request.url);
    const entityType = url.searchParams.get('entity_type');
    const entityId = url.searchParams.get('entity_id');
    const phone = url.searchParams.get('phone');
    const email = url.searchParams.get('email');

    if (!entityType) {
      return new Response(JSON.stringify({ ok: false, error: 'entity_type required' }), { status: 400 });
    }

    const client = await getTursoClient();
    // Aggregate appointment notes by phone/email if requested
    if (entityType === 'appointment' && (phone || email) && !entityId) {
      const idsRes = await client.execute({
        sql: `SELECT id FROM appointments WHERE ${phone ? 'phone = ?' : 'email = ?'} ORDER BY datetime(created_at) DESC LIMIT 100`,
        args: [String(phone || email)],
      });
      const ids = (idsRes.rows || []).map((r) => String((r as Record<string, unknown>).id || ''));
      if (!ids.length) return new Response(JSON.stringify({ ok: true, data: [] }), { headers: { 'Content-Type': 'application/json' } });
      const placeholders = ids.map(() => '?').join(',');
      const res = await client.execute({ sql: `SELECT * FROM notes WHERE entity_type = 'appointment' AND entity_id IN (${placeholders}) ORDER BY datetime(created_at) DESC`, args: ids });
      return new Response(JSON.stringify({ ok: true, data: res.rows || [] }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (!entityId) {
      return new Response(JSON.stringify({ ok: false, error: 'entity_id required' }), { status: 400 });
    }
    const res = await client.execute({ sql: `SELECT * FROM notes WHERE entity_type = ? AND entity_id = ? ORDER BY datetime(created_at) DESC`, args: [entityType, entityId] });

    return new Response(JSON.stringify({ ok: true, data: res.rows }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { isValidCsrf } = await import('../../../lib/csrf');
    if (!isValidCsrf(request)) return new Response(JSON.stringify({ ok: false, error: 'csrf_failed' }), { status: 403 });
    const body: { entity_type: string; entity_id: string; note_text: string } = await request.json();
    const { entity_type, entity_id, note_text } = body || {};

    if (!entity_type || !entity_id || !note_text) {
      return new Response(JSON.stringify({ ok: false, error: 'entity_type, entity_id, and note_text required' }), {
        status: 400,
      });
    }

    await ensureNotesTable();
    const client = await getTursoClient();
    const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();

    await client.execute({
      sql: `INSERT INTO notes (id, entity_type, entity_id, note_text, created_by, created_at)
            VALUES (?, ?, ?, ?, 'admin', ?)`,
      args: [noteId, entity_type, entity_id, String(note_text), createdAt],
    });

    await logActivity('note_created', entity_type, entity_id, `Note added: ${note_text.slice(0, 50)}`);

    return new Response(JSON.stringify({ ok: true, id: noteId }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
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

    await ensureNotesTable();
    const client = await getTursoClient();
    await client.execute({ sql: `DELETE FROM notes WHERE id = ?`, args: [id] });

    await logActivity('note_deleted', 'note', id);

    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const { isValidCsrf } = await import('../../../lib/csrf');
    if (!isValidCsrf(request)) return new Response(JSON.stringify({ ok: false, error: 'csrf_failed' }), { status: 403 });
    const body = await request.json();
    const id = String(body?.id || '').trim();
    const note_text = String(body?.note_text || '').trim();
    if (!id || !note_text) {
      return new Response(JSON.stringify({ ok: false, error: 'id and note_text required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await ensureNotesTable();
    const client = await getTursoClient();
    await client.execute({ sql: `UPDATE notes SET note_text = ? WHERE id = ?`, args: [note_text, id] });
    await logActivity('note_updated', 'note', id, `Note updated: ${note_text.slice(0, 50)}`);
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};
