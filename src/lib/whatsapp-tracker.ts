import { getTursoClient, ensureWhatsAppHistoryTable } from './turso';

export async function logWhatsapp(
  recipientPhone: string,
  message: string,
  type: string,
  relatedId: string | null = null,
  relatedType: string | null = null,
  status: string = 'sent',
  errorMessage: string | null = null,
  recipientName: string | null = null
) {
  try {
    await ensureWhatsAppHistoryTable();
    const client = await getTursoClient();
    const id = `wa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sentAt = new Date().toISOString();
    await client.execute({
      sql: `INSERT INTO whatsapp_history (id, recipient_phone, recipient_name, message, type, related_id, related_type, status, sent_at, error_message)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, String(recipientPhone), recipientName || null, String(message), String(type), relatedId || null, relatedType || null, String(status), sentAt, errorMessage || null]
    });
    return id;
  } catch (error) {
    console.error('Failed to log WhatsApp message:', error);
    return null;
  }
}

export async function getWhatsappHistory(relatedId?: string, relatedType?: string, limit: number = 100) {
  try {
    await ensureWhatsAppHistoryTable();
    const client = await getTursoClient();
    let sql = `SELECT * FROM whatsapp_history`;
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
    console.error('Failed to get WhatsApp history:', error);
    return [];
  }
}