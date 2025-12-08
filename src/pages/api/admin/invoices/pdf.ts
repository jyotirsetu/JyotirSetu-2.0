import type { APIRoute } from 'astro';
import { getTursoClient } from '../../../../lib/turso';

function formatCurrency(amount: number | null): string {
  if (amount === null || amount === undefined) return '₹0.00';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const number = url.searchParams.get('number');
    if (!id && !number) {
      return new Response(JSON.stringify({ error: 'Invoice id or number is required' }), { status: 400 });
    }

    const db = await getTursoClient();
    const invRes = await db.execute({
      sql: `SELECT * FROM invoices WHERE ${id ? 'id = ?' : 'number = ?'} LIMIT 1`,
      args: [String(id || number)],
    });
    const invoice = invRes.rows?.[0] as Record<string, unknown> | undefined;
    if (!invoice) return new Response(JSON.stringify({ error: 'Invoice not found' }), { status: 404 });

    const itemsRes = await db.execute({
      sql: `SELECT id, type, title, description, qty, unit_price, discount, gst_rate, amount FROM invoice_items WHERE invoice_id = ? ORDER BY rowid ASC`,
      args: [String(invoice.id)],
    });
    const clientRes = await db.execute({ sql: `SELECT id, name, email, phone FROM clients WHERE id = ? LIMIT 1`, args: [String(invoice.client_id || '')] });
    const client = clientRes.rows?.[0] || { name: '', email: '', phone: '' };

    const items = itemsRes.rows || [];
    const subtotalFromItems = items.reduce((sum, it: any) => sum + Number(it.amount || 0), 0);
    const subtotal = Number(invoice.subtotal ?? subtotalFromItems);
    const gstTotal = Number(invoice.gst_total ?? 0);
    const rounding = Number(invoice.rounding ?? 0);
    const total = Number(invoice.total ?? subtotal + gstTotal + rounding);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice ${String(invoice.number)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background: #fff; }
    .container { max-width: 800px; margin: 0 auto; padding: 15px; }
    .header { display:flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 2px solid #2563eb; }
    .company-name { font-size: 20px; font-weight: 800; color: #2563eb; }
    .company-tagline { font-size: 10px; color: #666; margin-bottom: 6px; }
    .company-details { font-size: 9px; color: #555; line-height: 1.2; }
    .invoice-box { text-align: right; background: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb; }
    .invoice-number { font-size: 20px; font-weight: 700; color: #2563eb; margin-bottom: 8px; }
    .invoice-date { font-size: 12px; color: #666; }
    .client-section { background: #f8fafc; padding: 10px; border-radius: 6px; margin-bottom: 12px; }
    .section-title { font-size: 14px; font-weight: 700; color: #2563eb; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
    .client-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 8px; font-size: 11px; }
    .items-table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 12px; background: #fff; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    .items-table th { background: #2563eb; color: #fff; padding: 6px; text-align: left; font-weight: 600; font-size: 10px; }
    .items-table th.numeric { text-align: right; }
    .items-table td { padding: 6px; border-bottom: 1px solid #e5e7eb; font-size: 10px; }
    .items-table tr:nth-child(even) { background: #f9fafb; }
    .numeric { text-align: right; font-family: 'Courier New', monospace; }
    .totals { display:flex; justify-content:flex-end; }
    .totals-box { min-width: 240px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; }
    .totals-row { display:flex; justify-content: space-between; font-size: 12px; margin: 4px 0; }
    .grand { background: #2563eb; color: #fff; border-radius: 6px; padding: 10px 12px; margin-top: 8px; text-align: right; }
    .grand .label { font-size: 10px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px; }
    .grand .amount { font-size: 18px; font-weight: 800; }
    .footer { margin-top: 12px; text-align:center; }
    .footer-text { font-size: 8px; color: #666; margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="company-name">JyotirSetu Astrology</div>
        <div class="company-tagline">Bridge to cosmic light</div>
        <div class="company-details">📧 guidance@jyotirsetu.com<br/>📱 +91-9266991298<br/>🌐 www.jyotirsetu.com</div>
      </div>
      <div class="invoice-box">
        <div class="invoice-number">INVOICE #${String(invoice.number)}</div>
        <div class="invoice-date">Date: ${formatDate(String(invoice.issue_date || invoice.created_at || new Date().toISOString()))}</div>
      </div>
    </div>
    <div class="client-section">
      <div class="section-title">Billing To</div>
      <div class="client-details">
        <div><strong>Name:</strong> ${String(client.name || '')}</div>
        <div><strong>Email:</strong> ${String(client.email || '')}</div>
        <div><strong>Phone:</strong> ${String(client.phone || '')}</div>
      </div>
    </div>
    <div class="section-title">Items</div>
    <table class="items-table">
      <thead>
        <tr>
          <th style="width:50%">Description</th>
          <th class="numeric" style="width:12%">Qty</th>
          <th class="numeric" style="width:18%">Unit Price</th>
          <th class="numeric" style="width:20%">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (it: any) => `<tr>
              <td>${String(it.title || '')}</td>
              <td class="numeric">${Number(it.qty || 0).toFixed(2).replace(/\.00$/, '')}</td>
              <td class="numeric">${formatCurrency(Number(it.unit_price || 0))}</td>
              <td class="numeric">${formatCurrency(Number(it.amount || 0))}</td>
            </tr>`
          )
          .join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-box">
        <div class="totals-row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
        <div class="totals-row"><span>GST</span><span>${formatCurrency(gstTotal)}</span></div>
        <div class="totals-row"><span>Rounding</span><span>${formatCurrency(rounding)}</span></div>
        <div class="grand"><div class="label">Grand Total</div><div class="amount">${formatCurrency(total)}</div></div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-text">This is a computer-generated invoice.</div>
    </div>
  </div>
</body>
</html>`;

    const isProd = ((import.meta as any).env?.PROD === true) || String((process as any)?.env?.VERCEL || '') === '1';
    let browser: import('puppeteer').Browser | import('puppeteer-core').Browser;
    if (isProd) {
      const chromiumMod = await import('@sparticuz/chromium');
      const cm = chromiumMod as any;
      const chromium = cm.default ?? (chromiumMod as any);
      const puppeteerCore = (await import('puppeteer-core')).default;
      const ep = chromium.executablePath;
      const executablePath = typeof ep === 'function' ? await ep() : ep;
      browser = await puppeteerCore.launch({ headless: true, args: chromium.args, executablePath });
    } else {
      const puppeteer = (await import('puppeteer')).default;
      browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    }
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' } });
      const u8 = pdf as Uint8Array;
      const stream = new ReadableStream({ start(controller) { controller.enqueue(u8); controller.close(); } });
      return new Response(stream, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="invoice_${String(invoice.number)}.pdf"` } });
    } finally {
      await browser.close();
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' }), { status: 500 });
  }
};

