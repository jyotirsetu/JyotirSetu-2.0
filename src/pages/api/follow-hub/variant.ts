import type { APIRoute } from 'astro';
import { getTursoClient, ensureFollowHubSettingsTable } from '../../../lib/turso';
import { } from './event';

export const prerender = false;

function getAllowedOrigins(): string[] {
  const primary = (import.meta.env?.FOLLOW_HUB_ORIGIN ?? process.env?.FOLLOW_HUB_ORIGIN ?? 'https://follow.jyotirsetu.com').toString();
  const extraRaw = (import.meta.env?.FOLLOW_HUB_EXTRA_ORIGINS ?? process.env?.FOLLOW_HUB_EXTRA_ORIGINS ?? '').toString();
  const extras = extraRaw.split(',').map(s => s.trim()).filter(Boolean);
  const defaults = [
    'https://www.follow.jyotirsetu.com',
    'http://follow.jyotirsetu.com',
    'http://www.follow.jyotirsetu.com',
    'https://www.jyotirsetu.com',
    'https://jyotirsetu.com',
    'http://www.jyotirsetu.com',
    'http://jyotirsetu.com'
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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  } as Record<string, string>;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    await ensureFollowHubSettingsTable();
    const client = await getTursoClient();
    const res = await client.execute({ sql: `SELECT value FROM follow_hub_settings WHERE key='cta_variant' LIMIT 1`, args: [] });
    const row = (res.rows?.[0] ?? {}) as Record<string, unknown>;
    const value = typeof row.value === 'string' ? row.value : 'A';
    return new Response(JSON.stringify({ ok: true, value }), { headers: { 'Content-Type': 'application/json', ...corsHeaders(request) } });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders(request) } });
  }
};

export const OPTIONS: APIRoute = async ({ request }) => {
  return new Response(null, { status: 204, headers: { ...corsHeaders(request) } });
};