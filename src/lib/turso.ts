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
      message TEXT,
      service_details TEXT,
      created_at TEXT NOT NULL
    );
  `);
}


