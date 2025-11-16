import { defineMiddleware } from 'astro:middleware';
import { verifySession } from './lib/auth';

const getEnvString = (key: string): string | undefined => {
  const raw = (typeof process !== 'undefined' && (process as unknown as { env?: Record<string, unknown> }).env?.[key]);
  if (typeof raw === 'string') return raw;
  if (raw == null) return undefined;
  try { return String(raw); } catch { return undefined; }
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
  }

  return next();
});
