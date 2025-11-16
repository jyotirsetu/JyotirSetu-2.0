import type { APIRoute } from 'astro';
import { getTursoClient, ensureFollowHubSettingsTable } from '../../../../lib/turso';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    await ensureFollowHubSettingsTable();
    const client = await getTursoClient();
    const res = await client.execute({ sql: `SELECT value FROM follow_hub_settings WHERE key='cta_variant' LIMIT 1`, args: [] });
    const row = (res.rows?.[0] ?? {}) as Record<string, unknown>;
    const value = typeof row.value === 'string' ? row.value : 'A';
    return new Response(JSON.stringify({ ok: true, value }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { value } = await request.json();
    const v = String(value || 'A').toUpperCase();
    if (!['A','B'].includes(v)) {
      return new Response(JSON.stringify({ ok: false, error: 'invalid_variant' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    await ensureFollowHubSettingsTable();
    const client = await getTursoClient();
    const now = new Date().toISOString();
    await client.execute({ sql: `INSERT INTO follow_hub_settings (key, value, updated_at) VALUES ('cta_variant', ?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at`, args: [v, now] });
    return new Response(JSON.stringify({ ok: true, value: v }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};