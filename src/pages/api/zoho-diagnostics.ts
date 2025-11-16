import type { APIRoute } from 'astro';

export const prerender = false;

function getEnv(name: string): string | undefined {
  const raw = (typeof process !== 'undefined' && (process as unknown as { env?: Record<string, unknown> }).env?.[name]);
  if (typeof raw === 'string') return raw;
  if (raw == null) return undefined;
  try { return String(raw); } catch { return undefined; }
}

interface ZohoAccount {
  status: string;
  accountId: string;
  emailAddress?: string;
  primaryEmailAddress?: string;
  address?: string;
}

interface ZohoAlias {
  aliasAddress: string;
}

export const GET: APIRoute = async () => {
  const mode = getEnv('MODE') || process.env.NODE_ENV || 'development';

  const clientId = getEnv('ZOHO_CLIENT_ID');
  const clientSecret = getEnv('ZOHO_CLIENT_SECRET');
  const refreshToken = getEnv('ZOHO_REFRESH_TOKEN');
  const region = (getEnv('ZOHO_REGION') || 'com').toString().trim();
  const fromEmail = getEnv('ZOHO_FROM_EMAIL');
  const toAdmin = getEnv('ZOHO_TO_ADMIN');

  const missing = {
    clientId: !!clientId,
    clientSecret: !!clientSecret,
    refreshToken: !!refreshToken,
    region: !!region,
    fromEmail: !!fromEmail,
    toAdmin: !!toAdmin,
  };

  if (mode === 'development') {
    if (!clientId || !clientSecret || !refreshToken || !region || !fromEmail || !toAdmin) {
      return new Response(
        JSON.stringify({ ok: false, stage: 'env-check', missing }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  try {
    // 1) Exchange refresh token for access token
    const tokenRes = await fetch(`https://accounts.zoho.${region}/oauth/v2/token`, {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: String(clientId || ''),
        client_secret: String(clientSecret || ''),
        refresh_token: String(refreshToken || ''),
      }),
    });
    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      return new Response(
        JSON.stringify({ ok: false, stage: 'token', error: text }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const tokenJson = await tokenRes.json() as { access_token: string };
    const accessToken = tokenJson.access_token;

    // 2) Get accounts
    const accountsRes = await fetch(`https://mail.zoho.${region}/api/accounts`, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
    });
    const accountsJson = await accountsRes.json() as { data: ZohoAccount[] | ZohoAccount };
    const rawAccounts = accountsJson?.data;
    const accounts: ZohoAccount[] = Array.isArray(rawAccounts)
      ? rawAccounts
      : (rawAccounts ? [rawAccounts] : []);
    const primary = accounts.find((a) => a?.status === 'active') || accounts[0];
    if (!primary?.accountId) {
      return new Response(
        JSON.stringify({ ok: false, stage: 'accounts', error: accountsJson }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3) Get aliases for primary account
    const aliasesRes = await fetch(`https://mail.zoho.${region}/api/accounts/${primary.accountId}/aliases`, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
    });
    const aliasesJson = await aliasesRes.json() as { data: ZohoAlias[] | ZohoAlias };
    const rawAliases = aliasesJson?.data;
    const aliasArr: ZohoAlias[] = Array.isArray(rawAliases)
      ? rawAliases
      : (rawAliases ? [rawAliases] : []);
    const aliases: string[] = aliasArr.map((x) => x?.aliasAddress).filter(Boolean);
    const primaryAddress = primary?.emailAddress || primary?.primaryEmailAddress || primary?.address || '';
    const allowedFroms = [primaryAddress, ...aliases].filter(Boolean);

    // Check if configured fromEmail is allowed
    const configuredFrom = String(fromEmail).toLowerCase();
    const isFromAllowed = allowedFroms.map((s) => String(s).toLowerCase()).includes(configuredFrom);

    return new Response(
      JSON.stringify({
        ok: true,
        stage: 'diagnostics',
        accountId: primary.accountId,
        primaryAddress,
        aliases: allowedFroms,
        configuredFrom,
        isFromAllowed,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    const error = e as Error;
    return new Response(
      JSON.stringify({ ok: false, stage: 'exception', error: error.message || 'unknown' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
};


