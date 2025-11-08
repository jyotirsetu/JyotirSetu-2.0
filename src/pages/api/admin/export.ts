import type { APIRoute } from 'astro';
import { getTursoClient, ensureAppointmentsTable, ensureContactsTable } from '../../../lib/turso';
import { logActivity } from '../../../lib/activity-logger';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type'); // 'appointments' or 'contacts'
    const format = url.searchParams.get('format') || 'csv';
    
    if (type !== 'appointments' && type !== 'contacts') {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid type' }), { status: 400 });
    }
    
    const client = await getTursoClient();
    let rows: any[] = [];
    let filename = '';
    
    if (type === 'appointments') {
      await ensureAppointmentsTable();
      const res = await client.execute({
        sql: `SELECT id, name, email, phone, service, date, time, consultation_method, status, message, source, created_at
              FROM appointments ORDER BY datetime(created_at) DESC`,
        args: []
      });
      rows = res.rows.map((r: any) => ({
        ...r,
        service_details: r.service_details ? JSON.parse(r.service_details) : null,
      }));
      filename = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      await ensureContactsTable();
      const res = await client.execute({
        sql: `SELECT id, name, email, phone, subject, message, status, priority, created_at
              FROM contacts ORDER BY datetime(created_at) DESC`,
        args: []
      });
      rows = res.rows;
      filename = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
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
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || 'failed' }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};


