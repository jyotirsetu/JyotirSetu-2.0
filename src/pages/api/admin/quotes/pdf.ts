import type { APIRoute } from 'astro';
// Use puppeteer in dev, puppeteer-core + @sparticuz/chromium in production/serverless
import { getTursoClient } from '../../../../lib/turso';

function formatCurrency(amount: number | null): string {
  if (amount === null || amount === undefined) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Quote ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch quote data
    const client = await getTursoClient();
    const [quoteRes, itemsRes] = await Promise.all([
      client.execute({
        sql: `SELECT id, number, client_name, client_email, client_phone, status, total, created_at, updated_at 
              FROM quotes WHERE id = ? LIMIT 1`,
        args: [String(id)],
      }),
      client.execute({
        sql: `SELECT id, title, carat, rate_per_carat, amount 
              FROM quote_items WHERE quote_id = ? ORDER BY rowid ASC`,
        args: [String(id)],
      }),
    ]);

    const quote = quoteRes.rows?.[0];
    const items = itemsRes.rows || [];

    if (!quote) {
      return new Response(JSON.stringify({ error: 'Quote not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate HTML for PDF
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quotation #${quote.number}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 15px 15px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #2563eb;
        }
        
        .company-info {
            flex: 1;
        }
        
        .company-name {
            font-size: 20px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 2px;
        }
        
        .company-tagline {
            font-size: 10px;
            color: #666;
            margin-bottom: 6px;
        }
        
        .company-details {
            font-size: 9px;
            color: #555;
            line-height: 1.2;
        }
        
        .quote-info {
            text-align: right;
            background: #f8fafc;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #2563eb;
        }
        
        .quote-number {
            font-size: 20px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 8px;
        }
        
        .quote-date {
            font-size: 12px;
            color: #666;
        }
        
        .client-section {
            background: #f8fafc;
            padding: 10px;
            border-radius: 6px;
            margin-bottom: 15px;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .client-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 10px;
        }
        
        .detail-item {
            display: flex;
            align-items: center;
        }
        
        .detail-label {
            font-weight: 600;
            color: #555;
            margin-right: 8px;
            min-width: 50px;
            font-size: 11px;
        }
        
        .detail-value {
            color: #333;
            font-size: 11px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            background: white;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }
        
        .items-table th {
            background: #2563eb;
            color: white;
            padding: 6px;
            text-align: left;
            font-weight: 600;
            font-size: 10px;
        }
        
        .items-table td {
            padding: 6px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 10px;
        }
        
        .items-table tr:last-child td {
            border-bottom: none;
        }
        
        .items-table tr:nth-child(even) {
            background: #f9fafb;
        }
        
        .particular-cell {
            font-weight: 500;
        }
        
        .numeric-cell {
            text-align: right;
            font-family: 'Courier New', monospace;
        }
        
        .total-row {
            background: #e0f2fe !important;
            font-weight: bold;
        }
        
        .grand-total {
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
        }
        
        .grand-total-box {
            background: #2563eb;
            color: white;
            padding: 10px 15px;
            border-radius: 6px;
            text-align: right;
            min-width: 180px;
        }
        
        .grand-total-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 2px;
            opacity: 0.9;
        }
        
        .grand-total-amount {
            font-size: 18px;
            font-weight: bold;
        }
        
        .terms-section {
            margin-top: 15px;
            padding: 10px;
            background: #fef3c7;
            border-radius: 6px;
            border-left: 4px solid #f59e0b;
        }
        
        .terms-title {
            font-size: 12px;
            font-weight: bold;
            color: #92400e;
            margin-bottom: 6px;
        }
        
        .terms-content {
            font-size: 9px;
            color: #78350f;
            line-height: 1.3;
        }
        
        .terms-content p {
            margin-bottom: 2px;
        }
        
        .price-lock-notice {
            margin-top: 10px;
            padding: 8px;
            background: #fee2e2;
            border-radius: 6px;
            border-left: 4px solid #ef4444;
        }
        
        .price-lock-title {
            font-size: 11px;
            font-weight: bold;
            color: #b91c1c;
            margin-bottom: 3px;
        }
        
        .price-lock-text {
            font-size: 8px;
            color: #7f1d1d;
            line-height: 1.2;
        }
        
        .footer {
            margin-top: 15px;
            text-align: center;
        }
        
        .footer-text {
            font-size: 8px;
            color: #666;
            margin-bottom: 5px;
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px solid #e5e7eb;
        }
        
        .thank-you {
            font-size: 14px;
            font-weight: bold;
            color: #2563eb;
            margin-top: 6px;
        }
        
        @media print {
            .container {
                padding: 20px;
            }
            
            .header {
                page-break-inside: avoid;
            }
            
            .items-table {
                page-break-inside: auto;
            }
            
            .items-table tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="company-info">
                <div class="company-name">JyotirSetu Astrology</div>
                <div class="company-tagline">Bridge to comic light</div>
                <div class="company-details">
                    📧 guidance@jyotirsetu.com<br>
                    📱 +91-9266991298<br>
                    🌐 www.jyotirsetu.com
                </div>
            </div>
            <div class="quote-info">
                <div class="quote-number">QUOTATION #${quote.number}</div>
                <div class="quote-date">Date: ${formatDate(String(quote.created_at))}</div>
            </div>
        </div>

        <div class="client-section">
            <div class="section-title">Client Information</div>
            <div class="client-details">
                <div class="detail-item">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${quote.client_name}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${quote.client_email}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${quote.client_phone}</span>
                </div>
            </div>
        </div>

        <div class="section-title">Quotation Details</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 50%;">Particular</th>
                    <th style="width: 15%;" class="numeric-cell">Unit</th>
                    <th style="width: 20%;" class="numeric-cell">Unit Price</th>
                    <th style="width: 15%;" class="numeric-cell">Total</th>
                </tr>
            </thead>
            <tbody>
                ${items
                  .map(
                    (item) => `
                <tr>
                    <td class="particular-cell">${item.title}</td>
                    <td class="numeric-cell">${item.carat}</td>
                    <td class="numeric-cell">${formatCurrency(Number(item.rate_per_carat))}</td>
                    <td class="numeric-cell">${formatCurrency(Number(item.amount))}</td>
                </tr>
                `
                  )
                  .join('')}
            </tbody>
        </table>

        <div class="grand-total">
            <div class="grand-total-box">
                <div class="grand-total-label">Grand Total</div>
                <div class="grand-total-amount">${formatCurrency(Number(quote.total))}</div>
            </div>
        </div>

        <div class="footer">
            <div class="terms-section">
                <div class="terms-title">Terms & Conditions</div>
                <div class="terms-content">
                    <p>• This quotation is valid for 7 days from the date of issue.</p>
                    <p>• Prices are subject to change without prior notice after the validity period.</p>
                    <p>• 50% advance payment is required to confirm the order.</p>
                    <p>• Goods will be dispatched only after full payment realization.</p>
                    <p>• All disputes are subject to Delhi jurisdiction.</p>
                    <p>• Gemstones are natural products and slight variations in color and size are inherent.</p>
                </div>
                
                <div class="price-lock-notice">
                    <div class="price-lock-title">⚠️ Price Lock Notice</div>
                    <div class="price-lock-text">
                        The prices mentioned in this quotation are locked/confirmed only upon receipt of advance payment. 
                        Until advance or full payment is received, these prices are subject to market fluctuations and 
                        may change without prior notice. Please make the payment to secure these rates.
                    </div>
                </div>
            </div>
            
            <div class="footer-text">
                This is a computer-generated quotation and does not require a signature.
            </div>
            <div class="thank-you">
                Thank you for choosing JyotirSetu Astrology! 🙏
            </div>
        </div>
    </div>
</body>
</html>
    `;

    // Generate PDF
    const isProd = (import.meta as unknown as { env?: Record<string, unknown> }).env?.PROD === true ||
      String(((process as unknown as { env?: Record<string, unknown> }).env || {}).VERCEL || '') === '1';

    let browser: import('puppeteer-core').Browser | import('puppeteer').Browser;
    if (isProd) {
      const chromium = await import('@sparticuz/chromium');
      const puppeteerCore = (await import('puppeteer-core')).default;
      const executablePath = await chromium.executablePath();
      browser = await puppeteerCore.launch({
        headless: true,
        args: chromium.args,
        executablePath: executablePath || undefined,
        defaultViewport: chromium.defaultViewport,
      });
    } else {
      const puppeteer = (await import('puppeteer')).default;
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '12mm',
          right: '12mm',
          bottom: '12mm',
          left: '12mm',
        },
      });

      return new Response(pdf, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="quotation_${quote.number}.pdf"`,
        },
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
