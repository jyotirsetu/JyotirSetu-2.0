import type { APIRoute } from 'astro';
import {
  getTursoClient,
  ensureAutomationRulesTable,
  ensureAppointmentsTable,
  ensureContactsTable,
  ensureNewsletterSubscribersTable,
} from '../../../lib/turso';
import { emailService } from '../../../lib/email-service';

export const prerender = false;

function nowHHMM(date: Date): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

async function getStats() {
  await ensureAppointmentsTable();
  await ensureContactsTable();
  await ensureNewsletterSubscribersTable();
  const db = await getTursoClient();
  const today = new Date().toISOString().split('T')[0];
  const [todayAppointments, pendingAppointments, pendingContacts, pendingNewsletter, totalStats] = await Promise.all([
    db.execute({ sql: `SELECT COUNT(*) as count FROM appointments WHERE date = ?`, args: [today] }),
    db.execute({
      sql: `SELECT COUNT(*) as count FROM appointments WHERE date >= ? AND status = 'pending'`,
      args: [today],
    }),
    db.execute({ sql: `SELECT COUNT(*) as count FROM contacts WHERE status != 'resolved'`, args: [] }),
    db.execute({ sql: `SELECT COUNT(*) as count FROM newsletter_subscribers WHERE status = 'pending'`, args: [] }),
    db.execute({
      sql: `SELECT (SELECT COUNT(*) FROM appointments) as total_appointments, (SELECT COUNT(*) FROM contacts) as total_contacts, (SELECT COUNT(*) FROM newsletter_subscribers) as total_newsletter`,
      args: [],
    }),
  ]);
  return {
    todayAppointments: Number(todayAppointments.rows[0]?.count || 0),
    pendingAppointments: Number(pendingAppointments.rows[0]?.count || 0),
    pendingContacts: Number(pendingContacts.rows[0]?.count || 0),
    pendingNewsletter: Number(pendingNewsletter.rows[0]?.count || 0),
    totalAppointments: Number(totalStats.rows[0]?.total_appointments || 0),
    totalContacts: Number(totalStats.rows[0]?.total_contacts || 0),
    totalNewsletter: Number(totalStats.rows[0]?.total_newsletter || 0),
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    await ensureAutomationRulesTable();
    const db = await getTursoClient();
    const { simulateTime } = (await request.json().catch(() => ({ simulateTime: undefined }))) as {
      simulateTime?: string;
    };
    const now = new Date();
    const hhmm = simulateTime && /^\d{2}:\d{2}$/.test(simulateTime) ? simulateTime : nowHHMM(now);
    const rulesRes = await db.execute({
      sql: `SELECT id, email, types, frequency, daily_time, last_sent_at FROM automation_rules`,
      args: [],
    });
    const rules = (rulesRes.rows || []) as Array<Record<string, unknown>>;
    const stats = await getStats();
    let processed = 0;
    for (const r of rules) {
      const frequency = String(r.frequency || '');
      const email = String(r.email || '');
      const dailyTime = r.daily_time != null ? String(r.daily_time) : null;
      const lastSent = r.last_sent_at ? String(r.last_sent_at) : '';
      if (frequency === 'daily' && dailyTime && dailyTime === hhmm) {
        const lastMinute = lastSent ? lastSent.slice(0, 16) : '';
        const thisMinute = new Date().toISOString().slice(0, 16);
        if (lastMinute === thisMinute) continue;
        const ok = await emailService.sendAppointmentCustomEmail(
          {
            name: 'Admin',
            email,
            phone: '',
            service: 'Daily Stats',
            date: new Date().toISOString().split('T')[0],
            time: hhmm,
            consultation_method: 'system',
          },
          'Daily Reminder – JyotirSetu',
          `
          <div class="card">
            <div class="section-title">Today's Overview</div>
            <ul>
              <li><strong>Today's appointments:</strong> ${stats.todayAppointments}</li>
              <li><strong>Pending appointments:</strong> ${stats.pendingAppointments}</li>
              <li><strong>Pending contacts:</strong> ${stats.pendingContacts}</li>
              <li><strong>Pending newsletter:</strong> ${stats.pendingNewsletter}</li>
            </ul>
            <div class="section-title">Totals</div>
            <ul>
              <li><strong>Total appointments:</strong> ${stats.totalAppointments}</li>
              <li><strong>Total contacts:</strong> ${stats.totalContacts}</li>
              <li><strong>Total newsletter:</strong> ${stats.totalNewsletter}</li>
            </ul>
          </div>
        `
        );
        processed += ok ? 1 : 0;
        await db.execute({
          sql: `UPDATE automation_rules SET last_sent_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`,
          args: [String(r.id || '')],
        });
      }
      if (frequency !== 'daily') {
        // Future: handle other frequencies
      }
    }
    return new Response(JSON.stringify({ ok: true, processed }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};

export const GET: APIRoute = async () => {
  const ctx = {
    request: new Request('http://local', { method: 'POST', body: JSON.stringify({}) }),
  } as unknown as Parameters<typeof POST>[0];
  const res = await POST(ctx);
  return res;
};
