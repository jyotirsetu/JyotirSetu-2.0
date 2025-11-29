import type { APIRoute } from 'astro';
import { logActivity } from '../../../lib/activity-logger';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, entity_type, entity_id, details, user } = body || {};
    if (!action || !entity_type) {
      return new Response(JSON.stringify({ ok: false, error: 'action and entity_type required' }), { status: 400 });
    }
    await logActivity(
      String(action),
      String(entity_type),
      entity_id ? String(entity_id) : null,
      details ? String(details) : undefined,
      user ? String(user) : 'admin'
    );
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ ok: false, error: error.message || 'failed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};
