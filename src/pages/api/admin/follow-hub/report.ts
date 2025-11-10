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

    const totals = await client.execute({
      sql: `SELECT
              SUM(CASE WHEN event_type='page_view' THEN 1 ELSE 0 END) AS views,
              SUM(CASE WHEN event_type='cta_click' THEN 1 ELSE 0 END) AS clicks,
              SUM(CASE WHEN event_type='cta_click' AND cta_clicked='whatsapp' THEN 1 ELSE 0 END) AS whatsapp_clicks,
              SUM(CASE WHEN event_type='cta_click' AND cta_clicked='google_review' THEN 1 ELSE 0 END) AS reviews_clicks
            FROM follow_hub_events ${where}`,
      args
    });
    const t = (totals.rows?.[0] ?? {}) as Record<string, unknown>;
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

    return new Response(
      JSON.stringify({ ok: true, data: { totals: { views, clicks, ctr, whatsapp_clicks: Number((t as Record<string, unknown>).whatsapp_clicks ?? 0), reviews_clicks: Number((t as Record<string, unknown>).reviews_clicks ?? 0) }, daily: daily.rows || [], variants: byVariant.rows || [] } }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};