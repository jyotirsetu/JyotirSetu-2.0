import { defineMiddleware } from 'astro:middleware';
import { verifySession } from './lib/auth';

const getEnvString = (key: string): string | undefined => {
  const metaEnv = (import.meta as unknown as { env?: Record<string, unknown> }).env;
  const fromImportMeta = typeof metaEnv?.[key] === 'string' ? (metaEnv?.[key] as string) : undefined;
  const fromProcess =
    typeof process !== 'undefined' && (process as unknown as { env?: Record<string, unknown> }).env?.[key];
  const val = fromImportMeta ?? (typeof fromProcess === 'string' ? fromProcess : undefined);
  if (typeof val === 'string') return val;
  if (val == null) return undefined;
  try {
    return String(val);
  } catch {
    return undefined;
  }
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request, redirect } = context;
  const pathname = new URL(url).pathname;

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin') {
      return redirect('/admin/dashboard');
    }
    // Allow login page and login API without session
    if (pathname === '/admin/login' || pathname === '/api/admin/login') {
      return next();
    }
    const cookie = request.headers.get('cookie') || '';
    const match = /admin_session=([^;]+)/.exec(cookie || '');
    const token = match?.[1];
    const secret = getEnvString('SESSION_SECRET') || 'change-me';
    if (!token || !secret) {
      return redirect('/admin/login');
    }
    const session = await verifySession(token, String(secret));
    if (!session || !session.user || session.user !== 'admin') {
      return redirect('/admin/login');
    }
    const hasCsrf = /csrf_token=([^;]+)/.test(request.headers.get('cookie') || '');
    const response = await next();
    if (!hasCsrf) {
      const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      response.headers.append('Set-Cookie', `csrf_token=${encodeURIComponent(token)}; Path=/; SameSite=Lax`);
    }
    return response;
  }

  return next();
});
