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

  let role = (getEnv('ADMIN_ROLE') || 'super_admin').trim() === 'super_admin' ? 'super_admin' : 'admin';
  let ok = false;
  const accountsStr = getEnv('ADMIN_ACCOUNTS_JSON') || getEnv('ADMIN_ACCOUNTS') || '';
  try {
    if (accountsStr) {
      const arr = JSON.parse(accountsStr);
      if (Array.isArray(arr)) {
        for (const a of arr) {
          const u = String(a?.username||'');
          const p = String(a?.password||'');
          const r = String(a?.role||'admin');
          let match = false;
          if (p.startsWith('sha256:')) {
            const h = p.slice(7);
            const crypto = await import('node:crypto');
            const hp = crypto.createHash('sha256').update(password).digest('hex');
            match = username === u && hp === h;
          } else {
            match = username === u && password === p;
          }
          if (match) { role = r; ok = true; break; }
        }
      }
    }
  } catch { void 0; }
  if (!ok) {
    ok = username === expectedUser && password === expectedPass;
  }
  if (!ok) return new Response('Unauthorized', { status: 401 });
  const token = await signSession({ user: username, role, ts: Date.now() }, String(secret));
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
