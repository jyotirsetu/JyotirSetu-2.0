import type { APIRoute } from 'astro';
import { getEmailHistory } from '../../../lib/email-tracker';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const relatedId = url.searchParams.get('related_id');
    const relatedType = url.searchParams.get('related_type');
    const limit = parseInt(url.searchParams.get('limit') || '100', 10);
    
    const history = await getEmailHistory(relatedId || undefined, relatedType || undefined, limit);
    
    return new Response(JSON.stringify({ ok: true, data: history }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || 'failed' }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};


