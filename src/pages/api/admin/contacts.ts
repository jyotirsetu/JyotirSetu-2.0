import type { APIRoute } from 'astro';
import { getTursoClient, ensureContactsTable } from '../../../lib/turso';
import { logActivity } from '../../../lib/activity-logger';

export const prerender = false;

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureContactsTable();
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;
    
    const client = await getTursoClient();
    const [dataRes, countRes] = await Promise.all([
      client.execute({
        sql: `SELECT id, name, email, phone, subject, message, status, priority, created_at
              FROM contacts ORDER BY datetime(created_at) DESC LIMIT ? OFFSET ?`,
        args: [limit, offset]
      }),
      client.execute({
        sql: `SELECT COUNT(*) as total FROM contacts`,
        args: []
      })
    ]);
    
    const rows = (dataRes.rows || []) as unknown as Contact[];
    const total = (countRes.rows[0] as { total: number })?.total || 0;
    
    return new Response(JSON.stringify({ 
      ok: true, 
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed' }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, status, priority } = body || {};
    if (!id) return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400 });
    
    await ensureContactsTable();
    const client = await getTursoClient();
    
    if (status) {
      const oldRes = await client.execute({ sql: `SELECT status FROM contacts WHERE id = ?`, args: [String(id)] });
      const oldStatus = (oldRes.rows[0] as { status: string })?.status;
      await client.execute({ sql: `UPDATE contacts SET status = ? WHERE id = ?`, args: [String(status), String(id)] });
      await logActivity('status_updated', 'contact', id, `Status changed from ${oldStatus} to ${status}`);
    }
    if (priority) {
      const oldRes = await client.execute({ sql: `SELECT priority FROM contacts WHERE id = ?`, args: [String(id)] });
      const oldPriority = (oldRes.rows[0] as { priority: string })?.priority;
      await client.execute({ sql: `UPDATE contacts SET priority = ? WHERE id = ?`, args: [String(priority), String(id)] });
      await logActivity('priority_updated', 'contact', id, `Priority changed from ${oldPriority} to ${priority}`);
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
    const { action, name, email, phone, subject, message, status, priority } = body || {};
    
    if (action === 'create') {
      if (!name || !email || !subject || !message) {
        return new Response(JSON.stringify({ ok: false, error: 'Missing required fields: name, email, subject, message' }), { status: 400 });
      }
      
      await ensureContactsTable();
      const client = await getTursoClient();
      const contactId = `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const createdAt = new Date().toISOString();
      
      await client.execute({
        sql: `INSERT INTO contacts (id, name, email, phone, subject, message, status, priority, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          contactId,
          String(name),
          String(email),
          phone ? String(phone) : null,
          String(subject),
          String(message),
          String(status || 'new'),
          String(priority || 'normal'),
          createdAt
        ]
      });
      
      await logActivity('contact_created', 'contact', contactId, `Manual contact created for ${name}`);
      
      return new Response(JSON.stringify({ ok: true, id: contactId }), { headers: { 'Content-Type': 'application/json' } });
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
    
    await ensureContactsTable();
    const client = await getTursoClient();
    await client.execute({ sql: `DELETE FROM contacts WHERE id = ?`, args: [String(id)] });
    
    await logActivity('contact_deleted', 'contact', id);
    
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed' }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};
