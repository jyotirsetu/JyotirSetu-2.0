/* global Chart */
// Insights page client script (externalized to avoid esbuild inline transform issues)
const qs = (id)=>document.getElementById(id);
// Mark script as loaded for quick debugging
try{ if(qs('totals')) qs('totals').textContent = 'Loading…'; }catch{ /* ignore init */ }
function params(){
  const p = new URLSearchParams();
  ['from','to','source','device'].forEach(k=>{ const v = qs(k)?.value||''; if(v) p.set(k,v); });
  return p.toString();
}
function renderList(el, rows, idKey){
  const html = (rows||[]).map(r=>{
    const name = r[idKey] || '—'; const v = Number(r.views||0); const c = Number(r.clicks||0);
    return `<div>${name} · views ${v}, clicks ${c}</div>`;
  }).join('');
  el.innerHTML = html || '—';
}
function renderSourceBars(el, rows){
  const list = rows||[]; const max = Math.max(1, ...list.map(r=>Number(r.clicks||0)));
  el.innerHTML = list.map(r=>{
    const pct = Math.round((Number(r.clicks||0)/max)*100);
    return `<div style="margin:6px 0">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="text-transform:capitalize">${r.source||'—'}</span>
        <span>${r.clicks||0} clicks</span>
      </div>
      <div style="height:6px;border-radius:999px;background:rgba(255,255,255,0.08);margin-top:6px">
        <div style="height:6px;border-radius:999px;background:linear-gradient(90deg, #2ad1b2, #3498db); width:${pct}%"></div>
      </div>
    </div>`;
  }).join('') || '—';
}
let chartInstance = null;
function drawChartJS(canvas, daily){
  if(typeof Chart === 'undefined' || !canvas){ return; }
  const labels = (daily||[]).map(d=>d.day||d.date||'');
  const views = (daily||[]).map(d=>Number(d.views||0));
  const clicks = (daily||[]).map(d=>Number(d.clicks||0));
  if(chartInstance){ chartInstance.destroy(); }
  chartInstance = new Chart(canvas, {
    type: 'line',
    data: { labels, datasets: [
      { label:'Views', data: views, borderColor:'#2ad1b2', backgroundColor:'rgba(42,209,178,0.25)', tension:0.3 },
      { label:'Clicks', data: clicks, borderColor:'#e74c3c', backgroundColor:'rgba(231,76,60,0.25)', tension:0.3 }
    ]},
    options: {
      responsive: false,
      plugins: { legend: { labels: { color: '#cfe8ea' } }, tooltip: { enabled: true } },
      scales: {
        x: { title: { display: true, text: 'Date', color:'#cfe8ea' }, grid:{ color:'rgba(255,255,255,0.07)' }, ticks:{ color:'#cfe8ea' } },
        y: { title: { display: true, text: 'Count', color:'#cfe8ea' }, grid:{ color:'rgba(255,255,255,0.07)' }, ticks:{ color:'#cfe8ea' } }
      }
    }
  });
}
let page = 0; let pageSize = 50; let lastRows = 0;
function updatePageInfo(){
  const start = page*pageSize + 1; const end = page*pageSize + (lastRows||0);
  const pageInfoEl = qs('pageInfo'); if(pageInfoEl) pageInfoEl.textContent = `Showing ${start}-${end}`;
  const prevEl = qs('prevPage'); if(prevEl) prevEl.disabled = page<=0;
  const nextEl = qs('nextPage'); if(nextEl) nextEl.disabled = lastRows < pageSize;
}
async function load(){
  const q = params();
  try{
    const res = await fetch('/api/admin/follow-hub/insights' + (q?('?'+q):''), { headers:{ 'Accept':'application/json' } });
    const ct1 = res.headers.get('Content-Type')||'';
    if(!res.ok || !ct1.includes('application/json')){ const te = qs('totals'); if(te) te.textContent = 'No data (auth or filter)'; }
    else{
      const j = await res.json();
      if(!j.ok){ const te = qs('totals'); if(te) te.textContent = 'No data'; }
      else{
        const t = j.data.totals; const te = qs('totals'); if(te) te.textContent = `Views ${t.views||0}, Clicks ${t.clicks||0}, CTR ${t.ctr||0}%`;
        renderList(qs('devices'), j.data.devices, 'device');
        renderList(qs('sources'), j.data.sources, 'source');
        renderSourceBars(qs('sourceBars'), j.data.sources);
        // Last 7 days summary
        const daily = j.data.daily||[]; const last7 = daily.slice(Math.max(0, daily.length-7));
        const v7 = last7.reduce((a,b)=>a+Number(b.views||0),0); const c7 = last7.reduce((a,b)=>a+Number(b.clicks||0),0);
        const ctr7 = v7 ? ((c7/v7)*100).toFixed(2) : '0.00';
        const last7El = qs('last7'); if(last7El) last7El.textContent = `Views ${v7}, Clicks ${c7}, CTR ${ctr7}%`;
        const variantsEl = qs('variants'); if(variantsEl) variantsEl.innerHTML = (j.data.variants||[]).map(v=>{
          const ctr = v.views ? ((v.clicks/v.views)*100).toFixed(2) : '0.00';
          return `<div>Variant ${v.variant||'—'}: views ${v.views||0}, clicks ${v.clicks||0}, CTR ${ctr}%</div>`;
        }).join('') || '—';
        drawChartJS(qs('chart'), j.data.daily||[]);
      }
    }
  }catch{ const te = qs('totals'); if(te) te.textContent = 'No data (network error)'; }
  // Overview widgets: CTA breakdown and platform cards
  try{
    const o = await fetch('/api/admin/follow-hub/overview' + (q?('?'+q):''), { headers:{ 'Accept':'application/json' } });
    const ct2 = o.headers.get('Content-Type')||''; if(!o.ok || !ct2.includes('application/json')){ throw new Error('overview not json'); }
    const jo = await o.json(); if(jo.ok){
      // Use overview totals to surface richer counters
      const ot = jo.data.totals || {};
      qs('totals').textContent = `Page Views ${ot.page_views||0}, Impressions ${ot.cta_impressions||0}, Clicks ${ot.cta_clicks||0}, Shares ${ot.shares||0}, CTR ${ot.ctr||0}%`;
      // Populate top summary cards
      if(qs('ovPageViews')) qs('ovPageViews').textContent = String(ot.page_views||0);
      if(qs('ovImpressions')) qs('ovImpressions').textContent = String(ot.cta_impressions||0);
      if(qs('ovClicks')) qs('ovClicks').textContent = String(ot.cta_clicks||0);
      if(qs('ovShares')) qs('ovShares').textContent = String(ot.shares||0);
      if(qs('ovCtr')) qs('ovCtr').textContent = String(ot.ctr||0) + '%';
      const allowed = new Set(['google_review','instagram','facebook','youtube','whatsapp']);
      const breakdown = (jo.data.cta_breakdown||[]).filter(r => allowed.has(String(r.cta||'').toLowerCase()));
      const colorForCta = (cta)=>{
        switch(String(cta||'').toLowerCase()){
          case 'whatsapp': return 'teal';
          case 'google_review': return 'gold';
          case 'facebook': return 'blue';
          case 'instagram': return 'pink';
          case 'youtube': return 'red';
          case 'website': return 'gray';
          default: return 'gray';
        }
      };
      const chips = breakdown.map(r=>{
        const color = colorForCta(r.cta);
        return `<span class="chip ${color}"><span class="dot"></span><span>${r.cta||'—'}</span><strong>${r.clicks||0}</strong></span>`;
      }).join('');
      const chipsEl = qs('ctaChips');
      if(chipsEl){ chipsEl.innerHTML = chips || '<span class="chip gray"><span class="dot"></span><span>No clicks yet</span></span>'; }

      const maxClicks = Math.max(1, ...breakdown.map(r=>Number(r.clicks||0)));
      const platformCardsEl = qs('platformCards'); if(platformCardsEl) platformCardsEl.innerHTML = breakdown.map(r=>{
        const pct = Math.round((Number(r.clicks||0)/maxClicks)*100);
        return `<div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <strong style="text-transform:capitalize">${r.cta}</strong>
            <span>${r.clicks||0} clicks</span>
          </div>
          <div style="height:8px;border-radius:999px;background:rgba(255,255,255,0.08);margin-top:10px">
            <div style="height:8px;border-radius:999px;background:linear-gradient(90deg, #2ad1b2, #3498db); width:${pct}%"></div>
          </div>
        </div>`;
      }).join('');
    }
  }catch{ /* ignore overview errors */ }
  // Build events URL via URL API to avoid inline ternary parsing issues
  const evUrl = new URL('/api/admin/follow-hub/events', location.origin);
  if(q){ evUrl.search = q; }
  evUrl.searchParams.set('limit', String(pageSize));
  evUrl.searchParams.set('offset', String(page*pageSize));
  const ev = await fetch(evUrl.toString(), { headers:{ 'Accept':'application/json' } });
  const ct3 = ev.headers.get('Content-Type')||''; if(!ev.ok || !ct3.includes('application/json')){ qs('tbody').innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--muted)">No events (auth or filter)</td></tr>`; lastRows=0; updatePageInfo(); return; }
  const ej = await ev.json(); const rows = ej.data||[];
  qs('tbody').innerHTML = (rows.length?rows.map(r=>`<tr>
    <td>${r.created_at?.replace('T',' ').slice(0,19)}</td>
    <td>${r.event_type||''}</td>
    <td>${r.primary_cta_shown||''}</td>
    <td>${r.cta_clicked||''}</td>
    <td>${r.cta_variant||''}</td>
    <td>${r.source||''}</td>
    <td>${r.device||''}</td>
    <td>${r.ip_masked||''}</td>
  </tr>`).join('') : `<tr><td colspan="8" style="text-align:center;color:var(--muted)">No events</td></tr>`);
  lastRows = rows.length; updatePageInfo();
}
// Expose a global hook so the page can verify the script loaded
try{
  window.__followHubInsightsLoaded = true;
  window.FollowHubInsightsLoad = load;
}catch{ /* expose hook failure ignored */ }
// Event bindings
window.addEventListener('DOMContentLoaded', ()=>{
  try{
    // Prefill filters for last 30 days if empty
    const fromEl = qs('from'); const toEl = qs('to');
    const today = new Date(); const start = new Date(); start.setDate(today.getDate()-30);
    const fmt = (d)=>d.toISOString().slice(0,10);
    if(fromEl && !fromEl.value) fromEl.value = fmt(start);
    if(toEl && !toEl.value) toEl.value = fmt(today);
    load();
    qs('apply')?.addEventListener('click', ()=>{ page=0; load(); });
    qs('exportCsv')?.addEventListener('click', async ()=>{
      const q = params(); const res = await fetch('/api/admin/follow-hub/events' + (q?('?'+q):'')); const j = await res.json(); const rows = j.data||[];
      const csv = ['time,type,cta_shown,cta_clicked,variant,source,device,ip_masked'].concat(
        rows.map(r => [r.created_at, r.event_type, r.primary_cta_shown, r.cta_clicked, r.cta_variant, r.source, r.device, r.ip_masked].map(x => '"' + String(x||'').replace(/"/g,'""') + '"').join(','))
      ).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'follow-hub-' + new Date().toISOString().slice(0,10) + '.csv'; a.click();
    });
    qs('prevPage')?.addEventListener('click', ()=>{ if(page>0){ page--; load(); } });
    qs('nextPage')?.addEventListener('click', ()=>{ if(lastRows>=pageSize){ page++; load(); } });
    qs('pageSize')?.addEventListener('change', (e)=>{
      const target = e.target;
      const val = (target && typeof target === 'object' && 'value' in target) ? Number(target.value || 50) : 50;
      pageSize = val; page=0; load();
    });
    // Variant controls
    (async function(){ try{ const res = await fetch('/api/admin/follow-hub/variant'); const j = await res.json(); if(j.ok) qs('variant').value = j.value; }catch{ /* ignore variant fetch error */ } })();
    qs('saveVariant')?.addEventListener('click', async ()=>{
      const value = qs('variant').value; const res = await fetch('/api/admin/follow-hub/variant', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ value }) });
      const j = await res.json(); qs('variantMsg').textContent = j.ok ? 'Saved' : ('Error: ' + (j.error||'unknown'));
      setTimeout(()=>{ qs('variantMsg').textContent = ''; }, 2000);
    });
  }catch(e){ console.error('Insights init error', e); }
});