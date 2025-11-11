import type { APIRoute } from 'astro';
import { getTursoClient, ensureAppointmentsTable, ensureContactsTable, ensureNewsletterSubscribersTable } from '../../../lib/turso';
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
      .map(s => s.trim())
      .filter(Boolean);
    
    if (type !== 'appointments' && type !== 'contacts' && type !== 'newsletter') {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid type' }), { status: 400 });
    }
    
    const client = await getTursoClient();
    let rows: Array<Record<string, unknown>> = [];
    let filename = '';
    
    if (type === 'appointments') {
      await ensureAppointmentsTable();
      const filters: string[] = [];
      const args: (string | number | boolean | bigint | null)[] = [];
      if (from) {
        if (from.length === 10) { filters.push(`date(created_at) >= date(?)`); }
        else { filters.push(`created_at >= ?`); }
        args.push(from);
      }
      if (to) {
        if (to.length === 10) { filters.push(`date(created_at) <= date(?)`); }
        else { filters.push(`created_at <= ?`); }
        args.push(to);
      }
      const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
      const res = await client.execute({
        sql: `SELECT customer_appointment_id, name, email, phone, service, date, time, consultation_method, status, message, source, created_at
              FROM appointments ${where} ORDER BY datetime(created_at) DESC`,
        args
      });
      // Map to a clean CSV shape with human-friendly Appt ID first
      const fullRows = (res.rows as Array<Record<string, unknown>>).map((row) => ({
        appt_id: row.customer_appointment_id ?? '',
        name: row.name ?? '',
        email: row.email ?? '',
        phone: row.phone ?? '',
        service: row.service ?? '',
        date: row.date ?? '',
        time: row.time ?? '',
        consultation_method: row.consultation_method ?? '',
        status: row.status ?? '',
        message: row.message ?? '',
        source: row.source ?? '',
        created_at: row.created_at ?? ''
      }));
      const allowed = ['appt_id','name','email','phone','service','date','time','consultation_method','status','message','source','created_at'];
      const fields = selectedFields.length ? selectedFields.filter(f => allowed.includes(f)) : allowed;
      rows = fullRows.map(r => {
        const o: Record<string, unknown> = {};
        for (const k of fields) o[k] = r[k as keyof typeof r];
        return o;
      });
      filename = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (type === 'contacts') {
      await ensureContactsTable();
      const filters: string[] = [];
      const args: (string | number | boolean | bigint | null)[] = [];
      if (from) {
        if (from.length === 10) { filters.push(`date(created_at) >= date(?)`); }
        else { filters.push(`created_at >= ?`); }
        args.push(from);
      }
      if (to) {
        if (to.length === 10) { filters.push(`date(created_at) <= date(?)`); }
        else { filters.push(`created_at <= ?`); }
        args.push(to);
      }
      const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
      const res = await client.execute({
        sql: `SELECT id, name, email, phone, subject, message, status, priority, created_at
              FROM contacts ${where} ORDER BY datetime(created_at) DESC`,
        args
      });
      const fullRows = res.rows as Array<Record<string, unknown>>;
      const allowed = ['id','name','email','phone','subject','message','status','priority','created_at'];
      const fields = selectedFields.length ? selectedFields.filter(f => allowed.includes(f)) : allowed;
      rows = fullRows.map(row => {
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
        if (from.length === 10) { filters.push(`date(subscribed_at) >= date(?)`); }
        else { filters.push(`subscribed_at >= ?`); }
        args.push(from);
      }
      if (to) {
        if (to.length === 10) { filters.push(`date(subscribed_at) <= date(?)`); }
        else { filters.push(`subscribed_at <= ?`); }
        args.push(to);
      }
      const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
      const res = await client.execute({
        sql: `SELECT id, name, email, status, subscribed_at FROM newsletter_subscribers ${where} ORDER BY datetime(subscribed_at) DESC`,
        args
      });
      const fullRows = res.rows as Array<Record<string, unknown>>;
      const allowed = ['id','name','email','status','subscribed_at'];
      const fields = selectedFields.length ? selectedFields.filter(f => allowed.includes(f)) : allowed;
      rows = fullRows.map(row => {
        const o: Record<string, unknown> = {};
        for (const k of fields) o[k] = (row as Record<string, unknown>)[k];
        return o;
      });
      filename = `newsletter_${new Date().toISOString().split('T')[0]}.csv`;
    }
    
    if (format === 'csv') {
      // Generate CSV
      const headers = Object.keys(rows[0] || {});
      const csvRows = [
        headers.join(','),
        ...rows.map(row => headers.map(h => {
          const val = row[h];
          if (val === null || val === undefined) return '';
          if (typeof val === 'object') return JSON.stringify(val).replace(/"/g, '""');
          return String(val).replace(/"/g, '""').replace(/\n/g, ' ');
        }).map(v => `"${v}"`).join(','))
      ];
      
      const csv = csvRows.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      
      await logActivity('export', type, null, `Exported ${rows.length} records`);
      
      return new Response(blob, {
        headers: {
          'Content-Type': 'text/csv;charset=utf-8;',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    }
    
    return new Response(JSON.stringify({ ok: false, error: 'Unsupported format' }), { status: 400 });
  } catch (error: unknown) {
    const message = (() => {
      if (error instanceof Error) return error.message;
      if (typeof error === 'string') return error;
      try { return JSON.stringify(error); } catch { return 'failed'; }
    })();
    return new Response(JSON.stringify({ ok: false, error: message }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};


