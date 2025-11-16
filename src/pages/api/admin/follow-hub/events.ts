import type { APIRoute } from 'astro';
import { getTursoClient, ensureFollowHubEventsTable } from '../../../../lib/turso';

export const prerender = false;

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
      if (from.length === 10) { filters.push(`date(created_at) >= date(?)`); }
      else { filters.push(`created_at >= ?`); }
      args.push(from);
    }
    if (to) {
      if (to.length === 10) { filters.push(`date(created_at) <= date(?)`); }
      else { filters.push(`created_at <= ?`); }
      args.push(to);
    }
    if (source) { filters.push(`source = ?`); args.push(source); }
    if (device) { filters.push(`device = ?`); args.push(device); }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const res = await client.execute({
      sql: `SELECT id,
                   strftime('%Y-%m-%dT%H:%M:%SZ', created_at) AS created_at,
                   event_type, source, medium, campaign, device, platform,
                   primary_cta_shown, cta_clicked, cta_variant, page_url, utm_query,
                   substr(ip_address, 1, 3) || '***' AS ip_masked,
                   CASE WHEN user_agent IS NULL THEN NULL ELSE 'UA-' || substr(hex(randomblob(4)),1,8) END AS ua_masked
            FROM follow_hub_events ${where}
            ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      args: [...args, limit, offset]
    });
    return new Response(JSON.stringify({ ok: true, data: res.rows }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};