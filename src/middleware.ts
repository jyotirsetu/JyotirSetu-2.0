import { defineMiddleware } from 'astro:middleware';
import { verifySession } from './lib/auth';

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
    const secret = (import.meta.env && (import.meta.env.SESSION_SECRET as any)) || (process as any)?.env?.SESSION_SECRET;
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
