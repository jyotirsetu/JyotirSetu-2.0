import type { APIRoute } from 'astro';
import { emailService } from '../../lib/email-service';

export const prerender = false;

export const GET: APIRoute = async () => {
  const mode = ((import.meta.env && import.meta.env.MODE) || process.env.NODE_ENV || 'development');
  const isDev = mode !== 'production';
  const mcEnabled = ((import.meta.env && import.meta.env.MAILCHANNELS_ENABLED) || process.env.MAILCHANNELS_ENABLED || 'false').toString().toLowerCase() === 'true';
  const clientId = (import.meta.env && import.meta.env.ZOHO_CLIENT_ID) || process.env.ZOHO_CLIENT_ID;
  const clientSecret = (import.meta.env && import.meta.env.ZOHO_CLIENT_SECRET) || process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = (import.meta.env && import.meta.env.ZOHO_REFRESH_TOKEN) || process.env.ZOHO_REFRESH_TOKEN;
  const region = (import.meta.env && import.meta.env.ZOHO_REGION) || process.env.ZOHO_REGION;
  const fromEmail = (import.meta.env && import.meta.env.ZOHO_FROM_EMAIL) || process.env.ZOHO_FROM_EMAIL;
  const toAdmin = (import.meta.env && import.meta.env.ZOHO_TO_ADMIN) || process.env.ZOHO_TO_ADMIN;

  if (!mcEnabled && (!clientId || !clientSecret || !refreshToken || !region || !fromEmail || !toAdmin)) {
    return new Response(
      JSON.stringify({ ok: false, stage: 'env-check', missing: {
        clientId: !!clientId, clientSecret: !!clientSecret, refreshToken: !!refreshToken,
        region: !!region, fromEmail: !!fromEmail, toAdmin: !!toAdmin
      }}),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const ok = await emailService.sendContactConfirmationEmail({
      name: 'Zoho Test',
      email: String(toAdmin),
      subject: 'Zoho mail test from API',
      message: 'If you received this, Zoho OAuth and sending are working.',
    });
    return new Response(JSON.stringify({ ok, stage: 'send' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, stage: 'send', error: e?.message || 'unknown' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
};


