import type { APIRoute } from 'astro';
import { getTursoClient, ensureAppointmentsTable } from '../../../lib/turso';
import { emailService } from '../../../lib/email-service';
import { logActivity } from '../../../lib/activity-logger';
import { logEmail } from '../../../lib/email-tracker';

export const prerender = false;

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  consultation_method: string;
  status: string;
  message: string | null;
  service_details: string | null;
  source: string;
  created_at: string;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureAppointmentsTable();
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;
    
    const client = await getTursoClient();
    const [dataRes, countRes] = await Promise.all([
      client.execute({
        sql: `SELECT id, name, email, phone, service, date, time, consultation_method, status, message, service_details, source, created_at
              FROM appointments ORDER BY datetime(created_at) DESC LIMIT ? OFFSET ?`,
        args: [limit, offset]
      }),
      client.execute({
        sql: `SELECT COUNT(*) as total FROM appointments`,
        args: []
      })
    ]);
    
    const rows = (dataRes.rows as unknown as Appointment[]).map(r => ({
      ...r,
      service_details: r.service_details ? JSON.parse(r.service_details) : null,
      source: r.source || 'system',
    }));
    const totalRow = (countRes.rows?.[0] as unknown) as { total?: number | string };
    const total = Number(totalRow?.total ?? 0);
    
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
    const body = (await request.json()) as unknown;
    const { id, status } = (body as { id?: string; status?: string }) || {};
    if (!id || !status) return new Response(JSON.stringify({ ok: false, error: 'id and status required' }), { status: 400 });
    await ensureAppointmentsTable();
    const client = await getTursoClient();
    const oldRes = await client.execute({ sql: `SELECT name, email, status FROM appointments WHERE id = ?`, args: [String(id)] });
    const oldRow = (oldRes.rows?.[0] as unknown as { name: string, email: string, status: string }) || { name: '', email: '', status: '' };
    const oldStatus = oldRow.status;
    
    await client.execute({ sql: `UPDATE appointments SET status = ? WHERE id = ?`, args: [String(status), String(id)] });
    
    await logActivity('status_updated', 'appointment', id, `Status changed from ${oldStatus} to ${status} for ${oldRow.name} (${oldRow.email})`);
    
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed' }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as unknown;
    const req = (body as {
      action?: string;
      id?: string;
      status?: string;
      name?: string;
      email?: string;
      phone?: string;
      service?: string;
      date?: string;
      time?: string;
      consultation_method?: string;
      message?: string | null;
    }) || {};
    const { action, id, status } = req;
    
    // Handle email sending
    if (action === 'email' && id && status) {
      await ensureAppointmentsTable();
      const client = await getTursoClient();
      const res = await client.execute({ sql: `SELECT * FROM appointments WHERE id = ? LIMIT 1`, args: [String(id)] });
      const row = res.rows?.[0] as unknown as Appointment;
      if (!row) return new Response(JSON.stringify({ ok: false, error: 'not found' }), { status: 404 });
      const ok = await emailService.sendAppointmentStatusEmail({
        name: row.name, email: row.email, phone: row.phone, service: row.service, date: row.date, time: row.time, consultation_method: row.consultation_method,
      }, String(status));
      
      await logEmail(
        row.email,
        row.name,
        `Appointment ${status}`,
        'appointment_status',
        id,
        'appointment',
        ok ? 'sent' : 'failed',
        ok ? null : 'Email service error'
      );
      
      await logActivity('email_sent', 'appointment', id, `Email sent to ${row.name} (${row.email}): ${status}`);
      
      return new Response(JSON.stringify({ ok }), { headers: { 'Content-Type': 'application/json' } });
    }
    
    // Handle creating new appointment
    if (action === 'create') {
      const { name, email, phone, service, date, time, consultation_method, message, status: newStatus } = req;
      if (!name || !email || !phone || !service || !date || !time || !consultation_method) {
        return new Response(JSON.stringify({ ok: false, error: 'Missing required fields' }), { status: 400 });
      }
      
      await ensureAppointmentsTable();
      const client = await getTursoClient();
      const appointmentId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const createdAt = new Date().toISOString();
      
      await client.execute({
        sql: `INSERT INTO appointments (id, name, email, phone, service, date, time, consultation_method, status, message, source, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          appointmentId,
          String(name),
          String(email),
          String(phone),
          String(service),
          String(date),
          String(time),
          String(consultation_method),
          String(newStatus || 'pending'),
          message ? String(message) : null,
          'manual',
          createdAt
        ]
      });
      
      await logActivity('appointment_created', 'appointment', appointmentId, `Manual appointment created for ${name}`);
      
      return new Response(JSON.stringify({ ok: true, id: appointmentId }), { headers: { 'Content-Type': 'application/json' } });
    }
    
    return new Response(JSON.stringify({ ok: false, error: 'invalid request' }), { status: 400 });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed' }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};


