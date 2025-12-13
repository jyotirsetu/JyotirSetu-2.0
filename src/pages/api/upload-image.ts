
import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file found' }), { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    
    // Determine upload directory
    // In dev/build, public is usually at root
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    try {
        await fs.access(uploadDir);
    } catch {
        await fs.mkdir(uploadDir, { recursive: true });
    }

    await fs.writeFile(path.join(uploadDir, filename), buffer);

    return new Response(JSON.stringify({ location: `/uploads/${filename}` }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: 'Upload failed: ' + (error as Error).message }), { status: 500 });
  }
};
