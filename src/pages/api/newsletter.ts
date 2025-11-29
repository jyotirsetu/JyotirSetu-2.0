import type { APIRoute } from 'astro';
import { getTursoClient, ensureNewsletterSubscribersTable } from '../../lib/turso';
import { emailService } from '../../lib/email-service';
import { logActivity } from '../../lib/activity-logger';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    await ensureNewsletterSubscribersTable();
    const contentType = (request.headers.get('content-type') || '').toLowerCase();
    let name = '';
    let email = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      name = String(body.name || '').trim();
      email = String(body.email || '').trim();
    } else {
      const formData = await request.formData();
      name = String(formData.get('name') || '').trim();
      email = String(formData.get('email') || '').trim();
    }

    if (!email) {
      return new Response(JSON.stringify({ ok: false, error: 'email_required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await getTursoClient();
    const now = new Date().toISOString();
    await client.execute({
      sql: `INSERT INTO newsletter_subscribers (id, name, email, status, subscribed_at)
            VALUES (lower(hex(randomblob(16))), ?, ?, 'pending', ?)`,
      args: [name || null, email, now],
    });

    // Send welcome email
    await emailService.sendNewsletterWelcomeEmail({ name, email }).catch(() => false);

    await logActivity('newsletter_subscribed', 'newsletter', email, `Subscribed: ${name || 'Unknown'} <${email}>`);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
