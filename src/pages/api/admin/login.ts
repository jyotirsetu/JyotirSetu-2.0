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
    return fromImportMeta ?? fromProcess ?? undefined;
  };

  const expectedUser = getEnv('ADMIN_USERNAME') || 'admin';
  const expectedPass = getEnv('ADMIN_PASSWORD') || 'admin123';
  const secret = getEnv('SESSION_SECRET') || 'change-me';

  if (username !== expectedUser || password !== expectedPass) {
    return new Response('Unauthorized', { status: 401 });
  }

  const token = await signSession({ user: 'admin', ts: Date.now() }, String(secret));
  const headers = new Headers();
  const proto = new URL(request.url).protocol;
  const secureFlag = proto === 'https:' ? '; Secure' : '';
  headers.append('Set-Cookie', `admin_session=${token}; Path=/; HttpOnly${secureFlag}; SameSite=Lax; Max-Age=2592000`);
  try {
    const { getTursoClient, ensureNotificationsTable } = await import('../../../lib/turso');
    await ensureNotificationsTable();
    const client = await getTursoClient();
    const ua = request.headers.get('user-agent') || '';
    const ip = (request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || '').split(',')[0].trim();
    const nid = `ntf_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
    const msg = `Admin login${ip ? ' from '+ip : ''}${ua ? ' ('+ua+')' : ''}`;
    await client.execute({ sql: `INSERT INTO notifications (id, title, message, type, read, created_at) VALUES (?, ?, ?, ?, 0, ?)`, args: [nid, 'Admin logged in', msg, 'admin_login', new Date().toISOString()] });
  } catch (e) { void e; }
  headers.append('Location', '/admin/dashboard');
  return new Response(null, { status: 302, headers });
};
