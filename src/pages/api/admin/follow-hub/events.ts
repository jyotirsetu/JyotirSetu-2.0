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

async function geo(ip: string): Promise<string> {
  if (!ip) return '';
  try {
    const c = new AbortController();
    const t = setTimeout(() => { try { c.abort(); } catch { /* abort may throw if already settled */ } }, 1800);
    const r = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, { signal: c.signal });
    clearTimeout(t);
    const j = await r.json();
    const city = String(j.city || '').trim();
    const region = String(j.region || j.region_code || '').trim();
    const country = String(j.country_name || j.country || '').trim();
    let loc = [city, region, country].filter(Boolean).join(', ');
    if (!loc) {
      const r2 = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,region,regionName,city`);
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

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureFollowHubEventsTable();
    const url = new URL(request.url);
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || '1000'), 1), 5000);
    const offset = Math.max(Number(url.searchParams.get('offset') || '0'), 0);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const source = url.searchParams.get('source');
    const device = url.searchParams.get('device');

    const client = await getTursoClient();
    const filters: string[] = [];
    const args: (string | number | boolean | bigint | null)[] = [];
    if (from) {
      if (from.length === 10) {
        filters.push(`date(created_at) >= date(?)`);
      } else {
        filters.push(`created_at >= ?`);
      }
      args.push(from);
    }
    if (to) {
      if (to.length === 10) {
        filters.push(`date(created_at) <= date(?)`);
      } else {
        filters.push(`created_at <= ?`);
      }
      args.push(to);
    }
    if (source) {
      filters.push(`source = ?`);
      args.push(source);
    }
    if (device) {
      filters.push(`device = ?`);
      args.push(device);
    }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const res = await client.execute({
      sql: `SELECT id,
                   strftime('%Y-%m-%dT%H:%M:%SZ', created_at) AS created_at,
                   event_type, source, medium, campaign, device, platform,
                   primary_cta_shown, cta_clicked, cta_variant, page_url, utm_query,
                   ip_address,
                   geo_location AS location,
                   user_agent
            FROM follow_hub_events ${where}
            ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      args: [...args, limit, offset],
    });
    const rows = (res.rows || []) as Array<Record<string, unknown>>;
    const enriched = await Promise.all(
      rows.map(async (r) => {
        const loc = String(r.location || '').trim();
        const ipVal = String(r.ip_address || '');
        const ipSan = await sanitizeIp(ipVal);
        if (loc) return { ...r, ip_address: ipSan || ipVal } as Record<string, unknown>;
        if (!ipSan) return { ...r, location: 'Invalid IP' } as Record<string, unknown>;
        const fallback = await geo(ipSan);
        return { ...r, location: fallback } as Record<string, unknown>;
      })
    );
    try {
      const client2 = await getTursoClient();
      for (let i = 0; i < enriched.length; i++) {
        const r = enriched[i] as Record<string, unknown>;
        const id = String(r.id || '');
        const loc = String(r.location || '').trim();
        const had = String((rows[i] as Record<string, unknown>)?.location || '').trim();
        if (id && loc && !had) {
          await client2.execute({ sql: `UPDATE follow_hub_events SET geo_location = ? WHERE id = ?`, args: [loc, id] });
        }
      }
    } catch { /* best-effort persistence of geo_location; ignore errors */ }
    return new Response(JSON.stringify({ ok: true, data: enriched }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
