import type { APIRoute } from 'astro';
import { getTursoClient } from '../../../lib/turso';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').trim();
    if (!q || q.length < 2) {
      return new Response(JSON.stringify({ ok: true, data: [] }), { headers: { 'Content-Type': 'application/json' } });
    }

    const client = await getTursoClient();
    const term = `%${q}%`;
    const clientResults: Record<string, unknown>[] = [];
    const relatedResults: Record<string, unknown>[] = [];

    // Search Clients (Primary)
    try {
      const clients = await client.execute({
        sql: `SELECT id, name, email, phone, vip, status, company_name, city, zip, created_at FROM clients 
              WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR id LIKE ? OR company_name LIKE ? OR city LIKE ? OR zip LIKE ?
              ORDER BY 
                CASE 
                  WHEN name LIKE ? THEN 1 
                  WHEN email = ? THEN 2
                  WHEN company_name LIKE ? THEN 3
                  ELSE 4 
                END,
                created_at DESC LIMIT 10`,
        args: [term, term, term, term, term, term, term, `${q}%`, q, `${q}%`],
      });
      clients.rows.forEach((r) => {
        // Format ID as CL-XXXXXX (using first 6 chars of UUID/ID)
        const displayId = `CL-${String(r.id).slice(0, 6).toUpperCase()}`;
        const company = r.company_name ? ` • ${r.company_name}` : '';
        const location = r.city ? ` • ${r.city}` : '';
        
        clientResults.push({
          type: 'client',
          id: r.id,
          displayId,
          title: String(r.name || 'Unknown Client'),
          subtitle: `${String(r.email || r.phone || 'No contact info')}${company}${location}`,
          extra: {
            id: r.id,
            displayId,
            phone: r.phone,
            vip: r.vip,
            status: r.status || 'active',
            initials: String(r.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
          },
          url: r.phone ? `/admin/client360?phone=${encodeURIComponent(String(r.phone))}` : `/admin/client360?id=${r.id}`,
          date: r.created_at,
          score: 10 // High score for clients
        });
      });
    } catch (e) { 
       console.error('Client search error:', e); 
    }

    // Search contacts (Legacy / Leads)
    try {
      const contacts = await client.execute({
        sql: `SELECT id, name, email, phone, created_at FROM contacts 
              WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? 
              ORDER BY created_at DESC LIMIT 3`,
        args: [term, term, term],
      });
      contacts.rows.forEach((r) => {
        // Only add if not already in client results (simple dedup by email if possible, but IDs are different)
        relatedResults.push({
          type: 'contact',
          id: r.id,
          title: String(r.name || r.email || 'Unknown Contact'),
          subtitle: String(r.email || r.phone || ''),
          url: r.phone ? `/admin/client360?phone=${encodeURIComponent(String(r.phone))}` : `/admin/client360?id=${r.id}`, // Reuse Client 360 for now
          date: r.created_at,
          score: 5
        });
      });
    } catch { /* ignore */ }

    // Search appointments
    try {
      const appts = await client.execute({
        sql: `SELECT id, name, email, phone, date, created_at FROM appointments 
              WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? 
              ORDER BY created_at DESC LIMIT 3`,
        args: [term, term, term],
      });
      appts.rows.forEach((r) => {
        relatedResults.push({
          type: 'appointment',
          id: r.id,
          title: `Appt: ${r.name}`,
          subtitle: `${r.date} • ${r.email}`,
          url: `/admin/appointments?highlight=${r.id}`,
          date: r.created_at,
          score: 4
        });
      });
    } catch { /* ignore */ }

    // Search quotes
    try {
      const quotes = await client.execute({
        sql: `SELECT id, number, client_name, client_email, total, created_at FROM quotes 
              WHERE client_name LIKE ? OR client_email LIKE ? OR number LIKE ? 
              ORDER BY created_at DESC LIMIT 3`,
        args: [term, term, term],
      });
      quotes.rows.forEach((r) => {
        relatedResults.push({
          type: 'quote',
          id: r.id,
          title: `Quote #${r.number} - ${r.client_name}`,
          subtitle: `₹${r.total} • ${r.client_email}`,
          url: `/admin/quotes?highlight=${r.id}`,
          date: r.created_at,
          score: 3
        });
      });
    } catch { 
       // Fallback for older schema if 'quotations' exists instead
       try {
          const quotesOld = await client.execute({
            sql: `SELECT id, number, client_name, client_email, total_amount, created_at FROM quotations 
                  WHERE client_name LIKE ? OR client_email LIKE ? OR number LIKE ? 
                  ORDER BY created_at DESC LIMIT 3`,
            args: [term, term, term],
          });
          quotesOld.rows.forEach((r) => {
            relatedResults.push({
              type: 'quote',
              id: r.id,
              title: `Quote #${r.number} - ${r.client_name}`,
              subtitle: `₹${r.total_amount} • ${r.client_email}`,
              url: `/admin/quotes?highlight=${r.id}`,
              date: r.created_at,
              score: 3
            });
          });
       } catch { /* ignore */ }
    }

    // Combine: Clients first, then others sorted by date
    const finalResults = [
      ...clientResults,
      ...relatedResults.sort((a, b) => new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime())
    ];

    return new Response(JSON.stringify({ ok: true, data: finalResults.slice(0, 15) }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};
