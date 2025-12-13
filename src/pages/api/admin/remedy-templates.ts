import type { APIRoute } from 'astro';
import { getTursoClient, ensureRemedyTemplatesTable } from '../../../lib/turso';

export const GET: APIRoute = async () => {
  try {
    await ensureRemedyTemplatesTable();
    const client = await getTursoClient();
    const result = await client.execute('SELECT * FROM remedy_templates ORDER BY title ASC');
    
    return new Response(JSON.stringify(result.rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: errorMessage }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await ensureRemedyTemplatesTable();
    const data = await request.json();
    const { title, content, category } = data;

    const id = `rt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();

    const client = await getTursoClient();
    await client.execute({
      sql: `INSERT INTO remedy_templates (id, title, content, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [id, title, content, category || 'General', now, now],
    });

    return new Response(JSON.stringify({ ok: true, id }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: errorMessage }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    await ensureRemedyTemplatesTable();
    const data = await request.json();
    const { id, title, content, category } = data;

    if (!id) {
        return new Response(JSON.stringify({ ok: false, error: 'Missing ID' }), { status: 400 });
    }

    const now = new Date().toISOString();
    const client = await getTursoClient();
    
    // Build dynamic update query
    let sql = 'UPDATE remedy_templates SET updated_at = ?';
    const args: (string | number | null)[] = [now];

    if (title) {
        sql += ', title = ?';
        args.push(title);
    }
    if (content) {
        sql += ', content = ?';
        args.push(content);
    }
    if (category) {
        sql += ', category = ?';
        args.push(category);
    }

    sql += ' WHERE id = ?';
    args.push(id);

    await client.execute({ sql, args });

    return new Response(JSON.stringify({ ok: true }), {
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
      return new Response(JSON.stringify({ ok: false, error: 'Missing ID' }), { status: 400 });
    }

    const client = await getTursoClient();
    await client.execute({
      sql: 'DELETE FROM remedy_templates WHERE id = ?',
      args: [id],
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: errorMessage }), { status: 500 });
  }
};
