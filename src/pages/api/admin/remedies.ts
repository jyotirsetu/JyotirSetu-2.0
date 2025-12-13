import type { APIRoute } from 'astro';
import { getTursoClient, ensureRemediesTable } from '../../../lib/turso';
import { logActivity } from '../../../lib/activity-logger';

export const POST: APIRoute = async ({ request }) => {
  try {
    await ensureRemediesTable();
    const data = await request.json();
    const { appointment_id, customer_name, customer_email, customer_phone, astrologer_name, heading, content, dob, tob, pob, rasi, nakshatra, lagna, customer_appointment_id } = data;

    const id = `rem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const share_token = Math.random().toString(36).substr(2, 12);
    const created_at = new Date().toISOString();
    const updated_at = created_at;

    const client = await getTursoClient();
    await client.execute({
      sql: `INSERT INTO remedies (id, appointment_id, customer_name, customer_email, customer_phone, astrologer_name, heading, content, share_token, created_at, updated_at, dob, tob, pob, rasi, nakshatra, lagna, customer_appointment_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        appointment_id || null,
        customer_name,
        customer_email || null,
        customer_phone || null,
        astrologer_name,
        heading,
        content,
        share_token,
        created_at,
        updated_at,
        dob || null,
        tob || null,
        pob || null,
        rasi || null,
        nakshatra || null,
        lagna || null,
        customer_appointment_id || null
      ],
    });

    try {
      await logActivity('created', 'remedy', id, `Created remedy for ${customer_name}`);
    } catch (err) {
      console.error('Failed to log activity:', err);
    }

    return new Response(JSON.stringify({ ok: true, id, share_token }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: errorMessage }), { status: 500 });
  }
};

export const GET: APIRoute = async () => {
  try {
    await ensureRemediesTable();
    const client = await getTursoClient();
    const result = await client.execute('SELECT * FROM remedies ORDER BY created_at DESC');
    
    return new Response(JSON.stringify(result.rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: errorMessage }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ ok: false, error: 'ID required' }), { status: 400 });
    }

    const client = await getTursoClient();
    await client.execute({
      sql: 'DELETE FROM remedies WHERE id = ?',
      args: [id],
    });

    try {
      await logActivity('deleted', 'remedy', id, 'Deleted remedy');
    } catch (err) {
      console.error('Failed to log activity:', err);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: errorMessage }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { id, customer_name, customer_email, customer_phone, heading, content, dob, tob, pob, rasi, nakshatra, lagna, customer_appointment_id } = data;

    if (!id) {
      return new Response(JSON.stringify({ ok: false, error: 'ID required' }), { status: 400 });
    }

    const updated_at = new Date().toISOString();
    const client = await getTursoClient();
    
    await client.execute({
      sql: `UPDATE remedies SET 
            customer_name = ?, 
            customer_email = ?, 
            customer_phone = ?, 
            heading = ?, 
            content = ?, 
            updated_at = ?,
            dob = ?,
            tob = ?,
            pob = ?,
            rasi = ?,
            nakshatra = ?,
            lagna = ?,
            customer_appointment_id = ?
            WHERE id = ?`,
      args: [
        customer_name,
        customer_email || null,
        customer_phone || null,
        heading,
        content,
        updated_at,
        dob || null,
        tob || null,
        pob || null,
        rasi || null,
        nakshatra || null,
        lagna || null,
        customer_appointment_id || null,
        id
      ],
    });

    try {
      await logActivity('updated', 'remedy', id, `Updated remedy for ${customer_name}`);
    } catch (err) {
      console.error('Failed to log activity:', err);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: errorMessage }), { status: 500 });
  }
};
