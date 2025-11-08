import type { APIRoute } from 'astro';
import QRCode from 'qrcode';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const text = url.searchParams.get('text') || 'https://follow.jyotirsetu.com';
    const sizeStr = url.searchParams.get('size') || '300';
    const size = Math.min(Math.max(Number(sizeStr) || 300, 128), 1024);

    const png = await QRCode.toBuffer(text, { width: size });
    const headers = new Headers({
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    });
    return new Response(png, { headers });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
};