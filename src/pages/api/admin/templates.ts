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
      {
        key: 'pending',
        text: [
          'Dear {name},',
          '',
          '🙏 Thank you for choosing JyotirSetu Astrology. We have received your appointment request for {service}.',
          '',
          '🕐 Your appointment is currently pending. We will confirm your slot based on availability and inform you shortly.',
          '',
          '📋 Appointment Details:',
          '• 🆔 Appointment ID: {appointment_id}',
          '• 📆 Date: {date}',
          '• ⏰ Time: {time}',
          '• 🧭 Consultation Method: {method}',
          '',
          '🔗 Stay connected for insights and updates: https://follow.jyotirsetu.com',
          '',
          'Warm regards,',
          'JyotirSetu Astrology'
        ].join('\n'),
        updated_at: nowIso
      },
      {
        key: 'confirmed',
        text: [
          'Dear {name},',
          '',
          '✅ Your appointment for {service} is confirmed on {date} at {time} ({method}).',
          '',
          '📝 To prepare and provide accurate guidance, please share your horoscope details in reply:',
          '• Birth Date',
          '• Birth Time',
          '• Birth Place',
          '• Gender',
          '',
          '🆔 Appointment ID: {appointment_id}',
          '',
          '💬 Feel free to include any specific questions you want us to focus on.',
          '',
          '🔗 Follow for tips and updates: https://follow.jyotirsetu.com',
          '',
          'Looking forward to connecting,',
          'JyotirSetu Astrology'
        ].join('\n'),
        updated_at: nowIso
      },
      {
        key: 'rescheduled',
        text: [
          'Dear {name},',
          '',
          '🔁 Your appointment for {service} has been rescheduled to {date} at {time} ({method}).',
          '',
          '📝 To prepare and provide accurate guidance, please share your horoscope details in reply:',
          '• Birth Date',
          '• Birth Time',
          '• Birth Place',
          '• Gender',
          '',
          '🆔 Appointment ID: {appointment_id}',
          '',
          '🔗 Follow for tips and updates: https://follow.jyotirsetu.com',
          '',
          'Warm regards,',
          'JyotirSetu Astrology'
        ].join('\n'),
        updated_at: nowIso
      },
      {
        key: 'cancelled_user',
        text: [
          'Dear {name},',
          '',
          '❌ As per your request, your appointment for {service} has been cancelled.',
          '',
          '🆔 Appointment ID: {appointment_id}',
          '',
          'We look forward to connecting with you again. Feel free to reply to this message to book a new slot at your convenience.',
          '',
          '🔗 Explore updates and insights: https://follow.jyotirsetu.com',
          '',
          'Warm regards,',
          'JyotirSetu Astrology'
        ].join('\n'),
        updated_at: nowIso
      },
      {
        key: 'cancelled_provider',
        text: [
          'Dear {name},',
          '',
          '⚠️ We sincerely apologize — your appointment for {service} has been cancelled due to unforeseen circumstances.',
          '',
          '🆔 Appointment ID: {appointment_id}',
          '',
          'We value your time and will reach out shortly to offer alternate slots. If you prefer, please reply with your availability.',
          '',
          'Thank you for your understanding.',
          '',
          '🔗 Stay connected: https://follow.jyotirsetu.com',
          '',
          'Warm regards,',
          'JyotirSetu Astrology'
        ].join('\n'),
        updated_at: nowIso
      }
    ];
    const defaultEmail = [
      {
        key: 'pending',
        subject: 'We received your appointment request – JyotirSetu Astrology',
        html: [
          '<p>Dear {name},</p>',
          '<p>Thank you for choosing JyotirSetu Astrology. We have received your appointment request for <strong>{service}</strong>.</p>',
          '<p>Your appointment is currently <strong>pending</strong>. We will confirm your slot based on availability and inform you shortly.</p>',
          '<p>Appointment Details:</p>',
          '<ul>',
          '<li>Date: {date}</li>',
          '<li>Time: {time}</li>',
          '<li>Consultation Method: {method}</li>',
          '</ul>',
          '<p>Stay connected for insights and updates: <a href="https://follow.jyotirsetu.com" target="_blank">follow.jyotirsetu.com</a></p>',
          '<p>Warm regards,<br/>JyotirSetu Astrology</p>'
        ].join(''),
        updated_at: nowIso
      },
      {
        key: 'confirmed',
        subject: 'Your appointment is confirmed – JyotirSetu Astrology',
        html: [
          '<p>Dear {name},</p>',
          '<p>Your appointment for <strong>{service}</strong> is <strong>confirmed</strong> on <strong>{date}</strong> at <strong>{time}</strong> ({method}).</p>',
          '<p>To prepare and provide accurate guidance, please share your horoscope details in reply:</p>',
          '<ul>',
          '<li>Birth Date</li>',
          '<li>Birth Time</li>',
          '<li>Birth Place</li>',
          '<li>Gender</li>',
          '</ul>',
          '<p>Feel free to include any specific questions you want us to focus on.</p>',
          '<p>Follow for tips and updates: <a href="https://follow.jyotirsetu.com" target="_blank">follow.jyotirsetu.com</a></p>',
          '<p>Looking forward to connecting,<br/>JyotirSetu Astrology</p>'
        ].join(''),
        updated_at: nowIso
      },
      {
        key: 'rescheduled',
        subject: 'Your appointment has been rescheduled – JyotirSetu Astrology',
        html: [
          '<p>Dear {name},</p>',
          '<p>Your appointment for <strong>{service}</strong> has been <strong>rescheduled</strong>.</p>',
          '<p>Reason: {reason}</p>',
          '<p>New Appointment Details:</p>',
          '<ul>',
          '<li>Date: {new_date}</li>',
          '<li>Time: {new_time}</li>',
          '<li>Consultation Method: {method}</li>',
          '</ul>',
          '<p>If the new schedule does not work for you, please reply with your availability.</p>',
          '<p>Stay connected: <a href="https://follow.jyotirsetu.com" target="_blank">follow.jyotirsetu.com</a></p>',
          '<p>Warm regards,<br/>JyotirSetu Astrology</p>'
        ].join(''),
        updated_at: nowIso
      },
      {
        key: 'cancelled_user',
        subject: 'Your appointment has been cancelled as requested – JyotirSetu Astrology',
        html: [
          '<p>Dear {name},</p>',
          '<p>As per your request, your appointment for <strong>{service}</strong> has been <strong>cancelled</strong>.</p>',
          '<p>We look forward to connecting with you again. Feel free to reply to this email to book a new slot at your convenience.</p>',
          '<p>Explore updates and insights: <a href="https://follow.jyotirsetu.com" target="_blank">follow.jyotirsetu.com</a></p>',
          '<p>Warm regards,<br/>JyotirSetu Astrology</p>'
        ].join(''),
        updated_at: nowIso
      },
      {
        key: 'cancelled_provider',
        subject: 'Apologies — your appointment was cancelled due to unforeseen reasons',
        html: [
          '<p>Dear {name},</p>',
          '<p>We sincerely apologize — your appointment for <strong>{service}</strong> has been <strong>cancelled</strong> due to unforeseen circumstances.</p>',
          '<p>We value your time and will reach out shortly to offer alternate slots. If you prefer, please reply with your availability.</p>',
          '<p>Thank you for your understanding.</p>',
          '<p>Stay connected: <a href="https://follow.jyotirsetu.com" target="_blank">follow.jyotirsetu.com</a></p>',
          '<p>Warm regards,<br/>JyotirSetu Astrology</p>'
        ].join(''),
        updated_at: nowIso
      }
    ];

    try {
      await ensureTemplatesTables();
      const client = await getTursoClient();
      if (type === 'whatsapp') {
        const res = await client.execute({ sql: `SELECT key, text, updated_at FROM whatsapp_templates`, args: [] });
        const rows = Array.isArray(res.rows) ? res.rows : [];
        // If DB is configured, do NOT auto-fill defaults when empty.
        // Return empty array so the UI reflects true DB state.
        return new Response(JSON.stringify({ ok: true, data: rows }), { headers: { 'Content-Type': 'application/json' } });
      }
      const res = await client.execute({ sql: `SELECT key, subject, html, updated_at FROM email_templates`, args: [] });
      const rows = Array.isArray(res.rows) ? res.rows : [];
      // If DB is configured, do NOT auto-fill defaults when empty.
      return new Response(JSON.stringify({ ok: true, data: rows }), { headers: { 'Content-Type': 'application/json' } });
    } catch {
      // DB not configured; return defaults without failing
      return new Response(
        JSON.stringify({ ok: true, data: type === 'whatsapp' ? defaultWhatsapp : defaultEmail, note: 'using-defaults' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
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
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'failed';
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
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'failed';
    const isConfig = /Turso configuration missing/i.test(String(msg));
    return new Response(
      JSON.stringify({ ok: false, error: isConfig ? 'Database not configured. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.' : msg }),
      { status: isConfig ? 503 : 500 }
    );
  }
};


