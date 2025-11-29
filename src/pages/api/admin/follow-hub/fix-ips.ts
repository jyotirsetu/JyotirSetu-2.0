import type { APIRoute } from 'astro';
import { getTursoClient, ensureFollowHubEventsTable } from '../../../../lib/turso';

export const prerender = false;

async function sanitizeIp(raw: string): Promise<string> {
  try {
    let s = String(raw || '').trim();
    if (!s) return '';
    const m6 = s.match(/^\[([^\]]+)\](?::\d+)?$/);
    if (m6) s = m6[1];
    const m4 = s.match(/^(\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?$/);
    if (m4) s = m4[1];
    const { isIP } = await import('node:net');
    return isIP(s) ? s : '';
  } catch {
    return '';
  }
}

async function resolve(ip: string): Promise<string> {
  if (!ip) return '';
  try {
    const r = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`);
    const j = await r.json();
    const city = String(j.city || '').trim();
    const region = String(j.region || j.region_code || '').trim();
    const country = String(j.country_name || j.country || '').trim();
    return [city, region, country].filter(Boolean).join(', ');
  } catch { return ''; }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    await ensureFollowHubEventsTable();
    const url = new URL(request.url);
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || '500'), 1), 2000);
    const client = await getTursoClient();
    const res = await client.execute({ sql: `SELECT id, ip_address FROM follow_hub_events LIMIT ?`, args: [limit] });
    let fixed = 0, invalid = 0;
    for (const r of (res.rows || []) as Array<Record<string, unknown>>) {
      const orig = String(r.ip_address || '').trim();
      const s = await sanitizeIp(orig);
      if (!s) { invalid++; continue; }
      if (s !== orig) {
        const loc = await resolve(s);
        await client.execute({ sql: `UPDATE follow_hub_events SET ip_address = ?, geo_location = CASE WHEN ?<>'' THEN ? ELSE geo_location END WHERE id = ?`, args: [s, loc, loc, String(r.id || '')] });
        fixed++;
      }
    }
    return new Response(JSON.stringify({ ok: true, fixed, invalid }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};
