import type { APIRoute } from 'astro';
import {
  getTursoClient,
  ensureAppointmentsTable,
  ensureContactsTable,
  ensureNewsletterSubscribersTable,
  ensureNotesTable,
} from '../../../lib/turso';
import { logActivity } from '../../../lib/activity-logger';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type'); // 'appointments' or 'contacts' or 'newsletter'
    const format = url.searchParams.get('format') || 'csv';
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const fieldsParam = url.searchParams.get('fields');
    const selectedFields = (fieldsParam || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (type !== 'appointments' && type !== 'contacts' && type !== 'newsletter') {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid type' }), { status: 400 });
    }

    const client = await getTursoClient();
    let rows: Array<Record<string, unknown>> = [];
    let filename = '';

    if (type === 'appointments') {
      await ensureAppointmentsTable();
      await ensureNotesTable();
      const filters: string[] = [];
      const args: (string | number | boolean | bigint | null)[] = [];
      if (from) {
        if (from.length === 10) {
          filters.push(`date(created_at) >= date(?)`);
        } else {
          filters.push(`created_at >= ?`);
        }
        args.push(from);
      }
      if (to) {
        if (to.length === 10) {
          filters.push(`date(created_at) <= date(?)`);
        } else {
          filters.push(`created_at <= ?`);
        }
        args.push(to);
      }
      const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
      const res = await client.execute({
        sql: `SELECT id, customer_appointment_id, name, email, phone, service, date, time, consultation_method, status, payment_status, message, source, created_at
              FROM appointments ${where} ORDER BY datetime(created_at) DESC`,
        args,
      });
      // Map to a clean CSV shape with human-friendly Appt ID first
      const rowsRaw = res.rows as Array<Record<string, unknown>>;
      const notesByAppt: Record<string, string[]> = {};
      let maxNotes = 0;
      for (const r of rowsRaw) {
        const apptId = String(r.id || '');
        if (!apptId) {
          notesByAppt[apptId] = [];
          continue;
        }
        const nres = await client.execute({
          sql: `SELECT note_text FROM notes WHERE entity_type = 'appointment' AND entity_id = ? ORDER BY datetime(created_at) DESC`,
          args: [apptId],
        });
        const notes = (nres.rows || []).map((n: Record<string, unknown>) => String(n.note_text || '')).filter(Boolean);
        notesByAppt[apptId] = notes;
        if (notes.length > maxNotes) maxNotes = notes.length;
      }
      const fullRows = rowsRaw.map((row) => ({
        id: row.id ?? '',
        appt_id: row.customer_appointment_id ?? '',
        name: row.name ?? '',
        email: row.email ?? '',
        phone: row.phone ?? '',
        service: row.service ?? '',
        date: row.date ?? '',
        time: row.time ?? '',
        consultation_method: row.consultation_method ?? '',
        status: row.status ?? '',
        payment_status: row.payment_status ?? '',
        message: row.message ?? '',
        source: row.source ?? '',
        created_at: row.created_at ?? '',
        _notes: notesByAppt[String(row.id || '')] || [],
      }));
      const allowed = [
        'appt_id',
        'name',
        'email',
        'phone',
        'service',
        'date',
        'time',
        'consultation_method',
        'status',
        'payment_status',
        'message',
        'source',
        'created_at',
        'notes',
      ];
      const fields = selectedFields.length ? selectedFields.filter((f) => allowed.includes(f)) : allowed;
      const includeNotes = fields.includes('notes');
      const baseHeaders = fields.filter((f) => f !== 'notes');
      rows = fullRows.map((r) => {
        const o: Record<string, unknown> = {};
        for (const k of baseHeaders) o[k] = r[k as keyof typeof r];
        if (includeNotes) {
          o['notes_count'] = r._notes.length;
          for (let i = 0; i < maxNotes; i++) {
            o[`notes_${i + 1}`] = r._notes[i] ?? '';
          }
        }
        return o;
      });
      filename = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (type === 'contacts') {
      await ensureContactsTable();
      const filters: string[] = [];
      const args: (string | number | boolean | bigint | null)[] = [];
      if (from) {
        if (from.length === 10) {
          filters.push(`date(created_at) >= date(?)`);
        } else {
          filters.push(`created_at >= ?`);
        }
        args.push(from);
      }
      if (to) {
        if (to.length === 10) {
          filters.push(`date(created_at) <= date(?)`);
        } else {
          filters.push(`created_at <= ?`);
        }
        args.push(to);
      }
      const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
      const res = await client.execute({
        sql: `SELECT id, name, email, phone, subject, message, status, priority, created_at
              FROM contacts ${where} ORDER BY datetime(created_at) DESC`,
        args,
      });
      const fullRows = res.rows as Array<Record<string, unknown>>;
      const allowed = ['id', 'name', 'email', 'phone', 'subject', 'message', 'status', 'priority', 'created_at'];
      const fields = selectedFields.length ? selectedFields.filter((f) => allowed.includes(f)) : allowed;
      rows = fullRows.map((row) => {
        const o: Record<string, unknown> = {};
        for (const k of fields) o[k] = (row as Record<string, unknown>)[k];
        return o;
      });
      filename = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      await ensureNewsletterSubscribersTable();
      const filters: string[] = [];
      const args: (string | number | boolean | bigint | null)[] = [];
      if (from) {
        if (from.length === 10) {
          filters.push(`date(subscribed_at) >= date(?)`);
        } else {
          filters.push(`subscribed_at >= ?`);
        }
        args.push(from);
      }
      if (to) {
        if (to.length === 10) {
          filters.push(`date(subscribed_at) <= date(?)`);
        } else {
          filters.push(`subscribed_at <= ?`);
        }
        args.push(to);
      }
      const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
      const res = await client.execute({
        sql: `SELECT id, name, email, status, subscribed_at FROM newsletter_subscribers ${where} ORDER BY datetime(subscribed_at) DESC`,
        args,
      });
      const fullRows = res.rows as Array<Record<string, unknown>>;
      const allowed = ['id', 'name', 'email', 'status', 'subscribed_at'];
      const fields = selectedFields.length ? selectedFields.filter((f) => allowed.includes(f)) : allowed;
      rows = fullRows.map((row) => {
        const o: Record<string, unknown> = {};
        for (const k of fields) o[k] = (row as Record<string, unknown>)[k];
        return o;
      });
      filename = `newsletter_${new Date().toISOString().split('T')[0]}.csv`;
    }

    if (format === 'csv') {
      const headers = (() => {
        if (!rows.length) return [] as string[];
        const keys = new Set<string>();
        rows.forEach((r) => Object.keys(r).forEach((k) => keys.add(k)));
        return Array.from(keys);
      })();
      const csvRows = [
        headers.join(','),
        ...rows.map((row) =>
          headers
            .map((h) => {
              const val = row[h];
              if (val === null || val === undefined) return '';
              if (typeof val === 'object') return JSON.stringify(val).replace(/"/g, '""');
              return String(val).replace(/"/g, '""').replace(/\n/g, ' ');
            })
            .map((v) => `"${v}"`)
            .join(',')
        ),
      ];

      const csv = csvRows.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

      await logActivity('export', type, null, `Exported ${rows.length} records`);

      return new Response(blob, {
        headers: {
          'Content-Type': 'text/csv;charset=utf-8;',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    return new Response(JSON.stringify({ ok: false, error: 'Unsupported format' }), { status: 400 });
  } catch (error: unknown) {
    const message = (() => {
      if (error instanceof Error) return error.message;
      if (typeof error === 'string') return error;
      try {
        return JSON.stringify(error);
      } catch {
        return 'failed';
      }
    })();
    return new Response(JSON.stringify({ ok: false, error: message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};
