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
               l.name AS lead_name, l.email AS lead_email
        FROM activity_log a
        LEFT JOIN appointments ap ON a.entity_type = 'appointment' AND a.entity_id = ap.id
        LEFT JOIN contacts c ON a.entity_type = 'contact' AND a.entity_id = c.id
        LEFT JOIN leads l ON a.entity_type = 'lead' AND a.entity_id = l.id
        ${whereClause}
        ORDER BY datetime(a.created_at) DESC LIMIT ? OFFSET ?
      `,
      args: [...args, limit, offset],
    });
    return { data: res.rows || [], total };
  } catch (error) {
    console.error('Failed to get activity log:', error);
    return { data: [], total: 0 };
  }
}
