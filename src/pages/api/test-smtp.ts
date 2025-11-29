import type { APIRoute } from 'astro';
import { emailService } from '../../lib/email-service';

export const prerender = false;

function getEnv(name: string): string | undefined {
  // Prefer import.meta.env in Astro, fallback to process.env
  const metaEnv = (import.meta as unknown as { env?: Record<string, unknown> }).env;
  const fromImportMeta = typeof metaEnv?.[name] === 'string' ? (metaEnv?.[name] as string) : undefined;
  const fromProcess = typeof process !== 'undefined' ? process.env?.[name] : undefined;
  return fromImportMeta ?? fromProcess ?? undefined;
}

export const GET: APIRoute = async () => {
  const host = getEnv('SMTP_HOST');
  const port = getEnv('SMTP_PORT');
  const secure = getEnv('SMTP_SECURE');
  const user = getEnv('SMTP_USER');
  const pass = getEnv('SMTP_PASS');
  const fromEmail = getEnv('ZOHO_FROM_EMAIL');
  const toAdmin = getEnv('ZOHO_TO_ADMIN');

  const missing = {
    host: !!host,
    port: !!port,
    secure: !!secure,
    user: !!user,
    pass: !!pass,
    fromEmail: !!fromEmail,
    toAdmin: !!toAdmin,
  };
  if (!host || !port || !secure || !user || !pass || !fromEmail || !toAdmin) {
    return new Response(JSON.stringify({ ok: false, stage: 'env-check', missing }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const ok = await emailService.sendContactConfirmationEmail({
      name: 'SMTP Test',
      email: String(toAdmin),
      subject: 'SMTP test from API',
      message: 'If you received this, SMTP works.',
    });
    return new Response(JSON.stringify({ ok, stage: 'send' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, stage: 'send', error: msg }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
