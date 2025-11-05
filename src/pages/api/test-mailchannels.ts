import type { APIRoute } from 'astro';

export const prerender = false;

function getEnv(name: string): string | undefined {
  // Prefer import.meta.env in Astro, fallback to process.env
  // eslint-disable-next-line no-undef
  return (import.meta.env as any)?.[name] ?? process?.env?.[name];
}

export const GET: APIRoute = async () => {
  const fromRaw = (getEnv('ZOHO_FROM_EMAIL') || '').toString();
  const toRaw = (getEnv('ZOHO_TO_ADMIN') || '').toString();
  const mcRaw = (getEnv('MAILCHANNELS_ENABLED') || '').toString();
  const from = fromRaw.trim();
  const to = toRaw.trim();
  const mcVal = mcRaw.trim().toLowerCase();
  const mcEnabled = (mcVal === 'true' || mcVal === '1' || mcVal === 'yes');

  if (!mcEnabled) {
    return new Response(JSON.stringify({ ok: false, stage: 'env-check', error: 'MAILCHANNELS_ENABLED is not true', debug: { mcRaw } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  if (!from || !to) {
    return new Response(JSON.stringify({ ok: false, stage: 'env-check', error: 'ZOHO_FROM_EMAIL or ZOHO_TO_ADMIN missing', debug: { fromRaw, toRaw } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  const payload = {
    personalizations: [
      { to: [{ email: to }] }
    ],
    from: { email: from },
    subject: 'MailChannels test from JyotirSetu',
    content: [{ type: 'text/html', value: '<p>If you received this, MailChannels works.</p>' }],
    headers: { 'Reply-To': to }
  };

  try {
    const res = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    return new Response(JSON.stringify({ ok: res.ok, status: res.status, body: text }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, stage: 'fetch', error: e?.message || 'unknown' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
};


