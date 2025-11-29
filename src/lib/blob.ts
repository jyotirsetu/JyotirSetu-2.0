export async function putBlob(path: string, data: ArrayBuffer | Uint8Array | string, contentType?: string) {
  const token = (import.meta.env && import.meta.env.BLOB_READ_WRITE_TOKEN) || process.env.BLOB_READ_WRITE_TOKEN || '';
  const { put } = await import('@vercel/blob');
  let body: string | Buffer;
  if (typeof data === 'string') {
    body = data;
  } else if (data instanceof ArrayBuffer) {
    body = Buffer.from(new Uint8Array(data));
  } else {
    body = Buffer.from(data);
  }
  const opts: { contentType?: string; access: 'public'; token?: string } = { contentType, access: 'public' };
  if (token) opts.token = token;
  const res = await put(path, body, opts);
  return res;
}
