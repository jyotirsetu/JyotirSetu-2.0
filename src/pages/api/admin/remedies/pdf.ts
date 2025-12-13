import type { APIRoute } from 'astro';
import { getTursoClient } from '../../../../lib/turso';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    if (!token) return new Response(JSON.stringify({ error: 'token required' }), { status: 400 });

    const db = await getTursoClient();
    const res = await db.execute({ sql: 'SELECT * FROM remedies WHERE share_token = ? LIMIT 1', args: [String(token)] });
    const remedy = res.rows?.[0];
    if (!remedy) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404 });

    const heading = String(remedy.heading || 'Remedial Measures');
    const customer_name = String(remedy.customer_name || '');
    const customer_email = String(remedy.customer_email || '');
    const customer_phone = String(remedy.customer_phone || '');
    const apptId = String(remedy.customer_appointment_id || remedy.id || '');
    const contentHtml = String(remedy.content || '');

    const html = `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${heading} - JyotirSetu</title>
<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Lato:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root { --a4-width: 210mm; --a4-height: 297mm; --brand-color: #6610f2; }
  body { background: #fff; margin: 0; padding: 0; font-family: 'Lato', sans-serif; }
  .a4-page { width: var(--a4-width); min-height: var(--a4-height); background: white; position: relative; display: flex; flex-direction: column; }
  .a4-page::before { content: ''; position: absolute; top: 55%; left: 50%; transform: translate(-50%, -50%); width: 600px; height: 600px; background-image: url('https://www.jyotirsetu.com/logo.png'); background-size: contain; background-repeat: no-repeat; background-position: center; opacity: 0.04; pointer-events: none; z-index: 0; filter: grayscale(100%); }
  .page-header { height: auto; min-height: 120px; padding: 40px 50px 20px 50px; border-bottom: 2px solid var(--brand-color); display:flex; justify-content: space-between; align-items: flex-start; }
  .header-brand { display:flex; align-items:center; gap:15px; }
  .header-brand img { height: 90px; }
  .header-details { text-align:right; font-size:0.9rem; color:#555; }
  .client-info { background: #f8f9fa; border-left: 4px solid var(--brand-color); padding: 15px 20px; margin: 0 50px 20px 50px; border-radius: 4px; color: #333; }
  .page-body { flex:1; padding: 40px 60px; position:relative; z-index:1; }
  .page-footer { height:auto; min-height:60px; padding: 15px 50px; border-top:1px solid #dee2e6; display:flex; justify-content:space-between; align-items:center; font-size:8pt; color:#777; margin-top:auto; }
  .content { }
</style>
</head><body>
  <div class="a4-page">
    <div class="page-header">
      <div class="header-brand">
        <img src="https://www.jyotirsetu.com/logo.png" alt="Logo" />
        <div>
          <h2 class="m-0" style="font-family: 'Merriweather', serif; letter-spacing: -0.5px; color:#0d6efd">JyotirSetu by Astrologer Punita Sharma</h2>
          <p class="m-0" style="letter-spacing: 2px; font-size: 0.7rem; color:#6b7280">Bridge to Cosmic light</p>
        </div>
      </div>
      <div class="header-details">
        <div class="fw-bold" style="color:#1f2937">JyotirSetu Guidance Sheet</div>
        <div>Date: ${new Date(String(remedy.created_at)).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </div>
    </div>
    <div class="client-info">
      <div class="row">
        <div class="col-8">
          <div class="small" style="text-transform:uppercase; color:#6b7280; font-weight:700; margin-bottom:6px">Prepared For</div>
          <div class="fs-4" style="font-family: 'Merriweather', serif; font-weight:700; color:#111827">${customer_name}</div>
        </div>
        <div class="col-4" style="text-align:right">
          <div class="text-muted small">${customer_email}</div>
          <div class="text-muted small">${customer_phone}</div>
          <div class="text-muted small" style="margin-top:4px">Appt ID: ${apptId}</div>
        </div>
      </div>
    </div>
    <div class="page-body">
      <h3 class="text-center" style="margin-bottom: 20px; font-family: 'Merriweather', serif; color:#333; text-transform: uppercase; letter-spacing: 1px; font-size: 1.5rem; border-bottom: 1px solid #eee; padding-bottom: 20px;">${heading}</h3>
      <div class="content">${contentHtml}</div>
    </div>
    <div class="page-footer">
      <div><strong style="color:#111827">JyotirSetu</strong> <span class="mx-2" style="color:#6b7280">|</span> <span style="color:#6b7280">www.jyotirsetu.com</span></div>
      <div style="text-align:right; color:#6b7280; font-size:8pt; max-width:300px; line-height:1.2">This document contains spiritual remedies based on Vedic Astrology. Results may vary.</div>
    </div>
  </div>
</body></html>`;

    const isProd = (Boolean((import.meta as unknown as { env?: Record<string, unknown> }).env?.['PROD']) === true) || String((process.env?.['VERCEL'] || '')) === '1';
    let browser: import('puppeteer').Browser | import('puppeteer-core').Browser;
    if (isProd) {
      const chromiumMod = await import('@sparticuz/chromium');
      const chromium = (chromiumMod as unknown as { default?: unknown; args?: string[]; executablePath?: (()=>Promise<string>)|string }).default ?? (chromiumMod as unknown as { args?: string[]; executablePath?: (()=>Promise<string>)|string });
      const puppeteerCore = (await import('puppeteer-core')).default;
      const ep = (chromium as { executablePath?: (()=>Promise<string>)|string }).executablePath;
      const executablePath = typeof ep === 'function' ? await ep() : (ep as string);
      browser = await puppeteerCore.launch({ headless: true, args: (chromium as { args?: string[] }).args || [], executablePath });
    } else {
      const puppeteer = (await import('puppeteer')).default;
      browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    }
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '10mm', right: '10mm', bottom: '12mm', left: '10mm' } });
      const u8 = pdf as Uint8Array;
      const stream = new ReadableStream({ start(controller) { controller.enqueue(u8); controller.close(); } });
      return new Response(stream, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="JyotirSetu_Remedies_${String(apptId)}.pdf"` } });
    } finally {
      await browser.close();
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' }), { status: 500 });
  }
};
