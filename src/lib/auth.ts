export async function signSession(payload: Record<string, unknown>, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, data));
  const sigB64 = btoa(String.fromCharCode(...sig));
  const dataB64 = btoa(String.fromCharCode(...data));
  return `${dataB64}.${sigB64}`;
}

export async function verifySession(token: string, secret: string): Promise<Record<string, unknown> | null> {
  const [dataB64, sigB64] = token.split('.');
  if (!dataB64 || !sigB64) return null;
  const decoder = new TextDecoder();
  const bin = Uint8Array.from(atob(dataB64), c => c.charCodeAt(0));
  const sig = Uint8Array.from(atob(sigB64), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const ok = await crypto.subtle.verify('HMAC', key, sig, bin);
  if (!ok) return null;
  try {
    return JSON.parse(decoder.decode(bin));
  } catch {
    return null;
  }
}


