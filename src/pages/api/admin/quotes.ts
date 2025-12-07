import type { APIRoute } from 'astro';
import { getTursoClient, ensureQuotesTable, ensureQuoteItemsTable } from '../../../lib/turso';
import { logActivity } from '../../../lib/activity-logger';

// Helper function to convert data to CSV format
function convertToCSV(data: Record<string, unknown>[], headers: string[]): string {
  const csvHeaders = headers.join(',');
  const csvRows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header] || '';
        // Escape quotes and wrap in quotes if contains comma or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return String(value);
      })
      .join(',')
  );
  return [csvHeaders, ...csvRows].join('\n');
}

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureQuotesTable();
    await ensureQuoteItemsTable();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const stats = url.searchParams.get('stats');
    const exportType = url.searchParams.get('export'); // 'report1' or 'report2'
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;
    const status = url.searchParams.get('status');
    const email = url.searchParams.get('email');
    const client = await getTursoClient();

    // Handle export requests
    if (exportType === 'report1') {
      // Report 1: Customer overview with appointment and quotation details
      const query = `
        SELECT 
          q.id as quote_id,
          q.number as quote_number,
          q.client_name,
          q.client_email,
          q.client_phone,
          q.status as quotation_status,
          q.total as quotation_total,
          q.created_at as quotation_date,
          a.id as appointment_id,
          a.service,
          a.date as appointment_date,
          a.time as appointment_time,
          a.status as appointment_status
        FROM quotes q
        LEFT JOIN appointments a ON a.email = q.client_email AND a.rowid = (
          SELECT rowid FROM appointments WHERE email = q.client_email ORDER BY datetime(date || ' ' || time) DESC LIMIT 1
        )
        ORDER BY q.created_at DESC
      `;
      const result = await client.execute({ sql: query, args: [] });
      const data = (result.rows || []).map((r) => {
        const status = String((r as Record<string, unknown>).quotation_status || '');
        const mapped = status === 'No Revert' ? 'Quotation Sent' : status;
        return { ...(r as Record<string, unknown>), quotation_status: mapped } as Record<string, unknown>;
      });

      const headers = [
        'quote_id',
        'quote_number',
        'client_name',
        'client_email',
        'client_phone',
        'quotation_status',
        'quotation_total',
        'quotation_date',
        'appointment_id',
        'service',
        'appointment_date',
        'appointment_time',
        'appointment_status',
      ];

      const csv = convertToCSV(data, headers);
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="quotation_report_1.csv"',
        },
      });
    }

    if (exportType === 'report2') {
      // Report 2: Detailed quotation with line items
      const query = `
        SELECT 
          q.id as quote_id,
          q.number as quote_number,
          q.client_name,
          q.client_email,
          q.client_phone,
          q.status as quotation_status,
          q.total as quotation_total,
          q.created_at as quotation_date,
          a.id as appointment_id,
          a.service,
          a.date as appointment_date,
          a.time as appointment_time,
          a.status as appointment_status,
          qi.title as particular,
          qi.carat as unit,
          qi.rate_per_carat as unit_price,
          qi.amount as line_total
        FROM quotes q
        LEFT JOIN appointments a ON a.email = q.client_email AND a.rowid = (
          SELECT rowid FROM appointments WHERE email = q.client_email ORDER BY datetime(date || ' ' || time) DESC LIMIT 1
        )
        LEFT JOIN quote_items qi ON q.id = qi.quote_id
        ORDER BY q.created_at DESC, qi.rowid ASC
      `;
      const result = await client.execute({ sql: query, args: [] });
      const data = (result.rows || []).map((r) => {
        const status = String((r as Record<string, unknown>).quotation_status || '');
        const mapped = status === 'No Revert' ? 'Quotation Sent' : status;
        return { ...(r as Record<string, unknown>), quotation_status: mapped } as Record<string, unknown>;
      });

      const headers = [
        'quote_id',
        'quote_number',
        'client_name',
        'client_email',
        'client_phone',
        'quotation_status',
        'quotation_total',
        'quotation_date',
        'appointment_id',
        'service',
        'appointment_date',
        'appointment_time',
        'appointment_status',
        'particular',
        'unit',
        'unit_price',
        'line_total',
      ];

      const csv = convertToCSV(data, headers);
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="quotation_report_2.csv"',
        },
      });
    }
    if (id) {
      const [qRes, itemsRes] = await Promise.all([
        client.execute({
          sql: `SELECT id, number, client_name, client_email, client_phone, status, total, created_at, updated_at FROM quotes WHERE id = ? LIMIT 1`,
          args: [String(id)],
        }),
        client.execute({
          sql: `SELECT id, title, carat, rate_per_carat, amount FROM quote_items WHERE quote_id = ? ORDER BY rowid ASC`,
          args: [String(id)],
        }),
      ]);
      const qRow = (qRes.rows && qRes.rows[0]) || null;
      return new Response(JSON.stringify({ ok: true, data: qRow, items: itemsRes.rows || [] }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (stats) {
      const [totalsRes, byStatusRes] = await Promise.all([
        // Exclude Cancelled AND Purchased from main amount (Pending Amount)
        // We calculate Purchased amount separately
        client.execute({
          sql: `SELECT 
                  COUNT(*) AS count,
                  COALESCE(SUM(CASE WHEN status NOT IN ('Cancelled', 'Purchased') THEN total ELSE 0 END), 0) AS pending_amount,
                  COALESCE(SUM(CASE WHEN status = 'Purchased' THEN total ELSE 0 END), 0) AS purchased_amount
                FROM quotes`,
          args: [],
        }),
        client.execute({
          sql: `SELECT status, COUNT(*) AS count, COALESCE(SUM(total),0) AS amount FROM quotes GROUP BY status`,
          args: [],
        }),
      ]);
      const totalsRow = (totalsRes.rows?.[0] || { count: 0, pending_amount: 0, purchased_amount: 0 }) as Record<string, unknown>;
      const totals = {
        count: Number((totalsRow as Record<string, unknown>).count || 0),
        amount: Math.max(0, Number((totalsRow as Record<string, unknown>).pending_amount || 0)),
        purchased_amount: Math.max(0, Number((totalsRow as Record<string, unknown>).purchased_amount || 0)),
      };
      return new Response(JSON.stringify({ ok: true, totals, by_status: byStatusRes.rows || [] }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const filters: string[] = [];
    const args: (string | number | boolean | bigint | null)[] = [];
    if (status) {
      filters.push('status = ?');
      args.push(String(status));
    }
    if (email) {
      filters.push('client_email = ?');
      args.push(String(email));
    }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const [dataRes, countRes] = await Promise.all([
      client.execute({
        sql: `SELECT id, number, client_name, client_email, client_phone, status, total, created_at, updated_at FROM quotes ${where} ORDER BY datetime(created_at) DESC LIMIT ? OFFSET ?`,
        args: [...args, limit, offset],
      }),
      client.execute({ sql: `SELECT COUNT(*) AS total FROM quotes ${where}`, args }),
    ]);
    const rows = dataRes.rows || [];
    const countRow = (countRes.rows || [])[0] as Record<string, unknown> | undefined;
    const total = Number(countRow?.total || 0);
    return new Response(JSON.stringify({ ok: true, data: rows, pagination: { page, limit, total } }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await ensureQuotesTable();
    await ensureQuoteItemsTable();
    const body = await request.json();
    const client_name = String(body.client_name || '');
    const client_email = String(body.client_email || '');
    const client_phone = String(body.client_phone || '');
    const status = 'Created';
    const items = Array.isArray(body.items) ? body.items : [];
    if (!client_name || !client_email)
      return new Response(JSON.stringify({ ok: false, error: 'client required' }), { status: 400 });
    const id = 'quote_' + Date.now() + Math.random().toString(36).slice(2, 8);
    const number =
      'Q' +
      new Date().toISOString().slice(0, 10).replace(/-/g, '') +
      '-' +
      Math.random().toString(36).slice(2, 5).toUpperCase();
    const created_at = new Date().toISOString();
    const updated_at = created_at;
    let total = 0;
    for (const it of items) {
      const carat = Number(it.unit || it.carat || 0);
      const rate = Number(it.unit_price || it.rate_per_carat || 0);
      total += carat * rate;
    }
    const client = await getTursoClient();
    await client.execute({
      sql: `INSERT INTO quotes (id, number, client_name, client_email, client_phone, status, total, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, number, client_name, client_email, client_phone, status, total, created_at, updated_at],
    });
    for (const it of items) {
      const qid = 'qitem_' + Date.now() + Math.random().toString(36).slice(2, 8);
      const title = String(it.title || '');
      const carat = Number(it.unit || it.carat || 0);
      const rate = Number(it.unit_price || it.rate_per_carat || 0);
      const amount = carat * rate;
      await client.execute({
        sql: `INSERT INTO quote_items (id, quote_id, title, carat, rate_per_carat, amount) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [qid, id, title, carat, rate, amount],
      });
    }
    await logActivity('quote_created', 'quote', id, `Quote created for ${client_name} (${client_email})`);
    return new Response(JSON.stringify({ ok: true, id, number, total }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const { isValidCsrf } = await import('../../../lib/csrf');
    if (!isValidCsrf(request)) {
      return new Response(JSON.stringify({ ok: false, error: 'csrf_failed' }), { status: 403 });
    }
    await ensureQuotesTable();
    await ensureQuoteItemsTable();
    const body = await request.json();
    const id = String(body.id || '');
    if (!id) return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400 });
    const updates: string[] = [];
    const args: (string | number | boolean | bigint | null)[] = [];
    if (body.client_name != null) {
      updates.push('client_name = ?');
      args.push(String(body.client_name));
    }
    if (body.client_email != null) {
      updates.push('client_email = ?');
      args.push(String(body.client_email));
    }
    if (body.client_phone != null) {
      updates.push('client_phone = ?');
      args.push(String(body.client_phone));
    }
    if (body.status != null) {
      updates.push('status = ?');
      args.push(String(body.status));
    }
    if (Array.isArray(body.items)) {
      let total = 0;
      for (const it of body.items) {
        const carat = Number(it.unit || it.carat || 0);
        const rate = Number(it.unit_price || it.rate_per_carat || 0);
        total += carat * rate;
      }
      updates.push('total = ?');
      args.push(total);
    }
    if (updates.length) {
      const client = await getTursoClient();
      // Fetch previous status for audit logging
      let prevStatus: string | null = null;
      if (body.status != null) {
        const prevRes = await client.execute({
          sql: `SELECT status FROM quotes WHERE id = ? LIMIT 1`,
          args: [id],
        });
        const row = (prevRes.rows && prevRes.rows[0]) as Record<string, unknown> | undefined;
        prevStatus = row ? String(row.status || '') : null;
      }
      updates.push('updated_at = ?');
      args.push(new Date().toISOString());
      await client.execute({ sql: `UPDATE quotes SET ${updates.join(', ')} WHERE id = ?`, args: [...args, id] });
      if (Array.isArray(body.items)) {
        await client.execute({ sql: `DELETE FROM quote_items WHERE quote_id = ?`, args: [id] });
        for (const it of body.items) {
          const qid = 'qitem_' + Date.now() + Math.random().toString(36).slice(2, 8);
          const title = String(it.title || '');
          const carat = Number(it.unit || it.carat || 0);
          const rate = Number(it.unit_price || it.rate_per_carat || 0);
          const amount = carat * rate;
          await client.execute({
            sql: `INSERT INTO quote_items (id, quote_id, title, carat, rate_per_carat, amount) VALUES (?, ?, ?, ?, ?, ?)`,
            args: [qid, id, title, carat, rate, amount],
          });
        }
      }
      // Audit logging: status changes
      if (body.status != null) {
        const newStatus = String(body.status);
        if (prevStatus == null || prevStatus !== newStatus) {
          await logActivity(
            'quote_status_changed',
            'quote',
            id,
            `Status changed from ${prevStatus || 'unknown'} to ${newStatus}`
          );
        }
      }
      await logActivity('quote_updated', 'quote', id, `Quote updated`);
    }
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    await ensureQuotesTable();
    await ensureQuoteItemsTable();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400 });
    const client = await getTursoClient();
    await client.execute({ sql: `DELETE FROM quote_items WHERE quote_id = ?`, args: [String(id)] });
    await client.execute({ sql: `DELETE FROM quotes WHERE id = ?`, args: [String(id)] });
    await logActivity('quote_deleted', 'quote', String(id), `Quote deleted`);
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};
