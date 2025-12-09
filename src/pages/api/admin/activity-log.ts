import type { APIRoute } from 'astro';
import { getActivityLog } from '../../../lib/activity-logger';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '100', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const action = url.searchParams.get('action') || undefined;
    const entityType = url.searchParams.get('entity_type') || undefined;

    const { data, total } = await getActivityLog(page, limit, action, entityType);

    return new Response(JSON.stringify({ ok: true, data, pagination: { page, limit, total } }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};
