import type { APIRoute } from 'astro';
import { getTursoClient, ensureFollowHubSettingsTable } from '../../../lib/turso';

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