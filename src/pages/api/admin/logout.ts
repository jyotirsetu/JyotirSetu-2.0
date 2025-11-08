import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ redirect }) => {
  const headers = new Headers();
  // Expire the cookie immediately
  headers.append('Set-Cookie', 'admin_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  headers.append('Location', '/admin/login');
  return new Response(null, { status: 302, headers });
};



