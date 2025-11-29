import type { APIRoute } from 'astro';
import { ensureFollowHubEventsTable, getTursoClient } from '../../../lib/turso';

export const prerender = false;

const ALLOWED_EVENTS = new Set(['page_view', 'cta_impression', 'cta_click', 'share']);

function getAllowedOrigins(): string[] {
  const primary = (
    import.meta.env?.FOLLOW_HUB_ORIGIN ??
    process.env?.FOLLOW_HUB_ORIGIN ??
    'https://follow.jyotirsetu.com'
  ).toString();
  const extraRaw = (
    import.meta.env?.FOLLOW_HUB_EXTRA_ORIGINS ??
    process.env?.FOLLOW_HUB_EXTRA_ORIGINS ??
    ''
  ).toString();
  const extras = extraRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const defaults = [
    'https://www.follow.jyotirsetu.com',
    'http://follow.jyotirsetu.com',
    'http://www.follow.jyotirsetu.com',
    // Allow main site to log events when needed
    'https://www.jyotirsetu.com',
    'https://jyotirsetu.com',
    'http://www.jyotirsetu.com',
    'http://jyotirsetu.com',
  ];
  const set = new Set([primary, ...defaults, ...extras]);
  return Array.from(set);
}

function corsHeaders(request?: Request) {
  const allowed = getAllowedOrigins();
  const reqOrigin = request?.headers?.get('origin') || request?.headers?.get('Origin') || '';
  const origin = allowed.includes(String(reqOrigin)) ? String(reqOrigin) : allowed[0];
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  } as Record<string, string>;
}

function getIp(request: Request): string {
  const h = request.headers;
  // Try multiple headers across platforms (Vercel, Node, proxies)
  const vercel = h.get('x-vercel-ip') || h.get('X-Vercel-IP') || '';
  const forwarded = h.get('x-forwarded-for') || h.get('X-Forwarded-For') || '';
  const cfip = h.get('cf-connecting-ip') || h.get('CF-Connecting-IP') || '';
  const real = h.get('x-real-ip') || h.get('X-Real-IP') || '';
  const ip = (vercel || cfip || forwarded.split(',')[0] || real || '').trim();
  return ip || 'unknown';
}

async function sanitizeIp(raw: string): Promise<string> {
  try {
    let s = String(raw || '').trim();
    if (!s) return '';
    // Remove IPv6 brackets and optional port
    const m6 = s.match(/^\[([^\]]+)\](?::\d+)?$/);
    if (m6) s = m6[1];
    // Remove IPv4 port suffix
    const m4 = s.match(/^(\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?$/);
    if (m4) s = m4[1];
    const { isIP } = await import('node:net');
    return isIP(s) ? s : '';
  } catch {
    return '';
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Basic payload size guard
    const raw = await request.text();
    if (raw.length > 10_000) {
      return new Response(JSON.stringify({ ok: false, error: 'payload_too_large' }), { status: 413 });
    }
    const body = JSON.parse(raw || '{}');
    const event_type = String(body.event_type || '').trim();
    if (!ALLOWED_EVENTS.has(event_type)) {
      return new Response(JSON.stringify({ ok: false, error: 'invalid_event_type' }), { status: 400 });
    }

    const nowUrl = new URL(request.url);
    const page_url = String(body.page_url || body.page || nowUrl.searchParams.get('page') || '');
    const source = String(body.source || '').substring(0, 64);
    const medium = String(body.medium || '').substring(0, 64);
    const campaign = String(body.campaign || '').substring(0, 64);
    const device = String(body.device || '').substring(0, 32);
    const platform = String(body.platform || '').substring(0, 32);
    const user_agent = (request.headers.get('user-agent') || '').substring(0, 512);
    const ipRaw = getIp(request);
    const ip_address = await sanitizeIp(ipRaw) || ipRaw;
    const primary_cta_shown = String(body.primary_cta_shown || '').substring(0, 64);
    const cta_clicked = String(body.cta_clicked || '').substring(0, 64);
    const cta_variant = String(body.cta_variant || '').substring(0, 32);
    const utm_query = String(body.utm_query || body.utm || '').substring(0, 1024);
    const extra = body.extra && typeof body.extra === 'object' ? JSON.stringify(body.extra).substring(0, 2000) : null;

    // Rate-limit: 10 req/min per IP
    await ensureFollowHubEventsTable();
    const client = await getTursoClient();
    // Rate-limit only when IP is known to avoid false-global throttling in serverless
    if (ip_address && ip_address !== 'unknown') {
      const rateRes = await client.execute({
        sql: `SELECT COUNT(*) AS cnt FROM follow_hub_events WHERE ip_address = ? AND datetime(created_at) >= datetime('now', '-1 minute')`,
        args: [ip_address],
      });
      const t = (rateRes.rows?.[0] ?? {}) as Record<string, unknown>;
      const count = Number((t as Record<string, unknown>).cnt ?? 0);
      if (count >= 10) {
        return new Response(JSON.stringify({ ok: false, error: 'rate_limited' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
        });
      }
    }

    async function resolveLocation(ip: string): Promise<string> {
      const key = ip || '';
      if (!key || key === 'unknown') return '';
      try {
        const c = new AbortController();
        const t = setTimeout(() => { try { c.abort(); } catch {} }, 1800);
        const r = await fetch(`https://ipapi.co/${encodeURIComponent(key)}/json/`, {
          signal: c.signal,
          headers: { 'User-Agent': 'JyotirSetuAdmin/1.0' },
        });
        clearTimeout(t);
        const j = await r.json();
        const city = String(j.city || '').trim();
        const region = String(j.region || j.region_code || '').trim();
        const country = String(j.country_name || j.country || '').trim();
        let loc = [city, region, country].filter(Boolean).join(', ');
        if (!loc) {
          const c2 = new AbortController();
          const t2 = setTimeout(() => { try { c2.abort(); } catch {} }, 1800);
          const r2 = await fetch(`http://ip-api.com/json/${encodeURIComponent(key)}?fields=status,country,countryCode,region,regionName,city`, {
            signal: c2.signal,
            headers: { 'User-Agent': 'JyotirSetuAdmin/1.0' },
          });
          clearTimeout(t2);
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
    const geo_location = (await sanitizeIp(ip_address)) ? await resolveLocation(ip_address) : '';

    const id = Math.random().toString(36).slice(2);
    await client.execute({
      sql: `INSERT INTO follow_hub_events (id, event_type, source, medium, campaign, device, platform, user_agent, ip_address, primary_cta_shown, cta_clicked, cta_variant, page_url, utm_query, extra, geo_location)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        event_type,
        source || null,
        medium || null,
        campaign || null,
        device || null,
        platform || null,
        user_agent || null,
        ip_address || null,
        primary_cta_shown || null,
        cta_clicked || null,
        cta_variant || null,
        page_url || null,
        utm_query || null,
        extra || null,
        geo_location || null,
      ],
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
    });
  }
};

export const OPTIONS: APIRoute = async ({ request }) => {
  return new Response(null, { status: 204, headers: { ...corsHeaders(request) } });
};
