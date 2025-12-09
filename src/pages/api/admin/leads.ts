import type { APIRoute } from 'astro';
import type { Client } from '@libsql/client';
import { getTursoClient, ensureLeadsTables, ensureContactsTable } from '../../../lib/turso';
import { isValidCsrf, getCsrfTokenFromCookie } from '../../../lib/csrf';

export const prerender = false;

async function syncToContacts(db: Client, leadId: string, stage: string) {
  if (!['contacted', 'converted', 'consultation'].includes(stage)) return;
  
  try {
    const leadRes = await db.execute({ sql: `SELECT name, email, phone, notes FROM leads WHERE id = ?`, args: [leadId] });
    const lead = leadRes.rows[0];
    if (!lead) return;

    // Use existing email or generate a placeholder if missing (to satisfy contacts NOT NULL constraint)
    const emailToUse = lead.email ? String(lead.email) : `no-email-${leadId}@jyotirsetu.local`;

    await ensureContactsTable();
    const existing = await db.execute({ sql: `SELECT id FROM contacts WHERE email = ?`, args: [emailToUse] });
    if (existing.rows.length > 0) return;

    const contactId = `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();
    
    await db.execute({
      sql: `INSERT INTO contacts (id, name, email, phone, subject, message, status, priority, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        contactId,
        String(lead.name),
        emailToUse,
        lead.phone ? String(lead.phone) : null,
        `Lead Sync: ${stage}`,
        lead.notes ? String(lead.notes) : `Lead synced from stage: ${stage}`,
        'new',
        'normal',
        createdAt,
      ],
    });
  } catch (e) {
    console.error('Failed to sync contact:', e);
  }
}

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureLeadsTables();
    const url = new URL(request.url);
    const stage = url.searchParams.get('stage');
    const owner = url.searchParams.get('owner');
    const sort = (url.searchParams.get('sort') || 'created_at').trim();
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;
    const db = await getTursoClient();
    const filters: string[] = [];
    const args: (string | number | boolean | bigint | null)[] = [];
    if (stage) { filters.push('stage = ?'); args.push(String(stage)); }
    if (owner) { filters.push('owner = ?'); args.push(String(owner)); }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const orderBy = ['created_at','stage','owner','score'].includes(sort) ? sort : 'created_at';
    const [rowsRes, countRes] = await Promise.all([
      db.execute({ sql: `SELECT id, name, email, phone, source, stage, owner, tags, next_action_at, sla_due_at, notes, created_at, updated_at,
        (CASE stage WHEN 'prospect' THEN 10 WHEN 'contacted' THEN 30 WHEN 'consultation' THEN 60 WHEN 'converted' THEN 100 WHEN 'lost' THEN 0 ELSE 10 END)
        + (CASE WHEN sla_due_at IS NOT NULL AND datetime(sla_due_at) < datetime('now') THEN -20 ELSE 0 END) AS score
        FROM leads ${where} ORDER BY ${orderBy} DESC LIMIT ? OFFSET ?`, args: [...args, limit, offset] }),
      db.execute({ sql: `SELECT COUNT(*) AS total FROM leads ${where}`, args }),
    ]);
    const totalRow = (countRes.rows || [])[0] as Record<string, unknown> | undefined;
    const total = Number(totalRow?.total || 0);
    return new Response(JSON.stringify({ ok: true, data: rowsRes.rows || [], pagination: { page, limit, total } }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const cookieToken = getCsrfTokenFromCookie(request.headers.get('cookie') || '');
    if (cookieToken && !isValidCsrf(request)) {
      return new Response(JSON.stringify({ ok: false, error: 'csrf_failed' }), { status: 403 });
    }
    await ensureLeadsTables();
    const db = await getTursoClient();
    const body = await request.json();
    const action = String((body && body.action) || 'create');
    const actor = await getActor(request);
    if (action === 'create') {
      const name = String(body.name || '');
      const email = String(body.email || '');
      const phone = String(body.phone || '');
      const source = String(body.source || 'manual');
      const owner = String(body.owner || actor);
      const stage = String(body.stage || 'prospect');
      const sla_due_at = body.sla_due_at ? String(body.sla_due_at) : null;
      const notes = body.notes ? String(body.notes) : null;
      const tags = Array.isArray(body.tags) ? body.tags.map(String).join(',') : String(body.tags || '');
      const next_action_at = body.next_action_at ? String(body.next_action_at) : null;
      if (!name) return new Response(JSON.stringify({ ok: false, error: 'name required' }), { status: 400 });
      const id = 'lead_' + Date.now() + Math.random().toString(36).slice(2, 8);
      const ts = new Date().toISOString();
      await db.execute({ sql: `INSERT INTO leads (id, name, email, phone, source, stage, owner, tags, next_action_at, sla_due_at, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, args: [id, name, email, phone, source, stage, owner, tags, next_action_at, sla_due_at, notes, ts, ts] });
      await db.execute({ sql: `INSERT INTO lead_stage_history (id, lead_id, from_stage, to_stage, changed_at, changed_by) VALUES (?, ?, ?, ?, ?, ?)`, args: ['lsh_' + Date.now() + Math.random().toString(36).slice(2, 8), id, null, stage, ts, owner] });
      return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'advance_stage') {
      const id = String(body.id || '');
      const to_stage = String(body.to_stage || 'consultation');
      const owner = String(body.owner || actor);
      if (!id) return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400 });
      await ensureLeadsTables();
      const find = await db.execute({ sql: `SELECT stage FROM leads WHERE id = ? LIMIT 1`, args: [id] });
      const prev = (find.rows?.[0] as Record<string, unknown> | undefined)?.stage as string | undefined;
      const ts = new Date().toISOString();
      await db.execute({ sql: `UPDATE leads SET stage = ?, updated_at = ? WHERE id = ?`, args: [to_stage, ts, id] });
      await db.execute({ sql: `INSERT INTO lead_stage_history (id, lead_id, from_stage, to_stage, changed_at, changed_by) VALUES (?, ?, ?, ?, ?, ?)`, args: ['lsh_' + Date.now() + Math.random().toString(36).slice(2, 8), id, prev || null, to_stage, ts, owner] });
      await syncToContacts(db, id, to_stage);
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'update_sla') {
      const id = String(body.id || '');
      const sla_due_at = body.sla_due_at ? String(body.sla_due_at) : null;
      if (!id) return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400 });
      const ts = new Date().toISOString();
      await db.execute({ sql: `UPDATE leads SET sla_due_at = ?, updated_at = ? WHERE id = ?`, args: [sla_due_at, ts, id] });
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'assign_owner') {
      const id = String(body.id || '');
      const owner = String(body.owner || 'admin');
      if (!id) return new Response(JSON.stringify({ ok:false, error:'id required' }), { status:400 });
      const ts = new Date().toISOString();
      await db.execute({ sql:`UPDATE leads SET owner=?, updated_at=? WHERE id=?`, args:[owner, ts, id] });
      await db.execute({ sql:`INSERT INTO activity_log (id, action, entity_type, entity_id, user, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, args:['act_'+Date.now()+Math.random().toString(36).slice(2,8),'assign_owner','lead',id,actor,JSON.stringify({ owner }), ts] });
      return new Response(JSON.stringify({ ok:true }), { headers:{ 'Content-Type':'application/json' } });
    }
    if (action === 'update_tags') {
      const id = String(body.id || '');
      const tags = Array.isArray(body.tags) ? body.tags.map(String).join(',') : String(body.tags || '');
      if (!id) return new Response(JSON.stringify({ ok:false, error:'id required' }), { status:400 });
      const ts = new Date().toISOString();
      await db.execute({ sql:`UPDATE leads SET tags=?, updated_at=? WHERE id=?`, args:[tags, ts, id] });
      await db.execute({ sql:`INSERT INTO activity_log (id, action, entity_type, entity_id, user, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, args:['act_'+Date.now()+Math.random().toString(36).slice(2,8),'update_tags','lead',id,actor,JSON.stringify({ tags }), ts] });
      return new Response(JSON.stringify({ ok:true }), { headers:{ 'Content-Type':'application/json' } });
    }
    if (action === 'set_next_action') {
      const id = String(body.id || '');
      const next_action_at = body.next_action_at ? String(body.next_action_at) : null;
      if (!id) return new Response(JSON.stringify({ ok:false, error:'id required' }), { status:400 });
      const ts = new Date().toISOString();
      await db.execute({ sql:`UPDATE leads SET next_action_at=?, updated_at=? WHERE id=?`, args:[next_action_at, ts, id] });
      await db.execute({ sql:`INSERT INTO activity_log (id, action, entity_type, entity_id, user, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, args:['act_'+Date.now()+Math.random().toString(36).slice(2,8),'set_next_action','lead',id,actor,JSON.stringify({ next_action_at }), ts] });
      return new Response(JSON.stringify({ ok:true }), { headers:{ 'Content-Type':'application/json' } });
    }
    if (action === 'bulk_advance') {
      const ids = Array.isArray(body.ids) ? body.ids.map(String) : [];
      const to_stage = String(body.to_stage || 'prospect');
      if (!ids.length) return new Response(JSON.stringify({ ok:false, error:'ids required' }), { status:400 });
      const ts = new Date().toISOString();
      for (const id of ids) {
        await db.execute({ sql:`UPDATE leads SET stage=?, updated_at=? WHERE id=?`, args:[to_stage, ts, id] });
        await db.execute({ sql:`INSERT INTO lead_stage_history (id, lead_id, from_stage, to_stage, changed_at, changed_by) VALUES (?, ?, ?, ?, ?, ?)`, args:['lsh_'+Date.now()+Math.random().toString(36).slice(2,8), id, null, to_stage, ts, actor] });
        await syncToContacts(db, id, to_stage);
      }
      return new Response(JSON.stringify({ ok:true }), { headers:{ 'Content-Type':'application/json' } });
    }
    return new Response(JSON.stringify({ ok: false, error: 'unknown_action' }), { status: 400 });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const cookieToken = getCsrfTokenFromCookie(request.headers.get('cookie') || '');
    if (cookieToken && !isValidCsrf(request)) {
      return new Response(JSON.stringify({ ok: false, error: 'csrf_failed' }), { status: 403 });
    }
    await ensureLeadsTables();
    const db = await getTursoClient();
    const body = await request.json();
    const ids = Array.isArray(body.ids) ? body.ids.map(String) : [];
    
    if (!ids.length) {
      return new Response(JSON.stringify({ ok: false, error: 'ids required' }), { status: 400 });
    }

    // Use a transaction or just execute delete
    // Since Turso client might not support complex transactions easily in this helper, we'll just run one delete query
    // Construct placeholders: ?,?,?
    const placeholders = ids.map(() => '?').join(',');
    
    // Delete related records first to avoid Foreign Key constraints (lead_notes, lead_stage_history)
    // We run these sequentially to ensure order, though a batch transaction would be ideal if supported fully by the client adapter
    await db.execute({
      sql: `DELETE FROM lead_notes WHERE lead_id IN (${placeholders})`,
      args: ids
    });

    await db.execute({
      sql: `DELETE FROM lead_stage_history WHERE lead_id IN (${placeholders})`,
      args: ids
    });

    await db.execute({
      sql: `DELETE FROM leads WHERE id IN (${placeholders})`,
      args: ids
    });
    
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};

async function getActor(request: Request): Promise<string> {
  try {
    const { verifySession } = await import('../../../lib/auth');
    const secret = ((import.meta as unknown as { env?: Record<string, unknown> }).env?.['SESSION_SECRET'] as string) || (process.env?.['SESSION_SECRET'] || 'change-me');
    const cookie = request.headers.get('cookie') || '';
    const m = /admin_session=([^;]+)/.exec(cookie);
    if (!m) return 'admin';
    const token = decodeURIComponent(m[1]);
    const s = await verifySession(token, String(secret)) as { user?: string };
    return String(s?.user || 'admin');
  } catch { return 'admin'; }
}
