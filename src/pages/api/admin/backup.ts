import type { APIRoute } from 'astro'
import { getTursoClient, ensureAppointmentsTable, ensureContactsTable, ensureNewsletterSubscribersTable, ensureNotesTable, ensureActivityLogTable, ensureNotificationsTable, ensureSavedViewsTable, ensureTemplatesTables, ensureEmailHistoryTable, ensureWhatsAppHistoryTable, ensureClientsTable, ensurePaymentsTable, ensureInvoicesTable, ensureInvoiceItemsTable, ensureInvoicePaymentsTable, ensureLedgerTable, ensureServicesTable, ensureQuotesTable, ensureQuoteItemsTable } from '../../../lib/turso'

export const prerender = false

export const GET: APIRoute = async () => {
  try {
    const client = await getTursoClient()
    await Promise.all([
      ensureAppointmentsTable(),
      ensureContactsTable(),
      ensureNewsletterSubscribersTable(),
      ensureNotesTable(),
      ensureActivityLogTable(),
      ensureNotificationsTable(),
      ensureSavedViewsTable(),
      ensureTemplatesTables(),
      ensureEmailHistoryTable(),
      ensureWhatsAppHistoryTable(),
      ensureClientsTable(),
      ensurePaymentsTable(),
      ensureInvoicesTable(),
      ensureInvoiceItemsTable(),
      ensureInvoicePaymentsTable(),
      ensureLedgerTable(),
      ensureServicesTable(),
      ensureQuotesTable(),
      ensureQuoteItemsTable(),
    ])

    async function dump(sql: string) {
      const res = await client.execute({ sql, args: [] })
      return res.rows || []
    }

    const backup = {
      meta: {
        generated_at: new Date().toISOString(),
        engine: 'libsql/turso',
        version: 1,
      },
      tables: {
        appointments: await dump('SELECT * FROM appointments ORDER BY datetime(created_at) DESC'),
        contacts: await dump('SELECT * FROM contacts ORDER BY datetime(created_at) DESC'),
        newsletter_subscribers: await dump('SELECT * FROM newsletter_subscribers ORDER BY datetime(subscribed_at) DESC'),
        notes: await dump('SELECT * FROM notes ORDER BY datetime(created_at) DESC'),
        activity_log: await dump('SELECT * FROM activity_log ORDER BY datetime(created_at) DESC'),
        notifications: await dump('SELECT * FROM notifications ORDER BY datetime(created_at) DESC'),
        saved_views: await dump('SELECT * FROM saved_views ORDER BY datetime(created_at) DESC'),
        email_templates: await dump('SELECT * FROM email_templates ORDER BY datetime(updated_at) DESC'),
        whatsapp_templates: await dump('SELECT * FROM whatsapp_templates ORDER BY datetime(updated_at) DESC'),
        email_history: await dump('SELECT * FROM email_history ORDER BY datetime(sent_at) DESC'),
        whatsapp_history: await dump('SELECT * FROM whatsapp_history ORDER BY datetime(sent_at) DESC'),
        clients: await dump('SELECT * FROM clients ORDER BY datetime(created_at) DESC'),
        payments: await dump('SELECT * FROM payments ORDER BY datetime(created_at) DESC'),
        invoices: await dump('SELECT * FROM invoices ORDER BY datetime(issue_date) DESC'),
        invoice_items: await dump('SELECT * FROM invoice_items ORDER BY invoice_id'),
        invoice_payments: await dump('SELECT * FROM invoice_payments ORDER BY datetime(date) DESC'),
        services: await dump('SELECT * FROM services ORDER BY datetime(updated_at) DESC'),
        ledger_entries: await dump('SELECT * FROM ledger_entries ORDER BY datetime(date) DESC'),
        quotes: await dump('SELECT * FROM quotes ORDER BY datetime(updated_at) DESC'),
        quote_items: await dump('SELECT * FROM quote_items ORDER BY quote_id'),
      },
    }

    const json = JSON.stringify(backup)
    const body = new Blob([json], { type: 'application/json;charset=utf-8;' })
    const filename = `admin-backup-${new Date().toISOString().slice(0, 10)}.json`
    return new Response(body, { headers: { 'Content-Type': 'application/json;charset=utf-8;', 'Content-Disposition': `attachment; filename="${filename}"` } })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'failed'
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
