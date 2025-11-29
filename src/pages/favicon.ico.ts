import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const headers = new Headers({ 'Content-Type': 'image/x-icon', 'Cache-Control': 'public, max-age=86400' });
  return new Response(new Uint8Array([]), { status: 200, headers });
};
