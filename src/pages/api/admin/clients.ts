import type { APIRoute } from 'astro';
import { getTursoClient, ensureClientsTable, ensureAppointmentsTable, ensureContactsTable, ensurePaymentsTable } from '../../../lib/turso';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureClientsTable();
    await ensurePaymentsTable();
    await ensureAppointmentsTable();
    await ensureContactsTable();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const email = url.searchParams.get('email');
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;
    const client = await getTursoClient();

    if (id || email) {
      const by = id ? 'id' : 'email';
      const key = id ? String(id) : String(email);
      const res = await client.execute({ sql: `SELECT id, name, email, phone, vip, created_at FROM clients WHERE ${by} = ? LIMIT 1`, args: [key] });
      const c = (res.rows && res.rows[0]) as Record<string, unknown> | undefined;
      if (!c) return new Response(JSON.stringify({ ok: false, error: 'not_found' }), { status: 404 });
      const cid = String(c.id);
      const [apRes, coRes, payRes, totalPayRes] = await Promise.all([
        client.execute({ sql: `SELECT id, service, date, time, status, payment_status, created_at FROM appointments WHERE email = ? ORDER BY datetime(created_at) DESC LIMIT 50`, args: [String(c.email || '')] }),
        client.execute({ sql: `SELECT id, subject, status, priority, created_at FROM contacts WHERE email = ? ORDER BY datetime(created_at) DESC LIMIT 50`, args: [String(c.email || '')] }),
        client.execute({ sql: `SELECT id, amount, mode, reference, note, created_at, appointment_id FROM payments WHERE client_id = ? ORDER BY datetime(created_at) DESC LIMIT 100`, args: [cid] }),
        client.execute({ sql: `SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE client_id = ?`, args: [cid] })
      ]);
      const totalPaidRow = (totalPayRes.rows && totalPayRes.rows[0]) as { total?: unknown } | undefined;
      const totalPaid = Number(totalPaidRow?.total ?? 0);
      return new Response(JSON.stringify({ ok: true, data: { client: c, appointments: apRes.rows || [], contacts: coRes.rows || [], payments: payRes.rows || [], totals: { paid: totalPaid } } }), { headers: { 'Content-Type': 'application/json' } });
    }

    const [listRes, countRes] = await Promise.all([
      client.execute({ sql: `SELECT id, name, email, phone, vip, created_at FROM clients ORDER BY datetime(created_at) DESC LIMIT ? OFFSET ?`, args: [limit, offset] }),
      client.execute({ sql: `SELECT COUNT(*) AS total FROM clients`, args: [] })
    ]);
    const totalsByClient: Record<string, number> = {};
    if (Array.isArray(listRes.rows) && listRes.rows.length) {
      const ids = (listRes.rows as Array<Record<string, unknown>>).map(r => String(r.id));
      const inClause = ids.map(() => '?').join(',');
      const sumRes = await client.execute({ sql: `SELECT client_id, COALESCE(SUM(amount),0) AS total FROM payments WHERE client_id IN (${inClause}) GROUP BY client_id`, args: ids });
      for (const row of (sumRes.rows || []) as Array<Record<string, unknown>>) totalsByClient[String(row.client_id)] = Number(row.total || 0);
    }
    const totalRow = (countRes.rows && countRes.rows[0]) as { total?: unknown } | undefined;
    const total = Number(totalRow?.total ?? 0);
    const data = (listRes.rows || []).map((r: Record<string, unknown>) => ({ ...r, total_paid: totalsByClient[String(r.id)] || 0 }));
    return new Response(JSON.stringify({ ok: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = (e && typeof e === 'object' && 'message' in e) ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await ensureClientsTable();
    const client = await getTursoClient();
    const body = await request.json();
    const action = String((body && body.action) || 'create');
    if (action === 'create') {
      const name = String(body.name || '');
      const email = String(body.email || '');
      const phone = String(body.phone || '');
      if (!name || !email) return new Response(JSON.stringify({ ok: false, error: 'missing_fields' }), { status: 400 });
      const id = 'cli_' + Date.now() + Math.random().toString(36).slice(2,8);
      const created_at = new Date().toISOString();
      await client.execute({ sql: `INSERT INTO clients (id, name, email, phone, vip, created_at) VALUES (?, ?, ?, ?, 'no', ?)`, args: [id, name, email, phone, created_at] });
      return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'update') {
      const id = String(body.id || '');
      if (!id) return new Response(JSON.stringify({ ok: false, error: 'missing_id' }), { status: 400 });
      const fields: string[] = [];
      const args: Array<string | number | boolean | null> = [];
      if (body.name) { fields.push('name = ?'); args.push(String(body.name)); }
      if (body.email) { fields.push('email = ?'); args.push(String(body.email)); }
      if (body.phone) { fields.push('phone = ?'); args.push(String(body.phone)); }
      if (body.vip) { fields.push('vip = ?'); args.push(String(body.vip)); }
      if (!fields.length) return new Response(JSON.stringify({ ok: false, error: 'no_changes' }), { status: 400 });
      await client.execute({ sql: `UPDATE clients SET ${fields.join(', ')} WHERE id = ?`, args: [...args, id] });
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'merge_by_email') {
      const email = String(body.email || '');
      const name = String(body.name || '');
      const phone = String(body.phone || '');
      if (!email) return new Response(JSON.stringify({ ok: false, error: 'missing_email' }), { status: 400 });
      const find = await client.execute({ sql: `SELECT id FROM clients WHERE email = ? LIMIT 1`, args: [email] });
      const row = (find.rows && find.rows[0]) as { id?: unknown } | undefined;
      if (row && row.id) {
        const id = String(row.id);
        const fields: string[] = [];
        const args: Array<string | number | boolean | null> = [];
        if (name) { fields.push('name = ?'); args.push(name); }
        if (phone) { fields.push('phone = ?'); args.push(phone); }
        if (fields.length) await client.execute({ sql: `UPDATE clients SET ${fields.join(', ')} WHERE id = ?`, args: [...args, id] });
        return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
      }
      const id = 'cli_' + Date.now() + Math.random().toString(36).slice(2,8);
      const created_at = new Date().toISOString();
      await client.execute({ sql: `INSERT INTO clients (id, name, email, phone, vip, created_at) VALUES (?, ?, ?, ?, 'no', ?)`, args: [id, name, email, phone, created_at] });
      return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ ok: false, error: 'unknown_action' }), { status: 400 });
  } catch (e) {
    const msg = (e && typeof e === 'object' && 'message' in e) ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};