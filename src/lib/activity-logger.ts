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

export async function getActivityLog(limit: number = 100) {
  try {
    await ensureActivityLogTable();
    const client = await getTursoClient();
    const res = await client.execute({
      sql: `
        SELECT a.*, 
               ap.name AS appointment_name, ap.email AS appointment_email,
               c.name AS contact_name, c.email AS contact_email
        FROM activity_log a
        LEFT JOIN appointments ap ON a.entity_type = 'appointment' AND a.entity_id = ap.id
        LEFT JOIN contacts c ON a.entity_type = 'contact' AND a.entity_id = c.id
        ORDER BY datetime(a.created_at) DESC LIMIT ?
      `,
      args: [limit],
    });
    return res.rows || [];
  } catch (error) {
    console.error('Failed to get activity log:', error);
    return [];
  }
}
