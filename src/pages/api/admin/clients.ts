import type { APIRoute } from 'astro';
import {
  getTursoClient,
  ensureClientsTable,
  ensureAppointmentsTable,
  ensureContactsTable,
  ensurePaymentsTable,
  ensureClientHoroscopesTable,
} from '../../../lib/turso';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureClientsTable();
    await ensurePaymentsTable();
    await ensureAppointmentsTable();
    await ensureContactsTable();
    await ensureClientHoroscopesTable();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const email = url.searchParams.get('email');
    const phone = url.searchParams.get('phone');
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;
    const client = await getTursoClient();

    if (id || email || phone) {
      const by = id ? 'id' : phone ? 'phone' : 'email';
      const key = id ? String(id) : phone ? String(phone) : String(email);
      const res = await client.execute({
        sql: `SELECT id, name, email, phone, vip, created_at FROM clients WHERE ${by} = ? LIMIT 1`,
        args: [key],
      });
      let c = (res.rows && res.rows[0]) as Record<string, unknown> | undefined;
      // Fallback: derive client from latest appointment when client record doesn't exist
      if (!c && phone) {
        const apFind = await client.execute({
          sql: `SELECT name, email, phone, created_at FROM appointments WHERE phone = ? ORDER BY datetime(created_at) DESC LIMIT 1`,
          args: [String(phone)],
        });
        const apRow = (apFind.rows && apFind.rows[0]) as
          | { name?: unknown; email?: unknown; phone?: unknown; created_at?: unknown }
          | undefined;
        if (apRow) {
          c = {
            id: '',
            name: String(apRow.name || ''),
            email: String(apRow.email || ''),
            phone: apRow.phone != null ? String(apRow.phone) : '',
            vip: 'no',
            created_at: String(apRow.created_at || new Date().toISOString()),
          } as Record<string, unknown>;
        }
      }
      if (!c && email) {
        const apFind = await client.execute({
          sql: `SELECT name, email, phone, created_at FROM appointments WHERE email = ? ORDER BY datetime(created_at) DESC LIMIT 1`,
          args: [String(email)],
        });
        const apRow = (apFind.rows && apFind.rows[0]) as
          | { name?: unknown; email?: unknown; phone?: unknown; created_at?: unknown }
          | undefined;
        if (apRow) {
          c = {
            id: '',
            name: String(apRow.name || ''),
            email: String(apRow.email || ''),
            phone: apRow.phone != null ? String(apRow.phone) : '',
            vip: 'no',
            created_at: String(apRow.created_at || new Date().toISOString()),
          } as Record<string, unknown>;
        }
      }
      if (!c) return new Response(JSON.stringify({ ok: false, error: 'not_found' }), { status: 404 });
      if (!c.id || !String(c.id)) {
        const newId = 'cli_' + Date.now() + Math.random().toString(36).slice(2, 8);
        const created_at = String((c.created_at as string) || new Date().toISOString());
        await client.execute({
          sql: `INSERT INTO clients (id, name, email, phone, vip, created_at) VALUES (?, ?, ?, ?, 'no', ?)`,
          args: [newId, String(c.name || ''), String(c.email || ''), String(c.phone || ''), created_at],
        });
        c.id = newId;
      }
      const cid = String(c.id || '');
      const preferPhone = String(c.phone || '').trim();
      const preferEmail = String(c.email || '').trim();
      const usePhone = !!preferPhone;
      
      const [apRes, coRes, payRes, totalPayRes, horRes] = await Promise.all([
        client.execute({
          sql: preferPhone
            ? `SELECT id, name, email, service, consultation_method, customer_appointment_id, date, time, status, payment_status, message, service_details, created_at FROM appointments WHERE phone = ? ORDER BY datetime(created_at) DESC LIMIT 50`
            : `SELECT id, name, email, service, consultation_method, customer_appointment_id, date, time, status, payment_status, message, service_details, created_at FROM appointments WHERE email = ? ORDER BY datetime(created_at) DESC LIMIT 50`,
          args: [preferPhone || preferEmail],
        }),
        client.execute({
          sql: preferPhone
            ? `SELECT id, subject, status, priority, created_at FROM contacts WHERE phone = ? ORDER BY datetime(created_at) DESC LIMIT 50`
            : `SELECT id, subject, status, priority, created_at FROM contacts WHERE email = ? ORDER BY datetime(created_at) DESC LIMIT 50`,
          args: [preferPhone || preferEmail],
        }),
        cid
          ? client.execute({
              sql: `
                SELECT * FROM (
                  SELECT id, amount, mode, reference, note, created_at, appointment_id FROM payments WHERE client_id = ?
                  UNION ALL
                  SELECT id, amount, mode, reference, note, created_at, appointment_id FROM payments WHERE appointment_id IN (
                    SELECT id FROM appointments WHERE ${usePhone ? 'phone = ?' : 'email = ?'}
                  ) OR appointment_id IN (
                    SELECT customer_appointment_id FROM appointments WHERE ${usePhone ? 'phone = ?' : 'email = ?'}
                  )
                  UNION ALL
                  SELECT id, purchased_amount as amount, 'quote' as mode, number as reference, 'Quote Payment' as note, updated_at as created_at, NULL as appointment_id 
                  FROM quotes 
                  WHERE purchased_amount > 0 AND (${usePhone ? 'client_phone = ?' : 'client_email = ?'})
                ) ORDER BY datetime(created_at) DESC LIMIT 100`,
              args: [
                cid,
                usePhone ? preferPhone : preferEmail,
                usePhone ? preferPhone : preferEmail,
                usePhone ? preferPhone : preferEmail
              ],
            })
          : (preferPhone || preferEmail)
            ? client.execute({
                sql: `
                  SELECT * FROM (
                    SELECT id, amount, mode, reference, note, created_at, appointment_id FROM payments WHERE appointment_id IN (SELECT id FROM appointments WHERE ${usePhone ? 'phone' : 'email'} = ?)
                    UNION ALL
                    SELECT id, purchased_amount as amount, 'quote' as mode, number as reference, 'Quote Payment' as note, updated_at as created_at, NULL as appointment_id 
                    FROM quotes 
                    WHERE purchased_amount > 0 AND (${usePhone ? 'client_phone' : 'client_email'} = ?)
                  ) ORDER BY datetime(created_at) DESC LIMIT 100`,
                args: [usePhone ? preferPhone : preferEmail, usePhone ? preferPhone : preferEmail],
              })
            : Promise.resolve({ rows: [] as Array<Record<string, unknown>> }),
        cid
          ? client.execute({
              sql: `SELECT (
                (SELECT COALESCE(SUM(amount),0) FROM payments WHERE client_id = ?) +
                (SELECT COALESCE(SUM(amount),0) FROM payments WHERE appointment_id IN (SELECT id FROM appointments WHERE ${usePhone ? 'phone = ?' : 'email = ?'})) +
                (SELECT COALESCE(SUM(amount),0) FROM payments WHERE appointment_id IN (SELECT customer_appointment_id FROM appointments WHERE ${usePhone ? 'phone = ?' : 'email = ?'})) +
                (SELECT COALESCE(SUM(purchased_amount),0) FROM quotes WHERE purchased_amount > 0 AND (${usePhone ? 'client_phone = ?' : 'client_email = ?'}))
              ) AS total`,
              args: [
                cid,
                usePhone ? preferPhone : preferEmail,
                usePhone ? preferPhone : preferEmail,
                usePhone ? preferPhone : preferEmail
              ],
            })
          : (preferPhone || preferEmail)
            ? client.execute({
                sql: `SELECT (
                  (SELECT COALESCE(SUM(amount),0) FROM payments WHERE appointment_id IN (SELECT id FROM appointments WHERE ${usePhone ? 'phone' : 'email'} = ?)) +
                  (SELECT COALESCE(SUM(purchased_amount),0) FROM quotes WHERE purchased_amount > 0 AND (${usePhone ? 'client_phone' : 'client_email'} = ?))
                ) AS total`,
                args: [usePhone ? preferPhone : preferEmail, usePhone ? preferPhone : preferEmail],
              })
            : Promise.resolve({ rows: [{ total: 0 }] as Array<Record<string, unknown>> }),
        cid
          ? client.execute({
              sql: `SELECT id, name, relation, gender, dob, tob, pob, latitude, longitude, timezone, notes, created_at, updated_at FROM client_horoscopes WHERE client_id = ? ORDER BY datetime(created_at) DESC`,
              args: [cid],
            })
          : Promise.resolve({ rows: [] as Array<Record<string, unknown>> }),
      ]);
      const totalPaidRow = (totalPayRes.rows && totalPayRes.rows[0]) as { total?: unknown } | undefined;
      const totalPaid = Number(totalPaidRow?.total ?? 0);
      return new Response(
        JSON.stringify({
          ok: true,
          data: {
            client: c,
            appointments: apRes.rows || [],
            contacts: coRes.rows || [],
            payments: payRes.rows || [],
            horoscopes: horRes.rows || [],
            totals: { paid: totalPaid },
          },
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const [listRes, countRes] = await Promise.all([
      client.execute({
        sql: `
          SELECT c.id,
                 COALESCE(NULLIF(c.name,''), ap.name) AS name,
                 c.email,
                 COALESCE(NULLIF(c.phone,''), ap.phone) AS phone,
                 c.vip,
                 c.created_at
          FROM clients c
          LEFT JOIN (
            SELECT email, MAX(datetime(created_at)) AS last_created,
                   (SELECT name FROM appointments a2 WHERE a2.email = a.email ORDER BY datetime(a2.created_at) DESC LIMIT 1) AS name,
                   (SELECT phone FROM appointments a3 WHERE a3.email = a.email ORDER BY datetime(a3.created_at) DESC LIMIT 1) AS phone
            FROM appointments a
            WHERE email IS NOT NULL AND email <> ''
            GROUP BY email
          ) ap ON ap.email = c.email
          ORDER BY datetime(c.created_at) DESC
          LIMIT ? OFFSET ?
        `,
        args: [limit, offset],
      }),
      client.execute({ sql: `SELECT COUNT(*) AS total FROM clients`, args: [] }),
    ]);
    const totalsByClient: Record<string, number> = {};
    if (Array.isArray(listRes.rows) && listRes.rows.length) {
      const ids = (listRes.rows as Array<Record<string, unknown>>).map((r) => String(r.id));
      const inClause = ids.map(() => '?').join(',');
      const sumRes = await client.execute({
        sql: `SELECT client_id, COALESCE(SUM(amount),0) AS total FROM payments WHERE client_id IN (${inClause}) GROUP BY client_id`,
        args: ids,
      });
      for (const row of (sumRes.rows || []) as Array<Record<string, unknown>>)
        totalsByClient[String(row.client_id)] = Number(row.total || 0);
    }
    const totalRow = (countRes.rows && countRes.rows[0]) as { total?: unknown } | undefined;
    const total = Number(totalRow?.total ?? 0);
    const data = (listRes.rows || []).map((r: Record<string, unknown>) => ({
      ...r,
      total_paid: totalsByClient[String(r.id)] || 0,
    }));
    return new Response(
      JSON.stringify({ ok: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const secret = (() => {
      const metaEnv = (import.meta as unknown as { env?: Record<string, unknown> }).env;
      const fromImportMeta = typeof metaEnv?.['SESSION_SECRET'] === 'string' ? (metaEnv?.['SESSION_SECRET'] as string) : undefined;
      const fromProcess = typeof process !== 'undefined' ? process.env?.['SESSION_SECRET'] : undefined;
      return fromImportMeta ?? fromProcess ?? 'change-me';
    })();
    const { requireRole } = await import('../../../lib/rbac');
    const { isValidCsrf } = await import('../../../lib/csrf');
    if (!(await requireRole(request, String(secret), ['admin']))) return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 403 });
    if (!isValidCsrf(request)) return new Response(JSON.stringify({ ok: false, error: 'csrf_failed' }), { status: 403 });
    await ensureClientsTable();
    const client = await getTursoClient();
    const body = await request.json();
    const action = String((body && body.action) || 'create');
    if (action === 'create') {
      const name = String(body.name || '');
      const email = String(body.email || '');
      const phone = String(body.phone || '');
      if (!name || !email) return new Response(JSON.stringify({ ok: false, error: 'missing_fields' }), { status: 400 });
      const id = 'cli_' + Date.now() + Math.random().toString(36).slice(2, 8);
      const created_at = new Date().toISOString();
      await client.execute({
        sql: `INSERT INTO clients (id, name, email, phone, vip, created_at) VALUES (?, ?, ?, ?, 'no', ?)`,
        args: [id, name, email, phone, created_at],
      });
      return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'update') {
      const id = String(body.id || '');
      if (!id) return new Response(JSON.stringify({ ok: false, error: 'missing_id' }), { status: 400 });
      const fields: string[] = [];
      const args: Array<string | number | boolean | null> = [];
      if (body.name) {
        fields.push('name = ?');
        args.push(String(body.name));
      }
      if (body.email) {
        fields.push('email = ?');
        args.push(String(body.email));
      }
      if (body.phone) {
        fields.push('phone = ?');
        args.push(String(body.phone));
      }
      if (body.vip) {
        fields.push('vip = ?');
        args.push(String(body.vip));
      }
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
        if (name) {
          fields.push('name = ?');
          args.push(name);
        }
        if (phone) {
          fields.push('phone = ?');
          args.push(phone);
        }
        if (fields.length)
          await client.execute({ sql: `UPDATE clients SET ${fields.join(', ')} WHERE id = ?`, args: [...args, id] });
        return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
      }
      const id = 'cli_' + Date.now() + Math.random().toString(36).slice(2, 8);
      const created_at = new Date().toISOString();
      await client.execute({
        sql: `INSERT INTO clients (id, name, email, phone, vip, created_at) VALUES (?, ?, ?, ?, 'no', ?)`,
        args: [id, name, email, phone, created_at],
      });
      return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ ok: false, error: 'unknown_action' }), { status: 400 });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};
