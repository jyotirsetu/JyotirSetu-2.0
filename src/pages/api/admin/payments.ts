import type { APIRoute } from 'astro';
import { getTursoClient, ensureClientsTable, ensurePaymentsTable } from '../../../lib/turso';

export const prerender = false;

async function findOrCreateClientByEmail(email: string, name?: string, phone?: string) {
  await ensureClientsTable();
  const client = await getTursoClient();
  const res = await client.execute({ sql: `SELECT id FROM clients WHERE email = ? LIMIT 1`, args: [email] });
  const row = (res.rows && res.rows[0]) as { id?: unknown } | undefined;
  if (row && row.id) return String(row.id);
  const id = 'cli_' + Date.now() + Math.random().toString(36).slice(2, 8);
  const created_at = new Date().toISOString();
  await client.execute({
    sql: `INSERT INTO clients (id, name, email, phone, vip, created_at) VALUES (?, ?, ?, ?, 'no', ?)`,
    args: [id, String(name || ''), email, String(phone || ''), created_at],
  });
  return id;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensurePaymentsTable();
    await ensureClientsTable();
    const url = new URL(request.url);
    const client_id = url.searchParams.get('client_id');
    const email = url.searchParams.get('email');
    const appointment_id = url.searchParams.get('appointment_id');
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;
    const db = await getTursoClient();
    let cid = client_id || '';
    if (!cid && email) {
      const find = await db.execute({ sql: `SELECT id FROM clients WHERE email = ? LIMIT 1`, args: [String(email)] });
      const row = (find.rows && find.rows[0]) as { id?: unknown } | undefined;
      cid = row && row.id ? String(row.id) : '';
    }
    if (appointment_id) {
      const [rowsRes, sumRes] = await Promise.all([
        db.execute({
          sql: `SELECT id, amount, total_due, balance, entry_type, status, mode, reference, note, created_at, appointment_id FROM payments WHERE appointment_id = ? ORDER BY datetime(created_at) DESC LIMIT ? OFFSET ?`,
          args: [String(appointment_id), limit, offset],
        }),
        db.execute({
          sql: `SELECT COALESCE(SUM(CASE WHEN entry_type = 'credit' THEN amount ELSE 0 END),0) AS total FROM payments WHERE appointment_id = ?`,
          args: [String(appointment_id)],
        }),
      ]);
      const totalRow = (sumRes.rows && sumRes.rows[0]) as { total?: unknown } | undefined;
      const totalPaid = Number(totalRow?.total ?? 0);
      return new Response(JSON.stringify({ ok: true, data: rowsRes.rows || [], totals: { paid: totalPaid } }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (cid) {
      const [rowsRes, sumRes] = await Promise.all([
        db.execute({
          sql: `SELECT id, amount, total_due, balance, entry_type, status, mode, reference, note, created_at, appointment_id FROM payments WHERE client_id = ? ORDER BY datetime(created_at) DESC LIMIT ? OFFSET ?`,
          args: [String(cid), limit, offset],
        }),
        db.execute({
          sql: `SELECT COALESCE(SUM(CASE WHEN entry_type = 'credit' THEN amount ELSE 0 END),0) AS total FROM payments WHERE client_id = ?`,
          args: [String(cid)],
        }),
      ]);
      const totalRow = (sumRes.rows && sumRes.rows[0]) as { total?: unknown } | undefined;
      const totalPaid = Number(totalRow?.total ?? 0);
      return new Response(JSON.stringify({ ok: true, data: rowsRes.rows || [], totals: { paid: totalPaid } }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (email && !cid) {
      return new Response(JSON.stringify({ ok: true, data: [], totals: { paid: 0 } }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const [rowsRes] = await Promise.all([
      db.execute({
        sql: `SELECT client_id, COALESCE(SUM(amount),0) AS total FROM payments GROUP BY client_id ORDER BY total DESC`,
        args: [],
      }),
    ]);
    return new Response(JSON.stringify({ ok: true, data: rowsRes.rows || [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await ensurePaymentsTable();
    const db = await getTursoClient();
    const body = await request.json();
    const action = String((body && body.action) || 'add');
    if (action === 'add') {
      const client_id = String(body.client_id || '');
      const email = String(body.email || '');
      const name = String(body.name || '');
      const phone = String(body.phone || '');
      const amount = Number(body.amount || 0);
      const mode = String(body.mode || 'cash');
      const total_due_raw = body.total_due != null ? Number(body.total_due) : null;
      const entry_type = String(body.entry_type || 'credit');
      const reference = body.reference ? String(body.reference) : null;
      const note = body.note ? String(body.note) : null;
      const appointment_id = body.appointment_id ? String(body.appointment_id) : null;
      if (!amount || amount <= 0)
        return new Response(JSON.stringify({ ok: false, error: 'invalid_amount' }), { status: 400 });
      let cid = client_id;
      if (!cid) {
        if (!email) return new Response(JSON.stringify({ ok: false, error: 'missing_client' }), { status: 400 });
        cid = await findOrCreateClientByEmail(email, name, phone);
      }
      const id = 'pay_' + Date.now() + Math.random().toString(36).slice(2, 8);
      const created_at = new Date().toISOString();
      const total_due = total_due_raw != null ? total_due_raw : null;
      const balance = total_due != null ? Math.max(0, total_due - amount) : null;
      const status = total_due == null ? 'paid' : amount <= 0 ? 'unpaid' : amount < total_due ? 'partial' : 'paid';
      await db.execute({
        sql: `INSERT INTO payments (id, client_id, appointment_id, amount, total_due, balance, entry_type, status, mode, reference, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          cid,
          appointment_id,
          amount,
          total_due,
          balance,
          entry_type,
          status,
          mode,
          reference,
          note,
          created_at,
        ],
      });
      return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'remove') {
      const id = String(body.id || '');
      if (!id) return new Response(JSON.stringify({ ok: false, error: 'missing_id' }), { status: 400 });
      await db.execute({ sql: `DELETE FROM payments WHERE id = ?`, args: [id] });
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'update') {
      const id = String(body.id || '');
      if (!id) return new Response(JSON.stringify({ ok: false, error: 'missing_id' }), { status: 400 });
      const find = await db.execute({
        sql: `SELECT amount, total_due, balance, entry_type, status, mode, reference, note FROM payments WHERE id = ? LIMIT 1`,
        args: [id],
      });
      const row = (find.rows && find.rows[0]) as Record<string, unknown> | undefined;
      if (!row) return new Response(JSON.stringify({ ok: false, error: 'not_found' }), { status: 404 });
      const amount = body.amount != null ? Number(body.amount) : Number(row.amount || 0);
      const total_due =
        body.total_due != null ? Number(body.total_due) : row.total_due != null ? Number(row.total_due) : null;
      const entry_type = body.entry_type ? String(body.entry_type) : String(row.entry_type || 'credit');
      const mode = body.mode ? String(body.mode) : String(row.mode || 'cash');
      const reference =
        body.reference != null
          ? body.reference
            ? String(body.reference)
            : null
          : row.reference != null
            ? String(row.reference)
            : null;
      const note =
        body.note != null ? (body.note ? String(body.note) : null) : row.note != null ? String(row.note) : null;
      const balance = total_due != null ? Math.max(0, total_due - amount) : null;
      const status = total_due == null ? 'paid' : amount <= 0 ? 'unpaid' : amount < total_due ? 'partial' : 'paid';
      await db.execute({
        sql: `UPDATE payments SET amount = ?, total_due = ?, balance = ?, entry_type = ?, status = ?, mode = ?, reference = ?, note = ? WHERE id = ?`,
        args: [amount, total_due, balance, entry_type, status, mode, reference, note, id],
      });
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ ok: false, error: 'unknown_action' }), { status: 400 });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};
