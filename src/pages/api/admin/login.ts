import type { APIRoute } from 'astro';
import { signSession } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const username = String(form.get('username') || '').trim();
  const password = String(form.get('password') || '').trim();

  const metaEnv = (import.meta as unknown as { env?: Record<string, unknown> }).env;
  const getEnv = (name: string): string | undefined => {
    const fromImportMeta = typeof metaEnv?.[name] === 'string' ? (metaEnv?.[name] as string) : undefined;
    const fromProcess = typeof process !== 'undefined' ? process.env?.[name] : undefined;
    return (fromImportMeta ?? fromProcess) ?? undefined;
  };

  const expectedUser = getEnv('ADMIN_USERNAME') || 'admin';
  const expectedPass = getEnv('ADMIN_PASSWORD') || 'admin123';
  const secret = getEnv('SESSION_SECRET') || 'change-me';

  if (username !== expectedUser || password !== expectedPass) {
    return new Response('Unauthorized', { status: 401 });
  }

  const token = await signSession({ user: 'admin', ts: Date.now() }, String(secret));
  const headers = new Headers();
  headers.append('Set-Cookie', `admin_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`);
  headers.append('Location', '/admin/dashboard');
  return new Response(null, { status: 302, headers });
};


