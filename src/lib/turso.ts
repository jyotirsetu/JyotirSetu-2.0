export async function getTursoClient() {
  const mode = (import.meta.env && import.meta.env.MODE) || process.env.NODE_ENV || 'development';
  const url = (import.meta.env && import.meta.env.TURSO_DATABASE_URL) || process.env.TURSO_DATABASE_URL;
  const authToken = (import.meta.env && import.meta.env.TURSO_AUTH_TOKEN) || process.env.TURSO_AUTH_TOKEN;

  const { createClient } = await import('@libsql/client');

  if (url && authToken) {
    return createClient({ url, authToken });
  }

  if (mode !== 'production') {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const dataDir = path.join(process.cwd(), '.data');
    await fs.mkdir(dataDir, { recursive: true });
    const fileUrl = 'file:' + path.join(dataDir, 'dev.db');
    return createClient({ url: fileUrl });
  }

  throw new Error('Turso configuration missing. Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN');
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
  try {
    await client.execute(`ALTER TABLE appointments ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'`);
  } catch {
    /* column may already exist */
  }
  try {
    await client.execute(`ALTER TABLE appointments ADD COLUMN source TEXT NOT NULL DEFAULT 'system'`);
  } catch {
    /* column may already exist */
  }
  try {
    await client.execute(`ALTER TABLE appointments ADD COLUMN customer_appointment_id TEXT`);
  } catch {
    /* column may already exist */
  }
  try {
    await client.execute(`ALTER TABLE appointments ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'unpaid'`);
  } catch (e) {
    console.warn('appointments: add payment_status column skipped', e);
  }
  try {
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date)`);
  } catch {}
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
  try { await client.execute(`CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)`); } catch {}
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
  try {
    await client.execute(`ALTER TABLE follow_hub_events ADD COLUMN geo_location TEXT`);
  } catch {
    /* column may already exist */
  }
  try {
    await client.execute(`ALTER TABLE follow_hub_events ADD COLUMN original_ip TEXT`);
  } catch {
    /* column may already exist */
  }
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

export async function ensureAdminPreferencesTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS admin_preferences (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      user TEXT NOT NULL DEFAULT 'admin',
      updated_at TEXT NOT NULL
    );
  `);
}

export async function ensureNotificationsTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      message TEXT,
      type TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);
  try { await client.execute(`CREATE INDEX IF NOT EXISTS idx_notifications_read_created ON notifications(read, created_at)`); } catch {}
}

export async function ensureAutomationRulesTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS automation_rules (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      email TEXT NOT NULL,
      types TEXT NOT NULL,
      frequency TEXT NOT NULL,
      daily_time TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  try {
    await client.execute(`ALTER TABLE automation_rules ADD COLUMN last_sent_at TEXT`);
  } catch {
    /* ignore */
  }
}

export async function ensureClientsTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      vip TEXT NOT NULL DEFAULT 'no',
      created_at TEXT NOT NULL
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);`);
}

export async function ensurePaymentsTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      appointment_id TEXT,
      amount REAL NOT NULL,
      total_due REAL,
      balance REAL,
      entry_type TEXT NOT NULL DEFAULT 'credit',
      status TEXT NOT NULL DEFAULT 'unpaid',
      mode TEXT NOT NULL,
      reference TEXT,
      note TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_payments_client ON payments(client_id);`);
  try {
    await client.execute(`ALTER TABLE payments ADD COLUMN total_due REAL`);
  } catch (e) {
    console.warn('payments: add total_due column skipped', e);
  }
  try {
    await client.execute(`ALTER TABLE payments ADD COLUMN balance REAL`);
  } catch (e) {
    console.warn('payments: add balance column skipped', e);
  }
  try {
    await client.execute(`ALTER TABLE payments ADD COLUMN entry_type TEXT NOT NULL DEFAULT 'credit'`);
  } catch (e) {
    console.warn('payments: add entry_type column skipped', e);
  }
  try {
    await client.execute(`ALTER TABLE payments ADD COLUMN status TEXT NOT NULL DEFAULT 'unpaid'`);
  } catch (e) {
    console.warn('payments: add status column skipped', e);
  }
}

export async function ensureInvoicesTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      number TEXT UNIQUE,
      client_id TEXT NOT NULL,
      appointment_id TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      issue_date TEXT NOT NULL,
      due_date TEXT,
      subtotal REAL NOT NULL DEFAULT 0,
      gst_total REAL NOT NULL DEFAULT 0,
      rounding REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL DEFAULT 0,
      total_in_words TEXT,
      pdf_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);`);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(number);`);
}

export async function ensureInvoiceItemsTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id TEXT PRIMARY KEY,
      invoice_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      qty REAL NOT NULL,
      unit_price REAL NOT NULL,
      discount REAL NOT NULL DEFAULT 0,
      gst_rate REAL NOT NULL DEFAULT 0,
      hsn_sac TEXT,
      amount REAL NOT NULL,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id)
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);`);
}

export async function ensureServicesTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      image TEXT,
      price REAL NOT NULL,
      default_gst REAL NOT NULL DEFAULT 0,
      hsn_sac TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_services_title ON services(title);`);
}

export async function ensureInvoicePaymentsTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS invoice_payments (
      id TEXT PRIMARY KEY,
      invoice_id TEXT NOT NULL,
      amount REAL NOT NULL,
      method TEXT NOT NULL,
      reference TEXT,
      date TEXT NOT NULL,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'recorded',
      created_at TEXT NOT NULL,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id)
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_invoice_payments_invoice ON invoice_payments(invoice_id);`);
}

export async function ensureLedgerTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS ledger_entries (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      invoice_id TEXT,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      balance REAL,
      date TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_ledger_client_date ON ledger_entries(client_id, date);`);
}

export async function ensureQuotesTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY,
      number TEXT UNIQUE,
      client_name TEXT NOT NULL,
      client_email TEXT NOT NULL,
      client_phone TEXT,
      status TEXT NOT NULL DEFAULT 'NC',
      total REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(client_email);`);
}

export async function ensureQuoteItemsTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS quote_items (
      id TEXT PRIMARY KEY,
      quote_id TEXT NOT NULL,
      title TEXT NOT NULL,
      carat REAL NOT NULL,
      rate_per_carat REAL NOT NULL,
      amount REAL NOT NULL,
      FOREIGN KEY (quote_id) REFERENCES quotes(id)
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_quote_items_quote ON quote_items(quote_id);`);
}
