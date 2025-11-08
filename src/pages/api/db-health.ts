import type { APIRoute } from 'astro';
import { getTursoClient } from '../../lib/turso';

export const prerender = false;

export const GET: APIRoute = async () => {
  const mode = ((import.meta.env && import.meta.env.MODE) || process.env.NODE_ENV || 'development');
  const isDev = mode !== 'production';
  const envUrl = (((import.meta.env && import.meta.env.TURSO_DATABASE_URL) || process.env.TURSO_DATABASE_URL) || '').toString().trim();
  const envToken = (((import.meta.env && import.meta.env.TURSO_AUTH_TOKEN) || process.env.TURSO_AUTH_TOKEN) || '').toString().trim();
  const hasUrl = Boolean(envUrl);
  const hasToken = Boolean(envToken);

  const mask = (s: string) => {
    if (!s) return '';
    try {
      const u = new URL(s);
      const host = u.host;
      return host.length > 8 ? host.slice(0, 4) + '...' + host.slice(-4) : host;
    } catch {
      return s.length > 8 ? s.slice(0, 4) + '...' + s.slice(-4) : s;
    }
  };

  if (!hasUrl || !hasToken) {
    return new Response(
      JSON.stringify({
        ok: false,
        stage: 'env-check',
        hasUrl,
        hasToken,
        urlHostMasked: mask(envUrl),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const client = getTursoClient();
    const res = await client.execute('SELECT 1 AS ok');
    return new Response(
      JSON.stringify({
        ok: true,
        stage: 'query',
        hasUrl,
        hasToken,
        urlHostMasked: mask(envUrl),
        result: res.rows,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        stage: 'query',
        hasUrl,
        hasToken,
        urlHostMasked: mask(envUrl),
        error: e?.message || 'unknown',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
};


