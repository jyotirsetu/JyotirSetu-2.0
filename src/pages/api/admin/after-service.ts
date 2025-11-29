import type { APIRoute } from 'astro';
import { emailService } from '../../../lib/email-service';
import { logEmail } from '../../../lib/email-tracker';
import { logWhatsapp } from '../../../lib/whatsapp-tracker';
import { ensureEmailHistoryTable } from '../../../lib/turso';
import { logActivity } from '../../../lib/activity-logger';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { isValidCsrf } = await import('../../../lib/csrf');
    if (!isValidCsrf(request)) {
      return new Response(JSON.stringify({ ok: false, error: 'csrf_failed' }), { status: 403 });
    }
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'email';
    const body = await request.json();

    if (action === 'log_whatsapp') {
      const phone = String(body.phone || '').trim();
      const name = body.name != null ? String(body.name) : null;
      const message = String(body.message || '').trim();
      const related_id = body.related_id != null ? String(body.related_id) : null;
      if (!phone || !message) {
        return new Response(JSON.stringify({ ok: false, error: 'phone and message required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const id = await logWhatsapp(
        phone,
        message,
        'feedback_request',
        related_id || null,
        related_id ? 'appointment' : null,
        'sent',
        null,
        name
      );
      await logActivity(
        'whatsapp_sent',
        related_id ? 'appointment' : 'feedback',
        related_id || null,
        `Feedback WhatsApp to ${name || ''} (${phone})`
      );
      return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
    }

    const to = String(body.to || '').trim();
    const name = body.name != null ? String(body.name) : null;
    const subject = String(body.subject || '').trim() || 'We’d love your feedback';
    const html = String(body.html || '').trim();
    const related_id = body.related_id != null ? String(body.related_id) : null;
    if (!to || !html) {
      return new Response(JSON.stringify({ ok: false, error: 'to and html required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let ok = false;
    try {
      ok = await emailService.sendGenericHtml(to, subject, html);
    } catch {
      ok = false;
    }

    await ensureEmailHistoryTable();
    await logEmail(
      to,
      name,
      subject,
      'feedback_request',
      related_id || null,
      related_id ? 'appointment' : null,
      ok ? 'sent' : 'failed',
      ok ? null : 'Email service error'
    );
    await logActivity(
      ok ? 'email_sent' : 'email_failed',
      related_id ? 'appointment' : 'feedback',
      related_id || null,
      `${ok ? 'Feedback email sent' : 'Feedback email failed'} to ${name || ''} (${to})`
    );

    return new Response(JSON.stringify({ ok }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
