export async function getTursoClient() {
  const url = (import.meta.env && import.meta.env.TURSO_DATABASE_URL) || process.env.TURSO_DATABASE_URL;
  const authToken = (import.meta.env && import.meta.env.TURSO_AUTH_TOKEN) || process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error('Turso configuration missing. Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN');
  }

  const { createClient } = await import('@libsql/client');
  return createClient({ url, authToken });
}

export async function ensureAppointmentsTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      service TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      consultation_method TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      message TEXT,
      service_details TEXT,
      source TEXT NOT NULL DEFAULT 'system',
      created_at TEXT NOT NULL
    );
  `);
  try { await client.execute(`ALTER TABLE appointments ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'`); } catch {}
  try { await client.execute(`ALTER TABLE appointments ADD COLUMN source TEXT NOT NULL DEFAULT 'system'`); } catch {}
}

export async function ensureContactsTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      priority TEXT NOT NULL DEFAULT 'normal',
      created_at TEXT NOT NULL
    );
  `);
}

export async function ensureTemplatesTables() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS email_templates (
      key TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      html TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS whatsapp_templates (
      key TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

export async function ensureEmailHistoryTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS email_history (
      id TEXT PRIMARY KEY,
      recipient_email TEXT NOT NULL,
      recipient_name TEXT,
      subject TEXT NOT NULL,
      type TEXT NOT NULL,
      related_id TEXT,
      related_type TEXT,
      status TEXT NOT NULL DEFAULT 'sent',
      sent_at TEXT NOT NULL,
      opened_at TEXT,
      error_message TEXT
    );
  `);
}

export async function ensureActivityLogTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      user TEXT NOT NULL DEFAULT 'admin',
      details TEXT,
      created_at TEXT NOT NULL
    );
  `);
}

export async function ensureNotesTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      note_text TEXT NOT NULL,
      created_by TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL
    );
  `);
}


