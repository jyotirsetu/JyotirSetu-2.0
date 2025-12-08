import type { APIRoute } from 'astro';
import { getTursoClient } from '../../../lib/turso';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const db = await getTursoClient();
    const url = new URL(request.url);
    const days = Math.min(90, Math.max(7, parseInt(url.searchParams.get('days') || '30', 10)));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const [
      leadsByStage, 
      quotesByStatus, 
      paidTotals, 
      slaOverdue, 
      fulOverdue,
      recentActivity,
      staffPerformance,
      documentStats,
      appointmentStats
    ] = await Promise.all([
      db.execute({ sql: `SELECT stage, COUNT(*) AS count FROM leads GROUP BY stage`, args: [] }).catch(() => ({ rows: [] })),
      db.execute({ sql: `SELECT status, COUNT(*) AS count FROM quotes GROUP BY status`, args: [] }),
      db.execute({ sql: `SELECT client_id, COALESCE(SUM(amount),0) AS total_paid FROM payments GROUP BY client_id`, args: [] }).catch(() => ({ rows: [] })),
      db.execute({ sql: `SELECT COUNT(*) AS count FROM leads WHERE sla_due_at IS NOT NULL AND datetime(sla_due_at) < datetime('now')`, args: [] }).catch(() => ({ rows: [{ count: 0 }] })),
      db.execute({ sql: `SELECT COUNT(*) AS count FROM fulfillment_tasks WHERE due_date IS NOT NULL AND datetime(due_date) < datetime('now') AND LOWER(status) <> 'completed'`, args: [] }).catch(() => ({ rows: [{ count: 0 }] })),
      db.execute({ sql: `SELECT DATE(created_at) as date, COUNT(*) as count FROM appointments WHERE created_at >= ? GROUP BY DATE(created_at) ORDER BY date DESC LIMIT ${days}`, args: [startDateStr] }).catch(() => ({ rows: [] })),
      db.execute({ sql: `SELECT 
        a.staff_id,
        s.name as staff_name,
        COUNT(*) as appointment_count,
        AVG(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END) * 100 as completion_rate
        FROM appointments a
        LEFT JOIN staff s ON s.id = a.staff_id
        WHERE a.created_at >= ?
        GROUP BY a.staff_id, s.name`, args: [startDateStr] }).catch(() => ({ rows: [] })),
      db.execute({ sql: `SELECT 
        COUNT(*) as total_documents,
        COUNT(CASE WHEN created_at >= ? THEN 1 END) as recent_documents,
        COUNT(CASE WHEN share_token IS NOT NULL THEN 1 END) as shared_documents
        FROM documents`, args: [startDateStr] }).catch(() => ({ rows: [] })),
      db.execute({ sql: `SELECT 
        status,
        COUNT(*) as count,
        DATE(created_at) as date
        FROM appointments 
        WHERE created_at >= ?
        GROUP BY status, DATE(created_at)
        ORDER BY date DESC`, args: [startDateStr] }).catch(() => ({ rows: [] }))
    ]);

    const funnel = (quotesByStatus.rows || []).map((r: any) => ({ status: String(r.status), count: Number(r.count || 0) }));
    const ltv = (paidTotals.rows || []).reduce((acc: Record<string, number>, r: any) => { acc[String(r.client_id)] = Number(r.total_paid || 0); return acc; }, {} as Record<string, number>);
    const sortedTop = Object.entries(ltv).sort((a,b)=> Number(b[1]) - Number(a[1])).slice(0,3);
    let top_ltv: Array<{ id: string; name: string; total: number }> = [];
    if (sortedTop.length) {
      const ids = sortedTop.map(([id])=> id);
      try {
        const placeholders = ids.map(()=> '?').join(',');
        const nameRes = await db.execute({ sql: `SELECT id, name FROM clients WHERE id IN (${placeholders})`, args: ids });
        const nameMap: Record<string, string> = {};
        for (const row of (nameRes.rows || []) as Array<Record<string, unknown>>) nameMap[String(row.id||'')] = String(row.name||'');
        top_ltv = sortedTop.map(([id, total])=> ({ id, name: nameMap[id] || id, total: Number(total||0) }));
      } catch {
        top_ltv = sortedTop.map(([id, total])=> ({ id, name: id, total: Number(total||0) }));
      }
    }

    const breaches = Number((slaOverdue.rows?.[0] as any)?.count || 0);
    const overdueFulfillment = Number((fulOverdue.rows?.[0] as any)?.count || 0);
    
    // Calculate SLA metrics
    const slaMetrics = {
      total_breaches: breaches,
      fulfillment_overdue: overdueFulfillment,
      breach_rate: recentActivity.rows?.length ? (breaches / recentActivity.rows.length * 100).toFixed(1) : '0.0'
    };

    // Process staff performance data
    const staffPerf = (staffPerformance.rows || []).map((r: any) => ({
      staff_id: String(r.staff_id || ''),
      staff_name: String(r.staff_name || 'Unknown'),
      appointment_count: Number(r.appointment_count || 0),
      completion_rate: Number(r.completion_rate || 0).toFixed(1)
    }));

    // Process appointment trends
    const appointmentTrends = (appointmentStats.rows || []).reduce((acc: Record<string, any>, r: any) => {
      const date = String(r.date);
      if (!acc[date]) acc[date] = { date, total: 0, confirmed: 0, completed: 0, cancelled: 0 };
      acc[date].total += Number(r.count || 0);
      acc[date][String(r.status)] = Number(r.count || 0);
      return acc;
    }, {} as Record<string, any>);

    const trends = Object.values(appointmentTrends).slice(-14); // Last 14 days

    // Document sharing stats
    const docStats = documentStats.rows?.[0] || { total_documents: 0, recent_documents: 0, shared_documents: 0 };

    return new Response(JSON.stringify({ 
      ok: true, 
      funnel, 
      leads: leadsByStage.rows || [], 
      ltv, 
      top_ltv,
      sla: slaMetrics,
      recent_activity: recentActivity.rows || [],
      staff_performance: staffPerf,
      document_stats: docStats,
      appointment_trends: trends
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};
