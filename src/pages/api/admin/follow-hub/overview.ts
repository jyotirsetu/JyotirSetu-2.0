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

    const totalsRes = await client.execute({
      sql: `SELECT
              SUM(CASE WHEN event_type='page_view' THEN 1 ELSE 0 END) AS page_views,
              SUM(CASE WHEN event_type='cta_impression' THEN 1 ELSE 0 END) AS cta_impressions,
              SUM(CASE WHEN event_type='cta_click' THEN 1 ELSE 0 END) AS cta_clicks,
              SUM(CASE WHEN event_type='share' THEN 1 ELSE 0 END) AS shares
            FROM follow_hub_events ${where}`,
      args,
    });
    const t = (totalsRes.rows?.[0] ?? {}) as Record<string, unknown>;
    const page_views = Number((t as Record<string, unknown>).page_views ?? 0);
    const cta_clicks = Number((t as Record<string, unknown>).cta_clicks ?? 0);
    const ctr = page_views > 0 ? Number(((cta_clicks / page_views) * 100).toFixed(2)) : 0;

    const ctaBreakdownRes = await client.execute({
      sql: `SELECT cta_clicked AS cta,
                    SUM(CASE WHEN event_type='cta_click' THEN 1 ELSE 0 END) AS clicks
            FROM follow_hub_events ${where}
            GROUP BY cta_clicked ORDER BY clicks DESC`,
      args,
    });

    // Lightweight sparkline data for page views
    const sparkRes = await client.execute({
      sql: `SELECT substr(created_at,1,10) AS day,
                    SUM(CASE WHEN event_type='page_view' THEN 1 ELSE 0 END) AS views
            FROM follow_hub_events ${where}
            GROUP BY day ORDER BY day DESC LIMIT 10`,
      args,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        data: {
          totals: {
            page_views,
            cta_impressions: Number((t as Record<string, unknown>).cta_impressions ?? 0),
            cta_clicks,
            shares: Number((t as Record<string, unknown>).shares ?? 0),
            ctr,
          },
          cta_breakdown: ctaBreakdownRes.rows || [],
          sparkline: (sparkRes.rows || []).reverse(),
        },
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
