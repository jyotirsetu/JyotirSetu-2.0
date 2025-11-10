import type { APIRoute } from 'astro';
import { ensureContactsTable, getTursoClient } from '../../lib/turso';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    await ensureContactsTable();
    const client = await getTursoClient();
    interface ContactBody {
      name: string;
      email: string;
      subject: string;
      message: string;
      phone?: string;
    }
    const contactData = (await request.json()) as Partial<ContactBody>;

    const required = ['name', 'email', 'subject', 'message'];
    for (const field of required as Array<keyof ContactBody>) {
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
        contactData.name!,
        contactData.email!,
        contactData.phone || '',
        contactData.subject!,
        contactData.message!,
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
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({
      success: false,
      message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
