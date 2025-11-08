import type { APIRoute } from 'astro';
import { signSession } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const username = String(form.get('username') || '').trim();
  const password = String(form.get('password') || '').trim();

  const expectedUser = (import.meta.env as any)?.ADMIN_USERNAME || (process as any)?.env?.ADMIN_USERNAME || 'admin';
  const expectedPass = (import.meta.env as any)?.ADMIN_PASSWORD || (process as any)?.env?.ADMIN_PASSWORD || 'admin123';
  const secret = (import.meta.env as any)?.SESSION_SECRET || (process as any)?.env?.SESSION_SECRET || 'change-me';

  if (username !== expectedUser || password !== expectedPass) {
    return new Response('Unauthorized', { status: 401 });
  }

  const token = await signSession({ user: 'admin', ts: Date.now() }, String(secret));
  const headers = new Headers();
  headers.append('Set-Cookie', `admin_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`);
  headers.append('Location', '/admin/dashboard');
  return new Response(null, { status: 302, headers });
};


