import type { APIRoute } from 'astro';
import { EmailService } from '../../../lib/email-service';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email || '').trim();
    const name = String(body?.name || '').trim() || 'Friend';
    const share_link = String(body?.share_link || '').trim();
    const template_key = String(body?.template_key || 'remedies_share_email');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: 'invalid_email' }), { status: 400 });
    }
    if (!share_link) {
      return new Response(JSON.stringify({ ok: false, error: 'missing_share_link' }), { status: 400 });
    }

    // Derive token from share_link
    let token = '';
    try { const u = new URL(share_link); const parts = u.pathname.split('/').filter(Boolean); token = parts.pop() || ''; } catch { /* ignore */ }
    // Fetch PDF
    let pdfData: Uint8Array | null = null;
    if (token) {
      try {
        const pdfRes = await fetch(new URL('/api/admin/remedies/pdf?token=' + encodeURIComponent(token), request.url).toString());
        if (pdfRes.ok) {
          const buf = new Uint8Array(await pdfRes.arrayBuffer());
          pdfData = buf;
        }
      } catch { /* ignore */ }
    }

    const svc = new EmailService();
    const subject = 'Your Personalized Remedies – JyotirSetu';
    const innerHtml = [
      `<p>Dear ${name || 'Friend'},</p>`,
      `<p>Your personalized remedies report is ready.</p>`,
      `<p><a href="${share_link}" target="_blank">Open Remedies Report</a></p>`,
      `<p>Please find the PDF attached for your convenience.</p>`,
      `<p>Warm regards,<br/>JyotirSetu Astrology</p>`
    ].join('');

    let ok = false;
    if (pdfData) {
      ok = await svc.sendGenericWithAttachment(email, subject, innerHtml, `JyotirSetu_Remedies_${token}.pdf`, pdfData);
    } else {
      ok = await svc.sendGenericHtml(email, subject, svc['wrapBranded'] ? (svc as any)['wrapBranded'](subject, innerHtml) : innerHtml);
    }

    return new Response(JSON.stringify({ ok }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};
