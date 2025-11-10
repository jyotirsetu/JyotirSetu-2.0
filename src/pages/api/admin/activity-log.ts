import type { APIRoute } from 'astro';
import { getActivityLog } from '../../../lib/activity-logger';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '100', 10);
    
    const log = await getActivityLog(limit);
    
    return new Response(JSON.stringify({ ok: true, data: log }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: msg }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};


