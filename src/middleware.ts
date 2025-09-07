import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies } = context;
  
  // Check if the request is for admin routes
  if (url.pathname.startsWith('/admin') && 
      !url.pathname.startsWith('/admin/login') && 
      !url.pathname.startsWith('/admin/api/') &&
      !url.pathname.startsWith('/admin/forgot-password') &&
      !url.pathname.startsWith('/admin/reset-password') &&
      !url.pathname.startsWith('/admin/test-forgot-password') &&
      !url.pathname.startsWith('/admin/debug-forgot-password')) {
    // Check if user has admin session
    const adminSession = cookies.get('admin-session');
    
    if (!adminSession) {
      // Redirect to login if no session
      return context.redirect('/admin/login');
    }
  }
  
  // Continue with the request
  return next();
});
