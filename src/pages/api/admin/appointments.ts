import type { APIRoute } from 'astro';
import { getTursoClient, ensureAppointmentsTable, ensureEmailHistoryTable } from '../../../lib/turso';
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
  customer_appointment_id?: string | null;
  created_at: string;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureAppointmentsTable();
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    
    const client = await getTursoClient();
    const filters: string[] = [];
    const argsBase: (string | number | boolean | bigint | null)[] = [];
    // Filter by appointment date rather than created_at for a more intuitive range
    // When a plain YYYY-MM-DD is provided, use SQLite's date() for proper comparison
    // When a full timestamp is provided, fallback to string comparison on the `date` column
    if (from) {
      if (from.length === 10) { filters.push(`date(date) >= date(?)`); }
      else { filters.push(`date >= ?`); }
      argsBase.push(from);
    }
    if (to) {
      if (to.length === 10) { filters.push(`date(date) <= date(?)`); }
      else { filters.push(`date <= ?`); }
      argsBase.push(to);
    }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const [dataRes, countRes] = await Promise.all([
      client.execute({
        sql: `SELECT id, name, email, phone, service, date, time, consultation_method, status, message, service_details, source, customer_appointment_id, created_at
              FROM appointments ${where} ORDER BY datetime(created_at) DESC LIMIT ? OFFSET ?`,
        args: [...argsBase, limit, offset]
      }),
      client.execute({
        sql: `SELECT COUNT(*) as total FROM appointments ${where}`,
        args: argsBase
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

    // Handle deletion by internal id or customer-facing Appointment ID
    if (action === 'delete') {
      const public_id = (req as { public_id?: string }).public_id;
      if (!id && !public_id) {
        return new Response(JSON.stringify({ ok: false, error: 'Provide id or public_id' }), { status: 400 });
      }

      await ensureAppointmentsTable();
      const client = await getTursoClient();

      let targetId: string | null = id ? String(id) : null;
      if (!targetId && public_id) {
        const findRes = await client.execute({
          sql: `SELECT id FROM appointments WHERE customer_appointment_id = ? LIMIT 1`,
          args: [String(public_id)]
        });
        const row0 = Array.isArray(findRes.rows) ? (findRes.rows[0] as Record<string, unknown>) : undefined;
        const idField = row0 ? row0.id : undefined;
        targetId = typeof idField === 'string' ? idField : (idField != null ? String(idField) : null);
      }

      if (!targetId) {
        return new Response(JSON.stringify({ ok: false, error: 'Appointment not found' }), { status: 404 });
      }

      await client.execute({ sql: `DELETE FROM appointments WHERE id = ?`, args: [targetId] });
      await logActivity('appointment_deleted', 'appointment', targetId, `Deleted appointment ${targetId}`);
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    
    // Handle email sending
    if (action === 'email' && id && status) {
      await ensureAppointmentsTable();
      const client = await getTursoClient();
      const res = await client.execute({ sql: `SELECT * FROM appointments WHERE id = ? LIMIT 1`, args: [String(id)] });
      const row = res.rows?.[0] as unknown as Appointment;
      if (!row) return new Response(JSON.stringify({ ok: false, error: 'not found' }), { status: 404 });

      // Ensure we have a customer-facing appointment ID; if missing, generate and persist
      const makePublicId = (dateStr: string): string => {
        try {
          const yyyymmdd = String(dateStr || '').replace(/-/g, '');
          const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          return `${yyyymmdd}${rand}`;
        } catch { return `${Date.now()}`; }
      };
      let publicId = row.customer_appointment_id || null;
      if (!publicId) {
        publicId = makePublicId(row.date);
        try {
          await client.execute({ sql: `UPDATE appointments SET customer_appointment_id = ? WHERE id = ?`, args: [publicId, String(id)] });
        } catch { /* ignore update errors */ }
      }

      const { template_key, reason, new_date, new_time, subject, html } = (req as {
        template_key?: string;
        reason?: string;
        new_date?: string;
        new_time?: string;
        subject?: string;
        html?: string;
      });
      let subjectUsed = String(subject || `Appointment ${status}`);

      // Duplicate suppression: if a recent email was sent for this appointment, skip sending
      try {
        await ensureEmailHistoryTable();
        const dupRes = await client.execute({
          sql: `SELECT sent_at FROM email_history WHERE related_id = ? AND related_type = 'appointment' AND type = 'appointment_status' AND status = 'sent' ORDER BY datetime(sent_at) DESC LIMIT 1`,
          args: [String(id)]
        });
        const last = dupRes.rows?.[0] as unknown as { sent_at?: string } | undefined;
        const lastSentAt = last?.sent_at ? new Date(String(last.sent_at)).getTime() : 0;
        const now = Date.now();
        const recentWindowMs = 8000; // 8 seconds window
        if (lastSentAt && (now - lastSentAt) < recentWindowMs) {
          await logActivity('email_duplicate_suppressed', 'appointment', id, `Duplicate email suppressed for ${row.name} (${row.email})`);
          return new Response(JSON.stringify({ ok: true, duplicate: true }), { headers: { 'Content-Type': 'application/json' } });
        }
      } catch {
        // If suppression check fails, proceed with sending
      }
      let ok = false;
      if (html) {
        ok = await emailService.sendAppointmentCustomEmail({
          name: row.name, email: row.email, phone: row.phone, service: row.service, date: row.date, time: row.time, consultation_method: row.consultation_method,
          public_id: publicId || undefined,
        }, subjectUsed, String(html), { reason: String(reason || ''), new_date: String(new_date || row.date || ''), new_time: String(new_time || row.time || '') });
      } else if (template_key) {
        ok = await emailService.sendAppointmentTemplateEmail({
          name: row.name, email: row.email, phone: row.phone, service: row.service, date: row.date, time: row.time, consultation_method: row.consultation_method,
          public_id: publicId || undefined,
        }, String(template_key), { reason: String(reason || ''), new_date: String(new_date || row.date || ''), new_time: String(new_time || row.time || '') });
        subjectUsed = subjectUsed || String(template_key);
      } else {
        ok = await emailService.sendAppointmentStatusEmail({
          name: row.name, email: row.email, phone: row.phone, service: row.service, date: row.date, time: row.time, consultation_method: row.consultation_method,
          public_id: publicId || undefined,
        }, String(status));
      }
      
      await logEmail(
        row.email,
        row.name,
        subjectUsed,
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
      const makePublicId = (dateStr: string): string => {
        try {
          const yyyymmdd = String(dateStr || '').replace(/-/g, '');
          const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          return `${yyyymmdd}${rand}`;
        } catch { return `${Date.now()}`; }
      };
      const createdAt = new Date().toISOString();
      const publicId = makePublicId(String(date));
      
      await client.execute({
        sql: `INSERT INTO appointments (id, name, email, phone, service, date, time, consultation_method, status, message, source, customer_appointment_id, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          publicId,
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


