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
      appointmentStats,
      serviceStats
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
        ORDER BY date DESC`, args: [startDateStr] }).catch(() => ({ rows: [] })),
      db.execute({ sql: `SELECT 
        service,
        COUNT(*) as count
        FROM appointments 
        GROUP BY service
        ORDER BY count DESC`, args: [] }).catch(() => ({ rows: [] }))
    ]);

    const qRows = (quotesByStatus.rows || []) as Array<{ status?: unknown; count?: unknown }>;
    const funnel = qRows.map(function(r){ return { status: String(r.status || ''), count: Number(r.count || 0) }; });
    const pRows = (paidTotals.rows || []) as Array<{ client_id?: unknown; total_paid?: unknown }>;
    const byClient = pRows.reduce<Record<string, number>>(function(acc, r){ acc[String(r.client_id || '')] = Number(r.total_paid || 0); return acc; }, {});
    let ltv: Record<string, number> = {};
    try {
      const totalsRes = await db.execute({
        sql: `
          SELECT c.id AS id,
          (
            (SELECT COALESCE(SUM(amount),0) 
             FROM payments 
             WHERE client_id = c.id 
                OR appointment_id IN (SELECT id FROM appointments WHERE phone = c.phone AND phone != '') 
                OR appointment_id IN (SELECT customer_appointment_id FROM appointments WHERE phone = c.phone AND phone != '')
            ) +
            (SELECT COALESCE(SUM(purchased_amount),0) FROM quotes WHERE purchased_amount > 0 AND (client_phone = c.phone AND client_phone != ''))
          ) AS total
          FROM clients c
        `,
        args: [],
      });
      for (const row of (totalsRes.rows || []) as Array<Record<string, unknown>>) {
        ltv[String(row.id||'')] = Number(row.total||0);
      }
    } catch {
      ltv = byClient;
    }
    const sortedCandidates = Object.entries(ltv).sort((a,b)=> Number(b[1]) - Number(a[1])).slice(0,10);
    const fmtINR = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
    let top_ltv: Array<{ id: string; name: string; total: number; formatted_total: string; email?: string; phone?: string }> = [];
    if (sortedCandidates.length) {
      const ids = sortedCandidates.map(([id])=> id);
      try {
        const placeholders = ids.map(()=> '?').join(',');
        const nameRes = await db.execute({ sql: `SELECT id, name, email, phone FROM clients WHERE id IN (${placeholders})`, args: ids });
        const detailMap: Record<string, { name?: string; email?: string; phone?: string }> = {};
        for (const row of (nameRes.rows || []) as Array<Record<string, unknown>>)
          detailMap[String(row.id||'')] = { name: String(row.name||''), email: row.email? String(row.email): undefined, phone: row.phone? String(row.phone): undefined };

        const resolvedNames: Record<string, string> = {};
        for (const [id] of sortedCandidates) {
          const det = detailMap[id];
          let nm = det?.name ? String(det.name).trim() : '';
          // Try to resolve name from appointments if missing
          if (!nm && det?.phone) {
             const r = await db.execute({ sql: `SELECT name FROM appointments WHERE phone = ? ORDER BY datetime(created_at) DESC LIMIT 1`, args: [String(det.phone)] });
             nm = String(((r.rows?.[0] as Record<string, unknown>)?.name)||'').trim();
          }
          if (!nm && det?.email) {
             const r = await db.execute({ sql: `SELECT name FROM appointments WHERE email = ? ORDER BY datetime(created_at) DESC LIMIT 1`, args: [String(det.email)] });
             nm = String(((r.rows?.[0] as Record<string, unknown>)?.name)||'').trim();
          }
          resolvedNames[id] = nm || id;
        }

        // Deduplicate logic: PREFER PHONE NUMBER UNIQUENESS
        const uniqueClients: Array<{ id: string; name: string; total: number; formatted_total: string; email?: string; phone?: string }> = [];
        const cleanPhone = (p: string | undefined) => String(p || '').replace(/\D/g, ''); // Remove non-digits for comparison
        
        for (const [id, totalVal] of sortedCandidates) {
          const total = Number(totalVal || 0);
          const name = resolvedNames[id];
          const email = detailMap[id]?.email;
          const phone = detailMap[id]?.phone;
          
          const entry = { id, name, total, formatted_total: fmtINR(total), email, phone };
          const cPhone = cleanPhone(phone);

          const existingIdx = uniqueClients.findIndex(e => {
            // Strictly match by phone number as requested
            if (cPhone && e.phone && cleanPhone(e.phone) === cPhone) return true;
            return false;
          });
          
          if (existingIdx >= 0) {
            const existing = uniqueClients[existingIdx];
            // If existing lacks phone but new one has it, replace it
            // (Assuming we want the most complete profile, even if total is lower? 
            //  But wait, sortedCandidates is sorted by Total. 
            //  So existing has HIGHER total. 
            //  If we replace with lower total, we show lower LTV.
            //  User said: "amount you are showing with name and hower mouse on it it show email and phone number is the correct amount"
            //  This implies the Record A (Phone+Email) had the CORRECT amount (₹22,200).
            //  The Record B (na@) had INCORRECT amount (₹24,400).
            //  So replacing with "entry" (lower total but better profile) is CORRECT.
            if (!existing.phone && entry.phone) {
              uniqueClients[existingIdx] = entry;
            }
          } else {
            uniqueClients.push(entry);
          }
        }
        
        top_ltv = uniqueClients
          .sort((a,b) => b.total - a.total)
          .slice(0, 3);
          
      } catch {
        top_ltv = sortedCandidates.slice(0,3).map(([id, total])=> ({ id, name: id, total: Number(total||0), formatted_total: fmtINR(Number(total||0)) }));
      }
    }

    const breaches = Number(((slaOverdue.rows?.[0] as { count?: unknown })?.count) || 0);
    const overdueFulfillment = Number(((fulOverdue.rows?.[0] as { count?: unknown })?.count) || 0);
    
    // Calculate SLA metrics
    const slaMetrics = {
      total_breaches: breaches,
      fulfillment_overdue: overdueFulfillment,
      breach_rate: recentActivity.rows?.length ? (breaches / recentActivity.rows.length * 100).toFixed(1) : '0.0'
    };

    // Process staff performance data
    const sRows = (staffPerformance.rows || []) as Array<{ staff_id?: unknown; staff_name?: unknown; appointment_count?: unknown; completion_rate?: unknown }>;
    const staffPerf = sRows.map(function(r){
      return {
        staff_id: String(r.staff_id || ''),
        staff_name: String(r.staff_name || 'Unknown'),
        appointment_count: Number(r.appointment_count || 0),
        completion_rate: Number(r.completion_rate || 0).toFixed(1)
      };
    });

    // Process appointment trends
    const aRows = (appointmentStats.rows || []) as Array<{ status?: unknown; count?: unknown; date?: unknown }>;
    const appointmentTrends = aRows.reduce<Record<string, { date: string; total: number; confirmed: number; completed: number; cancelled: number }>>(function(acc, r){
      const date = String(r.date || '');
      if (!acc[date]) acc[date] = { date, total: 0, confirmed: 0, completed: 0, cancelled: 0 };
      const c = Number(r.count || 0);
      acc[date].total += c;
      const st = String(r.status || '').toLowerCase();
      if (st === 'confirmed') acc[date].confirmed = c;
      else if (st === 'completed') acc[date].completed = c;
      else if (st === 'cancelled') acc[date].cancelled = c;
      return acc;
    }, {});

    const trends = Object.values(appointmentTrends).slice(-14); // Last 14 days

    // Document sharing stats
    const docStats = documentStats.rows?.[0] || { total_documents: 0, recent_documents: 0, shared_documents: 0 };

    // Service stats
    const serviceRows = (serviceStats.rows || []) as Array<{service: string; count: number}>;
    const definedServices = [
      'Astrology',
      'Gemstone Consultation',
      'Palmistry',
      'Numerology',
      'Career & Finance',
      'Matchmaking',
      'Study / Education',
      'Corporate Consultation',
      'Other Reason'
    ];
    
    // Create map of existing counts
    const countsMap = new Map<string, number>();
    // Regex to strip emojis and symbols to ensure matching
    const stripEmoji = (s: string) => s.replace(/[^\w\s]/g, '');
    
    serviceRows.forEach(r => {
      const rawName = String(r.service || 'Other Reason');
      // Normalize key for matching: strip emojis, lowercase, and trimmed
      const cleanName = stripEmoji(rawName);
      const key = cleanName.toLowerCase().trim();
      countsMap.set(key, (countsMap.get(key) || 0) + Number(r.count || 0));
    });

    // Calculate total from DB to ensure accuracy
    const totalAppointments = Array.from(countsMap.values()).reduce((sum, c) => sum + c, 0);

    // Build final list ensuring all defined services are present
    const services = definedServices.map(name => {
      const cleanDefined = stripEmoji(name);
      const key = cleanDefined.toLowerCase().trim();
      const count = countsMap.get(key) || 0;
      // Remove from map to track any "unknown" services remaining
      countsMap.delete(key);
      return {
        name,
        count,
        percentage: totalAppointments > 0 ? (count / totalAppointments * 100).toFixed(1) : '0.0'
      };
    });

    // Add any remaining services from DB that weren't in our defined list
    // These keys are already lowercase/trimmed from the map
    countsMap.forEach((count, key) => {
      // Try to capitalize simply for display, or use as is
      const name = key.charAt(0).toUpperCase() + key.slice(1);
      services.push({
        name,
        count,
        percentage: totalAppointments > 0 ? (count / totalAppointments * 100).toFixed(1) : '0.0'
      });
    });

    // Sort by count desc
    services.sort((a, b) => b.count - a.count);

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
      appointment_trends: trends,
      services
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'failed';
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
};
