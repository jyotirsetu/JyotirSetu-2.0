export function getCsrfTokenFromCookie(cookie: string | null): string | null {
  if (!cookie) return null;
  const m = /csrf_token=([^;]+)/.exec(cookie);
  return m ? decodeURIComponent(m[1]) : null;
}

export function isValidCsrf(request: Request): boolean {
  const tokenHeader = request.headers.get('x-csrf-token') || '';
  const cookie = request.headers.get('cookie') || '';
  const tokenCookie = getCsrfTokenFromCookie(cookie);
  if (!tokenHeader || !tokenCookie) return false;
  return tokenHeader === tokenCookie;
}
