import type { APIRoute } from 'astro';
import { getTursoClient, ensureTemplatesTables } from '../../../lib/turso';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'email';

    // Defaults to avoid empty UI and prevent 500s when DB is not configured yet
    const nowIso = new Date().toISOString();
    const defaultWhatsapp = [
      { key: 'pending', text: 'Hello {name}, your appointment request for {service} is received and pending confirmation. We will contact you shortly. – JyotirSetu', updated_at: nowIso },
      { key: 'confirmed', text: 'Hello {name}, your appointment for {service} is CONFIRMED. Date/Time: {date} {time}. – JyotirSetu', updated_at: nowIso },
      { key: 'rescheduled', text: 'Hello {name}, your appointment for {service} has been RESCHEDULED. New Date/Time: {date} {time}. – JyotirSetu', updated_at: nowIso },
      { key: 'cancelled', text: 'Hello {name}, your appointment for {service} has been CANCELLED. Reply here to book a new slot. – JyotirSetu', updated_at: nowIso },
    ];
    const defaultEmail = [
      { key: 'pending', subject: 'We received your appointment request', html: '<p>Dear {name}, your appointment for {service} is pending. We will confirm soon.</p>', updated_at: nowIso },
      { key: 'confirmed', subject: 'Your appointment is confirmed', html: '<p>Dear {name}, your appointment for {service} is confirmed on {date} at {time} ({method}).</p>', updated_at: nowIso },
      { key: 'rescheduled', subject: 'Your appointment was rescheduled', html: '<p>Dear {name}, your appointment for {service} has been rescheduled to {date} at {time} ({method}).</p>', updated_at: nowIso },
      { key: 'cancelled', subject: 'Your appointment was cancelled', html: '<p>Dear {name}, your appointment for {service} has been cancelled. Reply to book a new slot.</p>', updated_at: nowIso },
    ];

    try {
      await ensureTemplatesTables();
      const client = await getTursoClient();
      if (type === 'whatsapp') {
        const res = await client.execute({ sql: `SELECT key, text, updated_at FROM whatsapp_templates`, args: [] });
        const rows = Array.isArray(res.rows) ? res.rows : [];
        return new Response(JSON.stringify({ ok: true, data: rows.length ? rows : defaultWhatsapp }), { headers: { 'Content-Type': 'application/json' } });
      }
      const res = await client.execute({ sql: `SELECT key, subject, html, updated_at FROM email_templates`, args: [] });
      const rows = Array.isArray(res.rows) ? res.rows : [];
      return new Response(JSON.stringify({ ok: true, data: rows.length ? rows : defaultEmail }), { headers: { 'Content-Type': 'application/json' } });
    } catch {
      // DB not configured; return defaults without failing
      return new Response(
        JSON.stringify({ ok: true, data: type === 'whatsapp' ? defaultWhatsapp : defaultEmail, note: 'using-defaults' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || 'failed' }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    await ensureTemplatesTables();
    const body = await request.json();
    const now = new Date().toISOString();
    const client = await getTursoClient();
    if (body.type === 'whatsapp') {
      const { key, text } = body;
      if (!key || !text) return new Response(JSON.stringify({ ok: false, error: 'key and text required' }), { status: 400 });
      await client.execute({ sql: `INSERT INTO whatsapp_templates (key, text, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET text = excluded.text, updated_at = excluded.updated_at`, args: [String(key), String(text), now] });
      return new Response(JSON.stringify({ ok: true }));
    }
    const { key, subject, html } = body;
    if (!key || !subject || !html) return new Response(JSON.stringify({ ok: false, error: 'key, subject, html required' }), { status: 400 });
    await client.execute({ sql: `INSERT INTO email_templates (key, subject, html, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET subject = excluded.subject, html = excluded.html, updated_at = excluded.updated_at`, args: [String(key), String(subject), String(html), now] });
    return new Response(JSON.stringify({ ok: true }));
  } catch (e: any) {
    const msg = e?.message || 'failed';
    const isConfig = /Turso configuration missing/i.test(String(msg));
    return new Response(
      JSON.stringify({ ok: false, error: isConfig ? 'Database not configured. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.' : msg }),
      { status: isConfig ? 503 : 500 }
    );
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    await ensureTemplatesTables();
    const body = await request.json();
    const client = await getTursoClient();
    if (body.type === 'whatsapp') {
      const { key } = body;
      if (!key) return new Response(JSON.stringify({ ok: false, error: 'key required' }), { status: 400 });
      await client.execute({ sql: `DELETE FROM whatsapp_templates WHERE key = ?`, args: [String(key)] });
      return new Response(JSON.stringify({ ok: true }));
    }
    const { key } = body;
    if (!key) return new Response(JSON.stringify({ ok: false, error: 'key required' }), { status: 400 });
    await client.execute({ sql: `DELETE FROM email_templates WHERE key = ?`, args: [String(key)] });
    return new Response(JSON.stringify({ ok: true }));
  } catch (e: any) {
    const msg = e?.message || 'failed';
    const isConfig = /Turso configuration missing/i.test(String(msg));
    return new Response(
      JSON.stringify({ ok: false, error: isConfig ? 'Database not configured. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.' : msg }),
      { status: isConfig ? 503 : 500 }
    );
  }
};


