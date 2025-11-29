import type { APIRoute } from 'astro';
import {
  getTursoClient,
  ensureAppointmentsTable,
  ensureContactsTable,
  ensureNewsletterSubscribersTable,
} from '../../../lib/turso';

export const prerender = false;

export const GET: APIRoute = async ({ request: _request }) => {
  try {
    await ensureAppointmentsTable();
    await ensureContactsTable();
    await ensureNewsletterSubscribersTable();

    const client = await getTursoClient();
    const today = new Date().toISOString().split('T')[0];

    // Get today's appointments
    const [todayAppointments, pendingAppointments, pendingContacts, pendingNewsletter, totalStats] = await Promise.all([
      // Today's appointments
      client.execute({
        sql: `SELECT COUNT(*) as count FROM appointments WHERE date = ?`,
        args: [today],
      }),

      // Pending appointments (today and future)
      client.execute({
        sql: `SELECT COUNT(*) as count FROM appointments WHERE date >= ? AND status = 'pending'`,
        args: [today],
      }),

      client.execute({
        sql: `SELECT COUNT(*) as count FROM contacts WHERE status != 'resolved'`,
        args: [],
      }),

      client.execute({
        sql: `SELECT COUNT(*) as count FROM newsletter_subscribers WHERE status = 'pending'`,
        args: [],
      }),

      client.execute({
        sql: `SELECT 
          (SELECT COUNT(*) FROM appointments) as total_appointments,
          (SELECT COUNT(*) FROM contacts) as total_contacts,
          (SELECT COUNT(*) FROM newsletter_subscribers) as total_newsletter`,
        args: [],
      }),
    ]);

    const stats = {
      todayAppointments: Number(todayAppointments.rows[0]?.count || 0),
      pendingAppointments: Number(pendingAppointments.rows[0]?.count || 0),
      pendingContacts: Number(pendingContacts.rows[0]?.count || 0),
      pendingNewsletter: Number(pendingNewsletter.rows[0]?.count || 0),
      totalAppointments: Number(totalStats.rows[0]?.total_appointments || 0),
      totalContacts: Number(totalStats.rows[0]?.total_contacts || 0),
      totalNewsletter: Number(totalStats.rows[0]?.total_newsletter || 0),
    };

    return new Response(JSON.stringify({ ok: true, data: stats }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Daily reminder API error:', error);
    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to fetch daily stats',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
