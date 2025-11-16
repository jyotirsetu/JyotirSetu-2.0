import type { APIRoute } from 'astro';
import { getTursoClient, ensureAppointmentsTable, ensureEmailHistoryTable, ensureTemplatesTables } from '../../../lib/turso';
import { emailService } from '../../../lib/email-service';
import { logWhatsapp } from '../../../lib/whatsapp-tracker';

export const prerender = false;

function isWithinNextHours(dateStr: string, timeStr: string, hours: number) {
  try {
    const dt = new Date(`${dateStr}T${timeStr || '00:00'}:00Z`);
    const now = new Date();
    const soon = new Date(now.getTime() + hours * 3600 * 1000);
    return dt > now && dt <= soon;
  } catch {
    return false;
  }
}

export const GET: APIRoute = async () => {
  try {
    await ensureAppointmentsTable();
    const client = await getTursoClient();
    const res = await client.execute({ sql: `SELECT id, name, email, phone, service, date, time, consultation_method, status FROM appointments WHERE status IN ('pending','confirmed') ORDER BY date ASC`, args: [] });
    const upcoming = (res.rows || []).filter((r: Record<string, unknown>) => isWithinNextHours(String(r['date']), String(r['time']), 24));
    return new Response(JSON.stringify({ ok: true, upcoming_count: upcoming.length, upcoming }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = (e && typeof e === 'object' && 'message' in e) ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await ensureAppointmentsTable();
    await ensureEmailHistoryTable();
    const client = await getTursoClient();
    const body = await request.json();
    const action = String((body && body.action) || 'send_upcoming');
    if (action === 'send_upcoming') {
      const res = await client.execute({ sql: `SELECT id, name, email, phone, service, date, time, consultation_method FROM appointments WHERE status IN ('pending','confirmed')`, args: [] });
      const rows = res.rows || [];
      let sent = 0;
      for (const row of rows as Array<Record<string, unknown>>) {
        const date = String(row.date || '');
        const time = String(row.time || '');
        if (!isWithinNextHours(date, time, 24)) continue;
        const ok = await emailService.sendAppointmentCustomEmail({
          name: String(row.name || ''),
          email: String(row.email || ''),
          phone: String(row.phone || ''),
          service: String(row.service || ''),
          date,
          time,
          consultation_method: String(row.consultation_method || 'call')
        }, 'Appointment Reminder – JyotirSetu', `<div class="card"><div class="section-title">Reminder</div><p>This is a friendly reminder for your upcoming ${String(row.service || 'consultation')} on <strong>${date}</strong> at <strong>${time}</strong>.</p><p>If you need to reschedule, reply to this email.</p></div>`);
        if (ok) sent++;
      }
      return new Response(JSON.stringify({ ok: true, sent }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'send_upcoming_whatsapp') {
      await ensureTemplatesTables();
      const tplRes = await client.execute({ sql: `SELECT key, text FROM whatsapp_templates`, args: [] });
      const templates = Object.fromEntries(((tplRes.rows || []) as Array<Record<string, unknown>>).map(r => [String(r.key||''), String(r.text||'')]));
      const res = await client.execute({ sql: `SELECT id, name, email, phone, service, date, time, consultation_method, status, customer_appointment_id FROM appointments WHERE status IN ('pending','confirmed')`, args: [] });
      const rows = res.rows || [];
      let queued = 0;
      for (const row of rows as Array<Record<string, unknown>>) {
        const date = String(row.date || '');
        const time = String(row.time || '');
        if (!isWithinNextHours(date, time, 24)) continue;
        const status = String(row.status || 'pending');
        const key = status;
        const base = templates[key] || `Hello {name}, your appointment for {service} is {status} on {date} at {time} ({method}). ID: {appointment_id}`;
        const text = base
          .replace(/\{name\}/g, String(row.name || ''))
          .replace(/\{service\}/g, String(row.service || ''))
          .replace(/\{status\}/g, status)
          .replace(/\{date\}/g, date)
          .replace(/\{time\}/g, time)
          .replace(/\{method\}/g, String(row.consultation_method || ''))
          .replace(/\{appointment_id\}/g, String(row.customer_appointment_id || row.id || ''));
        const phone = String(row.phone || '').replace(/\D/g, '');
        await logWhatsapp(phone, text, 'reminder', String(row.id || ''), 'appointment', 'scheduled', null, String(row.name || ''));
        queued++;
      }
      return new Response(JSON.stringify({ ok: true, queued }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'send_followups') {
      const res = await client.execute({ sql: `SELECT id, name, email, phone, service, date, time, consultation_method FROM appointments WHERE status = 'completed' ORDER BY datetime(created_at) DESC`, args: [] });
      const rows = res.rows || [];
      let sent = 0;
      for (const row of rows as Array<Record<string, unknown>>) {
        const ok = await emailService.sendAppointmentCustomEmail({
          name: String(row.name || ''),
          email: String(row.email || ''),
          phone: String(row.phone || ''),
          service: String(row.service || ''),
          date: String(row.date || ''),
          time: String(row.time || ''),
          consultation_method: String(row.consultation_method || 'call')
        }, 'Thank You – JyotirSetu', `<div class="card"><div class="section-title">Thank you</div><p>Thank you for your consultation. If you have any questions or would like remedies or further guidance, feel free to reply.</p></div>`);
        if (ok) sent++;
      }
      return new Response(JSON.stringify({ ok: true, sent }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (action === 'send_followups_whatsapp') {
      await ensureTemplatesTables();
      const tplRes = await client.execute({ sql: `SELECT key, text FROM whatsapp_templates`, args: [] });
      const templates = Object.fromEntries(((tplRes.rows || []) as Array<Record<string, unknown>>).map(r => [String(r.key||''), String(r.text||'')]));
      const res = await client.execute({ sql: `SELECT id, name, email, phone, service, date, time, consultation_method, customer_appointment_id FROM appointments WHERE status = 'completed' ORDER BY datetime(created_at) DESC`, args: [] });
      const rows = res.rows || [];
      let queued = 0;
      for (const row of rows as Array<Record<string, unknown>>) {
        const base = templates['completed'] || `Thank you {name} for your {service}. If you have further questions, reply anytime. ID: {appointment_id}`;
        const text = base
          .replace(/\{name\}/g, String(row.name || ''))
          .replace(/\{service\}/g, String(row.service || ''))
          .replace(/\{appointment_id\}/g, String(row.customer_appointment_id || row.id || ''))
          .replace(/\{date\}/g, String(row.date || ''))
          .replace(/\{time\}/g, String(row.time || ''))
          .replace(/\{method\}/g, String(row.consultation_method || ''));
        const phone = String(row.phone || '').replace(/\D/g, '');
        await logWhatsapp(phone, text, 'followup', String(row.id || ''), 'appointment', 'scheduled', null, String(row.name || ''));
        queued++;
      }
      return new Response(JSON.stringify({ ok: true, queued }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ ok: false, error: 'unknown_action' }), { status: 400 });
  } catch (e) {
    const msg = (e && typeof e === 'object' && 'message' in e) ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};