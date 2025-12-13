import type { Client } from '@libsql/client';

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

async function columnExists(client: Client, table: string, column: string) {
  try {
    const res = await client.execute({ sql: `PRAGMA table_info(${table})`, args: [] });
    const rows = (res.rows || []) as Array<Record<string, unknown>>;
    return rows.some((r) => String(r.name || '') === column);
  } catch {
    return false;
  }
}

async function addColumnIfMissing(client: Client, table: string, column: string, alterSql: string) {
  try {
    const exists = await columnExists(client, table, column);
    if (!exists) {
      await client.execute(alterSql);
    }
  } catch {
    /* ignore */
  }
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
  await addColumnIfMissing(client, 'appointments', 'status', `ALTER TABLE appointments ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'`);
  await addColumnIfMissing(client, 'appointments', 'source', `ALTER TABLE appointments ADD COLUMN source TEXT NOT NULL DEFAULT 'system'`);
  await addColumnIfMissing(client, 'appointments', 'customer_appointment_id', `ALTER TABLE appointments ADD COLUMN customer_appointment_id TEXT`);
  await addColumnIfMissing(client, 'appointments', 'payment_status', `ALTER TABLE appointments ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'unpaid'`);
  await addColumnIfMissing(client, 'appointments', 'customer_name', `ALTER TABLE appointments ADD COLUMN customer_name TEXT`);
  await addColumnIfMissing(client, 'appointments', 'customer_email', `ALTER TABLE appointments ADD COLUMN customer_email TEXT`);
  await addColumnIfMissing(client, 'appointments', 'customer_phone', `ALTER TABLE appointments ADD COLUMN customer_phone TEXT`);
  
  // Backfill new columns from existing data
  try {
    await client.execute(`UPDATE appointments SET customer_name = name WHERE customer_name IS NULL AND name IS NOT NULL`);
    await client.execute(`UPDATE appointments SET customer_email = email WHERE customer_email IS NULL AND email IS NOT NULL`);
    await client.execute(`UPDATE appointments SET customer_phone = phone WHERE customer_phone IS NULL AND phone IS NOT NULL`);
  } catch { void 0; }

  try {
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date)`);
  } catch { void 0; }
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
  try { await client.execute(`CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)`); } catch { void 0; }
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
  try { await client.execute(`CREATE INDEX IF NOT EXISTS idx_notifications_read_created ON notifications(read, created_at)`); } catch { void 0; }
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
      status TEXT NOT NULL DEFAULT 'active',
      company_name TEXT,
      address_line1 TEXT,
      address_line2 TEXT,
      city TEXT,
      state TEXT,
      zip TEXT,
      country TEXT,
      created_at TEXT NOT NULL
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);`);
  await addColumnIfMissing(client, 'clients', 'status', `ALTER TABLE clients ADD COLUMN status TEXT NOT NULL DEFAULT 'active'`);
  await addColumnIfMissing(client, 'clients', 'company_name', `ALTER TABLE clients ADD COLUMN company_name TEXT`);
  await addColumnIfMissing(client, 'clients', 'address_line1', `ALTER TABLE clients ADD COLUMN address_line1 TEXT`);
  await addColumnIfMissing(client, 'clients', 'address_line2', `ALTER TABLE clients ADD COLUMN address_line2 TEXT`);
  await addColumnIfMissing(client, 'clients', 'city', `ALTER TABLE clients ADD COLUMN city TEXT`);
  await addColumnIfMissing(client, 'clients', 'state', `ALTER TABLE clients ADD COLUMN state TEXT`);
  await addColumnIfMissing(client, 'clients', 'zip', `ALTER TABLE clients ADD COLUMN zip TEXT`);
  await addColumnIfMissing(client, 'clients', 'country', `ALTER TABLE clients ADD COLUMN country TEXT`);

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
  await addColumnIfMissing(client, 'payments', 'total_due', `ALTER TABLE payments ADD COLUMN total_due REAL`);
  await addColumnIfMissing(client, 'payments', 'balance', `ALTER TABLE payments ADD COLUMN balance REAL`);
  await addColumnIfMissing(client, 'payments', 'entry_type', `ALTER TABLE payments ADD COLUMN entry_type TEXT NOT NULL DEFAULT 'credit'`);
  await addColumnIfMissing(client, 'payments', 'status', `ALTER TABLE payments ADD COLUMN status TEXT NOT NULL DEFAULT 'unpaid'`);
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
      purchased_amount REAL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(client_email);`);
  try {
    await client.execute(`ALTER TABLE quotes ADD COLUMN purchased_amount REAL`);
  } catch { void 0; }
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

export async function ensureLeadsTables() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      source TEXT NOT NULL DEFAULT 'manual',
      stage TEXT NOT NULL DEFAULT 'prospect',
      owner TEXT NOT NULL DEFAULT 'admin',
      tags TEXT,
      score INTEGER NOT NULL DEFAULT 0,
      next_action_at TEXT,
      last_contacted_at TEXT,
      sla_due_at TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);`);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_leads_owner ON leads(owner);`);
  try { await client.execute(`ALTER TABLE leads ADD COLUMN tags TEXT`); } catch { void 0; }
  try { await client.execute(`ALTER TABLE leads ADD COLUMN score INTEGER NOT NULL DEFAULT 0`); } catch { void 0; }
  try { await client.execute(`ALTER TABLE leads ADD COLUMN next_action_at TEXT`); } catch { void 0; }
  try { await client.execute(`ALTER TABLE leads ADD COLUMN last_contacted_at TEXT`); } catch { void 0; }
  try { await client.execute(`CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score)`); } catch { void 0; }
  try { await client.execute(`CREATE INDEX IF NOT EXISTS idx_leads_next_action ON leads(next_action_at)`); } catch { void 0; }
  await client.execute(`
    CREATE TABLE IF NOT EXISTS lead_stage_history (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL,
      from_stage TEXT,
      to_stage TEXT NOT NULL,
      changed_at TEXT NOT NULL,
      changed_by TEXT NOT NULL DEFAULT 'admin',
      note TEXT,
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_lead_history_lead ON lead_stage_history(lead_id);`);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS lead_notes (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL,
      note TEXT NOT NULL,
      created_at TEXT NOT NULL,
      created_by TEXT NOT NULL DEFAULT 'admin',
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_lead_notes_lead ON lead_notes(lead_id);`);
}


export async function ensureFulfillmentTables() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS fulfillment_tasks (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      service TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      due_date TEXT,
      checklist JSON,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_fulfillment_client ON fulfillment_tasks(client_id);`);
}

export async function ensureDocumentsTables() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      client_id TEXT,
      entity_type TEXT,
      entity_id TEXT,
      title TEXT NOT NULL,
      mime_type TEXT,
      size INTEGER,
      storage_url TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_documents_entity ON documents(entity_type, entity_id);`);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS consent_forms (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      form_title TEXT NOT NULL,
      signed_at TEXT,
      file_url TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );
  `);
}

export async function ensureStaffTables() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS staff (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'consultant',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);`);
}

export async function ensureUsersTables() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'support',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);`);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS admin_permissions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      permission TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES admin_users(id)
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_admin_permissions_user ON admin_permissions(user_id);`);
}

export async function ensureDocumentShareTables() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS document_share_links (
      token TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      expires_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (document_id) REFERENCES documents(id)
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_doc_share_expires ON document_share_links(expires_at);`);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS document_downloads (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      by_user TEXT,
      downloaded_at TEXT NOT NULL,
      ip TEXT,
      FOREIGN KEY (document_id) REFERENCES documents(id)
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_doc_downloads_doc ON document_downloads(document_id);`);
}

export async function ensureClientHoroscopesTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS client_horoscopes (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      name TEXT NOT NULL,
      relation TEXT NOT NULL DEFAULT 'self',
      gender TEXT,
      dob TEXT,
      tob TEXT,
      pob TEXT,
      latitude REAL,
      longitude REAL,
      timezone TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_client_horoscopes_client ON client_horoscopes(client_id);`);
}

export async function ensureRemediesTable() {
  const client = await getTursoClient();
  
  // Check if we have the old schema (missing share_token)
  const hasShareToken = await columnExists(client, 'remedies', 'share_token');
  const tableExists = await columnExists(client, 'remedies', 'id'); // Check if table exists at all
  
  if (tableExists && !hasShareToken) {
    // Rename old table to backup
    try {
      await client.execute(`ALTER TABLE remedies RENAME TO remedies_backup_${Date.now()}`);
    } catch (e) {
      console.error('Failed to rename old remedies table', e);
    }
  }

  await client.execute(`
    CREATE TABLE IF NOT EXISTS remedies (
      id TEXT PRIMARY KEY,
      appointment_id TEXT,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      customer_phone TEXT,
      astrologer_name TEXT,
      heading TEXT,
      content JSON,
      share_token TEXT UNIQUE,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_remedies_share_token ON remedies(share_token);`);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_remedies_created_at ON remedies(created_at);`);
  
  // Add new columns for horoscope details
  await addColumnIfMissing(client, 'remedies', 'dob', `ALTER TABLE remedies ADD COLUMN dob TEXT`);
  await addColumnIfMissing(client, 'remedies', 'tob', `ALTER TABLE remedies ADD COLUMN tob TEXT`);
  await addColumnIfMissing(client, 'remedies', 'pob', `ALTER TABLE remedies ADD COLUMN pob TEXT`);
  await addColumnIfMissing(client, 'remedies', 'rasi', `ALTER TABLE remedies ADD COLUMN rasi TEXT`);
  await addColumnIfMissing(client, 'remedies', 'nakshatra', `ALTER TABLE remedies ADD COLUMN nakshatra TEXT`);
  await addColumnIfMissing(client, 'remedies', 'lagna', `ALTER TABLE remedies ADD COLUMN lagna TEXT`);
  await addColumnIfMissing(client, 'remedies', 'customer_appointment_id', `ALTER TABLE remedies ADD COLUMN customer_appointment_id TEXT`);
}

export async function ensureRemedyTemplatesTable() {
  const client = await getTursoClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS remedy_templates (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_remedy_templates_title ON remedy_templates(title);`);
}

