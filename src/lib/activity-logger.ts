import { getTursoClient, ensureActivityLogTable, ensureNotificationsTable } from './turso';

export async function logActivity(
  action: string,
  entityType: string,
  entityId: string | null,
  details?: string,
  user: string = 'admin'
) {
  try {
    await ensureActivityLogTable();
    const client = await getTursoClient();
    const id = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();

    await client.execute({
      sql: `INSERT INTO activity_log (id, action, entity_type, entity_id, user, details, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [id, action, entityType, entityId || null, user, details || null, createdAt],
    });
    if (action === 'appointment_created' || action === 'quote_status_changed') {
      await ensureNotificationsTable();
      const nid = `ntf_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const title = action === 'appointment_created' ? 'New appointment' : 'Quote status changed';
      const message = details || '';
      await client.execute({ sql: `INSERT INTO notifications (id, title, message, type, read, created_at) VALUES (?, ?, ?, ?, 0, ?)`, args: [nid, title, message, action, createdAt] });
    }
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

export async function getActivityLog(page: number = 1, limit: number = 100, action?: string, entityType?: string) {
  try {
    await ensureActivityLogTable();
    const client = await getTursoClient();

    const conditions: string[] = [];
    const args: (string | number | boolean | bigint | null)[] = [];

    if (action) {
      conditions.push("a.action = ?");
      args.push(action);
    }
    if (entityType) {
      conditions.push("a.entity_type = ?");
      args.push(entityType);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const countRes = await client.execute({
      sql: `SELECT COUNT(*) as total FROM activity_log a ${whereClause}`,
      args
    });
    const total = Number(countRes.rows[0]?.total || 0);

    const res = await client.execute({
      sql: `
        SELECT a.*, 
               ap.name AS appointment_name, ap.email AS appointment_email,
               c.name AS contact_name, c.email AS contact_email,
               l.name AS lead_name, l.email AS lead_email,
               pc.name AS payment_client_name, pc.email AS payment_client_email,
               ap2.name AS payment_appt_name, ap2.email AS payment_appt_email
        FROM activity_log a
        LEFT JOIN appointments ap ON a.entity_type = 'appointment' AND a.entity_id = ap.id
        LEFT JOIN contacts c ON a.entity_type = 'contact' AND a.entity_id = c.id
        LEFT JOIN leads l ON a.entity_type = 'lead' AND a.entity_id = l.id
        LEFT JOIN payments p ON a.entity_type = 'payment' AND a.entity_id = p.id
        LEFT JOIN clients pc ON p.client_id = pc.id
        LEFT JOIN appointments ap2 ON p.appointment_id = ap2.id
        ${whereClause}
        ORDER BY datetime(a.created_at) DESC LIMIT ? OFFSET ?
      `,
      args: [...args, limit, offset],
    });
    const rows = (res.rows || []) as Array<Record<string, unknown>>;
    const deriveClientName = (row: Record<string, unknown>): string => {
      const detailsRaw = String(row.details || '');
      try {
        const obj = JSON.parse(detailsRaw) as Record<string, unknown>;
        const n = ['client_name', 'appointment_client_name', 'appointment_name']
          .map((k) => String((obj[k] as string | undefined) || '').trim())
          .filter(Boolean)[0];
        if (n) return n;
      } catch { /* ignore */ }
      const candidates = [row.appointment_name, row.payment_appt_name, row.payment_client_name, row.contact_name, row.lead_name]
        .map((v) => String(v || '').trim())
        .filter(Boolean);
      return candidates[0] || '';
    };
    const replaceIdWithName = (details: string, name: string): string => {
      if (!details || !name) return details;
      const match = details.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
      if (match) return details.replace(match[0], name);
      return details;
    };
    const enhanced = rows.map((row) => {
      const name = deriveClientName(row);
      const detailsStr = String(row.details || '');
      const newDetails = replaceIdWithName(detailsStr, name);
      return { ...row, client_name_display: name, details: newDetails };
    });
    return { data: enhanced, total };
  } catch (error) {
    console.error('Failed to get activity log:', error);
    return { data: [], total: 0 };
  }
}
