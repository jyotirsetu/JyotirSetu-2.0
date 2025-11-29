import { getTursoClient, ensureEmailHistoryTable } from './turso';

export async function logEmail(
  recipientEmail: string,
  recipientName: string | null,
  subject: string,
  type: string,
  relatedId: string | null = null,
  relatedType: string | null = null,
  status: string = 'sent',
  errorMessage: string | null = null
) {
  try {
    await ensureEmailHistoryTable();
    const client = await getTursoClient();
    const id = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sentAt = new Date().toISOString();

    await client.execute({
      sql: `INSERT INTO email_history (id, recipient_email, recipient_name, subject, type, related_id, related_type, status, sent_at, error_message)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        recipientEmail,
        recipientName || null,
        subject,
        type,
        relatedId || null,
        relatedType || null,
        status,
        sentAt,
        errorMessage || null,
      ],
    });
    return id;
  } catch (error) {
    console.error('Failed to log email:', error);
    return null;
  }
}

export async function getEmailHistory(relatedId?: string, relatedType?: string, limit: number = 100) {
  try {
    await ensureEmailHistoryTable();
    const client = await getTursoClient();
    let sql = `SELECT * FROM email_history`;
    const args: Array<string | number> = [];

    if (relatedId && relatedType) {
      sql += ` WHERE related_id = ? AND related_type = ?`;
      args.push(relatedId, relatedType);
    }

    sql += ` ORDER BY datetime(sent_at) DESC LIMIT ?`;
    args.push(limit);

    const res = await client.execute({ sql, args });
    return res.rows || [];
  } catch (error) {
    console.error('Failed to get email history:', error);
    return [];
  }
}
