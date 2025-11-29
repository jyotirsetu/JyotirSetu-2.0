import type { APIRoute } from 'astro';
import { getTursoClient, ensureFollowHubEventsTable } from '../../../../lib/turso';

export const prerender = false;

async function resolve(ip: string): Promise<string> {
  const key = ip || '';
  if (!key || key === 'unknown') return '';
  try {
    const r = await fetch(`https://ipapi.co/${encodeURIComponent(key)}/json/`);
    const j = await r.json();
    const city = String(j.city || '').trim();
    const region = String(j.region || j.region_code || '').trim();
    const country = String(j.country_name || j.country || '').trim();
    let loc = [city, region, country].filter(Boolean).join(', ');
    if (!loc) {
      const r2 = await fetch(`http://ip-api.com/json/${encodeURIComponent(key)}?fields=status,country,region,regionName,city`);
      const j2 = await r2.json();
      if (String(j2.status || '').toLowerCase() === 'success') {
        const city2 = String(j2.city || '').trim();
        const region2 = String(j2.regionName || j2.region || '').trim();
        const country2 = String(j2.country || '').trim();
        loc = [city2, region2, country2].filter(Boolean).join(', ');
      }
    }
    return loc;
  } catch {
    return '';
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    await ensureFollowHubEventsTable();
    const url = new URL(request.url);
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || '200'), 1), 2000);
    const client = await getTursoClient();
    const res = await client.execute({
      sql: `SELECT id, ip_address FROM follow_hub_events WHERE (geo_location IS NULL OR geo_location = '') AND ip_address IS NOT NULL LIMIT ?`,
      args: [limit],
    });
    const rows = res.rows || [];
    let updated = 0;
    for (const r of rows as Array<Record<string, unknown>>) {
      const ip = String(r.ip_address || '');
      const loc = await resolve(ip);
      if (loc) {
        await client.execute({ sql: `UPDATE follow_hub_events SET geo_location = ? WHERE id = ?`, args: [loc, String(r.id || '')] });
        updated++;
      }
    }
    return new Response(JSON.stringify({ ok: true, updated }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
  }
};
