import type { APIRoute } from 'astro';
import { logWhatsapp, getWhatsappHistory } from '../../../lib/whatsapp-tracker';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const relatedId = url.searchParams.get('related_id') || undefined;
    const relatedType = url.searchParams.get('related_type') || undefined;
    const limitStr = url.searchParams.get('limit');
    const limit = limitStr ? Math.max(1, Math.min(500, parseInt(limitStr, 10))) : 100;
    const data = await getWhatsappHistory(relatedId, relatedType, limit);
    return new Response(JSON.stringify({ ok: true, data }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const recipient_phone = String(body?.recipient_phone || '').trim();
    const message = String(body?.message || '').trim();
    const type = String(body?.type || 'manual').trim();
    const related_id = body?.related_id ? String(body.related_id) : null;
    const related_type = body?.related_type ? String(body.related_type) : null;
    const status = String(body?.status || 'sent');
    const recipient_name = body?.recipient_name ? String(body.recipient_name) : null;
    if (!recipient_phone || !message) {
      return new Response(JSON.stringify({ ok: false, error: 'recipient_phone and message required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const id = await logWhatsapp(
      recipient_phone,
      message,
      type,
      related_id,
      related_type,
      status,
      null,
      recipient_name
    );
    return new Response(JSON.stringify({ ok: true, id }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};
