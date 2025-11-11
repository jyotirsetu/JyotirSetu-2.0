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
      customer_appointment_id TEXT,
      created_at TEXT NOT NULL
    );
  `);
  try { await client.execute(`ALTER TABLE appointments ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'`); } catch { /* column may already exist */ }
  try { await client.execute(`ALTER TABLE appointments ADD COLUMN source TEXT NOT NULL DEFAULT 'system'`); } catch { /* column may already exist */ }
  try { await client.execute(`ALTER TABLE appointments ADD COLUMN customer_appointment_id TEXT`); } catch { /* column may already exist */ }
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

export async function ensureNewsletterSubscribersTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      subscribed_at TEXT NOT NULL
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

export async function ensureWhatsAppHistoryTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS whatsapp_history (
      id TEXT PRIMARY KEY,
      recipient_phone TEXT NOT NULL,
      recipient_name TEXT,
      message TEXT NOT NULL,
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

export async function ensureFollowHubEventsTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS follow_hub_events (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      created_at TIMESTAMP DEFAULT current_timestamp,
      event_type TEXT,
      source TEXT,
      medium TEXT,
      campaign TEXT,
      device TEXT,
      platform TEXT,
      user_agent TEXT,
      ip_address TEXT,
      primary_cta_shown TEXT,
      cta_clicked TEXT,
      cta_variant TEXT,
      page_url TEXT,
      utm_query TEXT,
      extra JSON
    );
  `);
  await client.execute(`
    CREATE INDEX IF NOT EXISTS idx_follow_hub_events_created_at ON follow_hub_events(created_at);
  `);
}

export async function ensureFollowHubSettingsTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS follow_hub_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

export async function ensureSavedViewsTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS saved_views (
      id TEXT PRIMARY KEY,
      user TEXT NOT NULL DEFAULT 'admin',
      page TEXT NOT NULL,
      name TEXT NOT NULL,
      filters TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  await client.execute(`
    CREATE INDEX IF NOT EXISTS idx_saved_views_user_page ON saved_views(user, page);
  `);
}


