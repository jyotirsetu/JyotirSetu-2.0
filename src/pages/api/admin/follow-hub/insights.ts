import type { APIRoute } from 'astro';
import { getTursoClient, ensureFollowHubEventsTable } from '../../../../lib/turso';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureFollowHubEventsTable();
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const source = url.searchParams.get('source');
    const device = url.searchParams.get('device');

    const client = await getTursoClient();
    const filters: string[] = [];
    const args: (string | number | boolean | bigint | null)[] = [];
    if (from) { filters.push(`datetime(created_at) >= datetime(?)`); args.push(from); }
    if (to) { filters.push(`datetime(created_at) <= datetime(?)`); args.push(to); }
    if (source) { filters.push(`source = ?`); args.push(source); }
    if (device) { filters.push(`device = ?`); args.push(device); }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const totalsRes = await client.execute({
      sql: `SELECT
              SUM(CASE WHEN event_type='page_view' THEN 1 ELSE 0 END) AS views,
              SUM(CASE WHEN event_type='cta_click' THEN 1 ELSE 0 END) AS clicks
            FROM follow_hub_events ${where}`,
      args
    });
    const t = (totalsRes.rows?.[0] ?? {}) as Record<string, unknown>;
    const views = Number((t as Record<string, unknown>).views ?? 0);
    const clicks = Number((t as Record<string, unknown>).clicks ?? 0);
    const ctr = views > 0 ? Number(((clicks / views) * 100).toFixed(2)) : 0;

    const daily = await client.execute({
      sql: `SELECT substr(created_at,1,10) AS day,
                    SUM(CASE WHEN event_type='page_view' THEN 1 ELSE 0 END) AS views,
                    SUM(CASE WHEN event_type='cta_click' THEN 1 ELSE 0 END) AS clicks
            FROM follow_hub_events ${where}
            GROUP BY day ORDER BY day ASC`,
      args
    });

    const byVariant = await client.execute({
      sql: `SELECT cta_variant AS variant,
                    SUM(CASE WHEN event_type='page_view' THEN 1 ELSE 0 END) AS views,
                    SUM(CASE WHEN event_type='cta_click' THEN 1 ELSE 0 END) AS clicks
            FROM follow_hub_events ${where}
            GROUP BY cta_variant`,
      args
    });

    const byDevice = await client.execute({
      sql: `SELECT device,
                    SUM(CASE WHEN event_type='page_view' THEN 1 ELSE 0 END) AS views,
                    SUM(CASE WHEN event_type='cta_click' THEN 1 ELSE 0 END) AS clicks
            FROM follow_hub_events ${where}
            GROUP BY device ORDER BY views DESC`,
      args
    });

    const bySource = await client.execute({
      sql: `SELECT source,
                    SUM(CASE WHEN event_type='page_view' THEN 1 ELSE 0 END) AS views,
                    SUM(CASE WHEN event_type='cta_click' THEN 1 ELSE 0 END) AS clicks
            FROM follow_hub_events ${where}
            GROUP BY source ORDER BY views DESC`,
      args
    });

    return new Response(
      JSON.stringify({ ok: true, data: {
        totals: { views, clicks, ctr },
        daily: daily.rows || [],
        variants: byVariant.rows || [],
        devices: byDevice.rows || [],
        sources: bySource.rows || []
      }}),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};