export async function renderPdf(html: string, options?: Record<string, unknown>) {
  const url =
    ((import.meta.env && import.meta.env.PDF_WORKER_URL) || process.env.PDF_WORKER_URL || '').replace(/\/$/, '') +
    '/pdf';
  if (!url || url.endsWith('/pdf') === false) throw new Error('PDF worker URL missing');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, options: options || {} }),
  });
  if (!res.ok) throw new Error('PDF worker failed');
  const buf = await res.arrayBuffer();
  return buf;
}
