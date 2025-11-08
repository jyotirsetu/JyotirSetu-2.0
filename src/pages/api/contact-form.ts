import type { APIRoute } from 'astro';
import { ensureContactsTable, getTursoClient } from '../../lib/turso';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    await ensureContactsTable();
    const client = await getTursoClient();
    const contactData = await request.json();

    const required = ['name', 'email', 'subject', 'message'];
    for (const field of required) {
      if (!contactData[field]) {
        return new Response(JSON.stringify({ success: false, message: `${field} is required` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    const id = 'c_' + Date.now() + Math.random().toString(36).slice(2,10);
    const now = new Date().toISOString();
    await client.execute({
      sql: `INSERT INTO contacts (id, name, email, phone, subject, message, status, priority, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'new', 'normal', ?)` ,
      args: [
        id,
        contactData.name,
        contactData.email,
        contactData.phone || '',
        contactData.subject,
        contactData.message,
        now
      ]
    });

    // (Optional) insert email sending logic here if needed

    return new Response(JSON.stringify({
      success: true,
      message: 'Contact message received',
      id
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({
      success: false,
      message: e.message || 'failed',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
