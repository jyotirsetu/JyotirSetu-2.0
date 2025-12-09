import type { APIRoute } from 'astro';
import {
  getTursoClient,
  ensureInvoicesTable,
  ensureInvoiceItemsTable,
  ensureClientsTable,
} from '../../../lib/turso';

export const prerender = false;

function invNumber(): string {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return 'INV' + d + '-' + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureInvoicesTable();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const number = url.searchParams.get('number');
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;
    const db = await getTursoClient();
    if (id || number) {
      const by = id ? 'id' : 'number';
      const key = id ? String(id) : String(number);
      const res = await db.execute({ sql: `SELECT * FROM invoices WHERE ${by} = ? LIMIT 1`, args: [key] });
      return new Response(JSON.stringify({ ok: true, data: res.rows?.[0] || null }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const [rowsRes, countRes] = await Promise.all([
      db.execute({ sql: `SELECT * FROM invoices ORDER BY datetime(created_at) DESC LIMIT ? OFFSET ?`, args: [limit, offset] }),
      db.execute({ sql: `SELECT COUNT(*) AS total FROM invoices`, args: [] }),
    ]);
    const totalRow = (countRes.rows || [])[0] as Record<string, unknown> | undefined;
    const total = Number(totalRow?.total || 0);
    return new Response(JSON.stringify({ ok: true, data: rowsRes.rows || [], pagination: { page, limit, total } }), {
      headers: { 'Content-Type': 'application/json' },
    });
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
    await ensureInvoicesTable();
    await ensureInvoiceItemsTable();
    await ensureClientsTable();
    const db = await getTursoClient();
    const body = await request.json();
    const action = String((body && body.action) || 'create_from_quote');
    if (action === 'create_from_quote') {
      const quote_id = String(body.quote_id || '');
      if (!quote_id) return new Response(JSON.stringify({ ok: false, error: 'missing_quote_id' }), { status: 400 });
      const [qRes, itemsRes] = await Promise.all([
        db.execute({
          sql: `SELECT id, client_name, client_email, client_phone, total, created_at FROM quotes WHERE id = ? LIMIT 1`,
          args: [quote_id],
        }),
        db.execute({ sql: `SELECT title, carat, rate_per_carat, amount FROM quote_items WHERE quote_id = ? ORDER BY rowid ASC`, args: [quote_id] }),
      ]);
      const q = (qRes.rows && qRes.rows[0]) as Record<string, unknown> | undefined;
      if (!q) return new Response(JSON.stringify({ ok: false, error: 'quote_not_found' }), { status: 404 });
      // find or create client
      const email = String(q.client_email || '');
      const name = String(q.client_name || '');
      const phone = String(q.client_phone || '');
      let client_id = '';
      {
        const cRes = await db.execute({ sql: `SELECT id FROM clients WHERE email = ? LIMIT 1`, args: [email] });
        const cRow = (cRes.rows && cRes.rows[0]) as { id?: unknown } | undefined;
        if (cRow && cRow.id) client_id = String(cRow.id);
        else {
          client_id = 'cli_' + Date.now() + Math.random().toString(36).slice(2, 8);
          await db.execute({
            sql: `INSERT INTO clients (id, name, email, phone, vip, created_at) VALUES (?, ?, ?, ?, 'no', ?)`,
            args: [client_id, name, email, phone, new Date().toISOString()],
          });
        }
      }
      const invoice_id = 'inv_' + Date.now() + Math.random().toString(36).slice(2, 8);
      const number = invNumber();
      const created_at = new Date().toISOString();
      const updated_at = created_at;
      const subtotal = Number(q.total || 0);
      const gst_total = 0;
      const rounding = 0;
      const total = subtotal + gst_total + rounding;
      await db.execute({
        sql: `INSERT INTO invoices (id, number, client_id, status, issue_date, subtotal, gst_total, rounding, total, created_at, updated_at) VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?)`,
        args: [invoice_id, number, client_id, created_at, subtotal, gst_total, rounding, total, created_at, updated_at],
      });
      const items = (itemsRes.rows || []) as Array<Record<string, unknown>>;
      for (const it of items) {
        const item_id = 'invi_' + Date.now() + Math.random().toString(36).slice(2, 8);
        const title = String(it.title || 'Particular');
        const qty = Number(it.carat || 0);
        const unit_price = Number(it.rate_per_carat || 0);
        const amount = Number(it.amount || qty * unit_price);
        await db.execute({
          sql: `INSERT INTO invoice_items (id, invoice_id, type, title, qty, unit_price, discount, gst_rate, amount) VALUES (?, ?, 'service', ?, ?, ?, 0, 0, ?)`,
          args: [item_id, invoice_id, title, qty, unit_price, amount],
        });
      }
      try {
        const { ensureActivityLogTable } = await import('../../../lib/turso');
        await ensureActivityLogTable();
        await db.execute({
          sql: `INSERT INTO activity_log (id, action, entity_type, entity_id, user, details, created_at) VALUES (?, ?, ?, ?, 'admin', ?, ?)`,
          args: [
            'act_' + Date.now() + Math.random().toString(36).slice(2, 8),
            'invoice_created',
            'invoice',
            invoice_id,
            `Invoice ${number} created from quote ${quote_id}`,
            new Date().toISOString(),
          ],
        });
      } catch { /* activity log is optional; ignore errors */ }
      return new Response(JSON.stringify({ ok: true, id: invoice_id, number, total }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ ok: false, error: 'unknown_action' }), { status: 400 });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};
