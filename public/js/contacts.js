function isContact(v) {
  if (!v || typeof v !== 'object') return false;
  const o = v;
  return (
    typeof o.id === 'string' &&
    typeof o.name === 'string' &&
    typeof o.email === 'string' &&
    (typeof o.phone === 'string' || o.phone === null || typeof o.phone === 'undefined') &&
    typeof o.subject === 'string' &&
    typeof o.message === 'string' &&
    typeof o.status === 'string' &&
    typeof o.priority === 'string' &&
    typeof o.created_at === 'string'
  );
}

let currentPage = 1;
let paginationData = { page: 1, totalPages: 1, total: 0 };
let allData = [];

function formatWaPhone(input) {
  const digits = String(input || '').replace(/\D/g, '');
  if (digits.startsWith('91')) return digits;
  if (digits.length === 10) return '91' + digits;
  return digits;
}

async function fetchData(page = 1) {
  const fromEl = document.getElementById('fromDate');
  const toEl = document.getElementById('toDate');
  const params = new URLSearchParams({ page: String(page), limit: '20' });
  if (fromEl?.value) params.set('from', fromEl.value);
  if (toEl?.value) params.set('to', toEl.value);
  const res = await fetch(`/api/admin/contacts?${params.toString()}`, { credentials: 'include' });
  const json = await res.json();
  paginationData = json.pagination || { page: 1, totalPages: 1, total: 0 };
  const raw = Array.isArray(json?.data) ? json.data : [];
  return raw.filter(isContact);
}

function renderPagination() {
  const pagEl = document.getElementById('pagination');
  if (paginationData.totalPages <= 1) {
    if (pagEl) pagEl.innerHTML = '';
    return;
  }
  let html = '<div class="pagination">';
  html += `<button ${currentPage === 1 ? 'disabled' : ''} id="prevPage">‹ Prev</button>`;
  for (let i = 1; i <= paginationData.totalPages; i++) {
    if (i === 1 || i === paginationData.totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      html += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      html += `<span>...</span>`;
    }
  }
  html += `<button ${currentPage === paginationData.totalPages ? 'disabled' : ''} id="nextPage">Next ›</button>`;
  html += `<span style="margin-left:12px; color:#666;">Page ${currentPage} of ${paginationData.totalPages} (${paginationData.total} total)</span>`;
  html += '</div>';
  if (pagEl) pagEl.innerHTML = html;

  document.getElementById('prevPage')?.addEventListener('click', () => {
    if (currentPage > 1) loadPage(currentPage - 1);
  });
  document.getElementById('nextPage')?.addEventListener('click', () => {
    if (currentPage < paginationData.totalPages) loadPage(currentPage + 1);
  });
  document.querySelectorAll('[data-page]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-page');
      const num = val ? parseInt(val, 10) : NaN;
      if (!Number.isNaN(num)) loadPage(num);
    });
  });
}

function render(rows) {
  const wrap = document.getElementById('tableWrap');
  if (!wrap) return;
  if (!rows.length) {
    wrap.innerHTML = '<p class="muted">No messages yet.</p>';
    return;
  }
  const STATUS_BADGE = {
    new: 'badge text-bg-primary',
    read: 'badge text-bg-info',
    replied: 'badge text-bg-success',
    closed: 'badge text-bg-secondary',
  };
  const PRIORITY_BADGE = {
    normal: 'badge text-bg-secondary',
    high: 'badge text-bg-warning',
    urgent: 'badge text-bg-danger',
  };
  const html = [
    `<table class="table table-striped"><thead><tr>
          <th>Name</th><th>Contact</th><th>Subject</th><th>Message</th><th>Status</th><th>Priority</th><th>Created</th><th>Actions</th>
        </tr></thead><tbody>`,
    ...rows.map((r) => {
      const msg = ('Hello ' + r.name + ', this is JyotirSetu regarding your message: ' + r.subject)
        .replace(/\r?\n/g, '\n')
        .normalize('NFC');
      const wa = r.phone
        ? `https://api.whatsapp.com/send?phone=${encodeURIComponent(formatWaPhone(r.phone))}&text=${encodeURIComponent(msg)}`
        : '';
      return `<tr>
            <td>${r.name}</td>
            <td>
              <div>${r.email}</div>
              <div class="muted">${r.phone || ''}</div>
            </td>
            <td>${r.subject}</td>
            <td class="muted">${(r.message || '').slice(0, 120)}${(r.message || '').length > 120 ? '...' : ''}</td>
            <td>
              <select data-id="${r.id}" data-field="status" class="form-select form-select-sm statusSel">
                ${['new', 'read', 'replied', 'closed'].map((s) => `<option ${(r.status || 'new') === s ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
              <span class="${STATUS_BADGE[r.status || 'new']}">${r.status || 'new'}</span>
            </td>
            <td>
              <select data-id="${r.id}" data-field="priority" class="form-select form-select-sm prioritySel">
                ${['normal', 'high', 'urgent'].map((p) => `<option ${(r.priority || 'normal') === p ? 'selected' : ''}>${p}</option>`).join('')}
              </select>
              <span class="${PRIORITY_BADGE[r.priority || 'normal']}">${r.priority || 'normal'}</span>
            </td>
            <td class="muted">${new Date(r.created_at).toLocaleString()}</td>
            <td class="actions">
              <a class="btn-sm" href="mailto:${r.email}?subject=Re:%20${encodeURIComponent(r.subject)}">Reply</a>
              ${r.phone ? `<a class="btn-sm" target="_blank" href="${wa}">WhatsApp</a>` : ''}
              <a class="btn-sm" href="#" data-notes-id="${r.id}" style="color:#f59e0b">📝 Notes</a>
            </td>
          </tr>`;
    }),
    '</tbody></table>',
  ].join('');
  wrap.innerHTML = html;

  document.querySelectorAll('.statusSel').forEach((el) => {
    el.addEventListener('change', async (e) => {
      const target = e.target;
      if (!target) return;
      const id = target.getAttribute('data-id');
      const status = target.value;
      const res = await fetch('/api/admin/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (json.ok) {
        const row = allData.find((r) => r.id === id);
        if (row) row.status = status;
        render(applyFilters(allData));
      }
    });
  });

  document.querySelectorAll('.prioritySel').forEach((el) => {
    el.addEventListener('change', async (e) => {
      const target = e.target;
      if (!target) return;
      const id = target.getAttribute('data-id');
      const priority = target.value;
      const res = await fetch('/api/admin/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, priority }),
      });
      const json = await res.json();
      if (json.ok) {
        const row = allData.find((r) => r.id === id);
        if (row) row.priority = priority;
        render(applyFilters(allData));
      }
    });
  });
}

function applyFilters(all) {
  const searchEl = document.getElementById('search');
  const statusEl = document.getElementById('statusFilter');
  const priorityEl = document.getElementById('priorityFilter');
  const q = (searchEl?.value || '').toLowerCase();
  const s = statusEl?.value || '';
  const p = priorityEl?.value || '';
  return all.filter(
    (r) =>
      (!q || (r.name + ' ' + r.email + ' ' + r.subject + ' ' + (r.message || '')).toLowerCase().includes(q)) &&
      (!s || (r.status || 'new') === s) &&
      (!p || (r.priority || 'normal') === p)
  );
}

async function loadPage(page) {
  currentPage = page;
  const wrap = document.getElementById('tableWrap');
  if (wrap) {
    wrap.innerHTML = Array(8)
      .fill(0)
      .map(function () {
        return '<div style="display:flex;gap:12px;padding:10px 12px"><div style="background:#e5e7eb;height:12px;width:80px;border-radius:8px"></div><div style="background:#e5e7eb;height:12px;width:160px;border-radius:8px"></div><div style="background:#e5e7eb;height:12px;width:220px;border-radius:8px"></div></div>';
      })
      .join('');
  }
  allData = await fetchData(page);
  render(applyFilters(allData));
  renderPagination();
}
window.loadPage = loadPage;

function getSelectedColumns() {
  const saved = localStorage.getItem('contacts_export_fields');
  const defaultCols = ['id', 'name', 'email', 'phone', 'subject', 'message', 'status', 'priority', 'created_at'];
  try {
    const parsed = saved ? JSON.parse(saved) : null;
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch (e) {
    console.debug('Failed to parse export fields for contacts', e);
  }
  return defaultCols;
}
document.getElementById('exportBtn')?.addEventListener('click', () => {
  const fromEl = document.getElementById('fromDate');
  const toEl = document.getElementById('toDate');
  const params = new URLSearchParams({ type: 'contacts', format: 'csv' });
  if (fromEl?.value) params.set('from', fromEl.value);
  if (toEl?.value) params.set('to', toEl.value);
  const fields = getSelectedColumns();
  if (fields && fields.length) params.set('fields', fields.join(','));
  window.open(`/api/admin/export?${params.toString()}`, '_blank');
});

const allColumns = ['id', 'name', 'email', 'phone', 'subject', 'message', 'status', 'priority', 'created_at'];
function renderColumnsModal() {
  const list = document.getElementById('columnsList');
  const chosen = new Set(getSelectedColumns());
  if (!list) return;
  list.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">${allColumns
    .map(
      (k) => `
          <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" value="${k}" ${chosen.has(k) ? 'checked' : ''} /> <span>${k}</span></label>
        `
    )
    .join('')}</div>`;
}
document.getElementById('columnsBtn')?.addEventListener('click', () => {
  renderColumnsModal();
  document.getElementById('columnsModal')?.classList.add('active');
});
document.getElementById('columnsClose')?.addEventListener('click', () => {
  document.getElementById('columnsModal')?.classList.remove('active');
});
document.getElementById('columnsSave')?.addEventListener('click', () => {
  const boxes = document.querySelectorAll('#columnsList input[type="checkbox"]');
  const chosen = Array.from(boxes)
    .filter((b) => b.checked)
    .map((b) => b.value);
  if (!chosen.length) {
    window.AdminNotify?.error?.('Select at least one column');
    return;
  }
  localStorage.setItem('contacts_export_fields', JSON.stringify(chosen));
  window.AdminNotify?.success?.('Export columns saved');
  document.getElementById('columnsModal')?.classList.remove('active');
});

let currentNotesEntityId = null;
let currentNotesEntityType = 'contact';

document.getElementById('closeNotesModal')?.addEventListener('click', () => {
  const notesModal = document.getElementById('notesModal');
  notesModal?.classList.remove('active');
});

document.getElementById('saveNoteBtn')?.addEventListener('click', async () => {
  if (!currentNotesEntityId) return;
  const newNoteEl = document.getElementById('newNote');
  const noteText = (newNoteEl?.value || '').trim();
  if (!noteText) return;

  const res = await fetch('/api/admin/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      entity_type: currentNotesEntityType,
      entity_id: currentNotesEntityId,
      note_text: noteText,
    }),
  });
  const json = await res.json();
  if (json.ok) {
    if (newNoteEl) newNoteEl.value = '';
    loadNotes(currentNotesEntityId, currentNotesEntityType);
  }
});

async function loadNotes(entityId, entityType) {
  const [notesRes, emailRes, waRes] = await Promise.all([
    fetch(`/api/admin/notes?entity_type=${entityType}&entity_id=${entityId}`).then((r) => r.json()),
    fetch(`/api/admin/email-history?related_id=${entityId}&related_type=${entityType}`).then((r) => r.json()),
    fetch(`/api/admin/whatsapp-history?related_id=${entityId}&related_type=${entityType}`).then((r) => r.json()),
  ]);

  const notesList = document.getElementById('notesList');
  const notes = notesRes.data || [];
  if (notesList)
    notesList.innerHTML = notes.length
      ? notes
          .map(
            (n) => `
          <div data-note-id="${n.id}" style="padding:12px;margin-bottom:10px;background:#0b1220;border-radius:8px;border:1px solid rgba(148,163,184,0.25)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <div style="font-size:12px;color:#94a3b8">${new Date(n.created_at).toLocaleString()}</div>
              <div style="display:flex;gap:8px">
                <button type="button" class="btn-sm" data-action="edit-note" data-id="${n.id}" style="background:#334155;color:#e5e7eb;border:none">Edit</button>
                <button type="button" class="btn-sm" data-action="delete-note" data-id="${n.id}" style="background:#ef4444;color:#fff;border:none">Delete</button>
              </div>
            </div>
            <div data-note-text style="color:#e5e7eb">${n.note_text}</div>
          </div>
        `
          )
          .join('')
      : '<p style="color:#9ca3af;font-size:14px">No notes yet</p>';

  const emailList = document.getElementById('emailHistoryList');
  const emails = emailRes.data || [];
  if (emailList)
    emailList.innerHTML = emails.length
      ? emails
          .map(
            (e) => `
          <div style="padding:8px;margin-bottom:6px;background:#0b1220;border-radius:8px;border:1px solid rgba(148,163,184,0.25);font-size:13px;color:#e5e7eb">
            <div style="font-weight:600;color:#e5e7eb">${e.subject}</div>
            <div style="color:#94a3b8;font-size:11px">${new Date(e.sent_at).toLocaleString()} - ${e.status}</div>
          </div>
        `
          )
          .join('')
      : '<p style="color:#9ca3af;font-size:14px">No emails sent</p>';

  const waList = document.getElementById('whatsappHistoryList');
  const wa = waRes.data || [];
  if (waList)
    waList.innerHTML = wa.length
      ? wa
          .map(
            (w) => `
          <div style="padding:8px;margin-bottom:6px;background:#0b1220;border-radius:8px;border:1px solid rgba(148,163,184,0.25);font-size:13px;color:#e5e7eb">
            <div style="font-weight:600;color:#e5e7eb">${w.message.slice(0, 120)}${w.message.length > 120 ? '...' : ''}</div>
            <div style="color:#94a3b8;font-size:11px">${new Date(w.sent_at).toLocaleString()} - ${w.status} - to ${w.recipient_phone}</div>
          </div>
        `
          )
          .join('')
      : '<p style="color:#9ca3af;font-size:14px">No WhatsApp messages</p>';
}

document.addEventListener('click', async (e) => {
  const target = e.target;
  const notesBtn = target?.closest('[data-notes-id]');
  const editBtn = target?.closest('[data-action="edit-note"]');
  const delBtn = target?.closest('[data-action="delete-note"]');
  if (notesBtn) {
    e.preventDefault();
    currentNotesEntityId = notesBtn.getAttribute('data-notes-id');
    currentNotesEntityType = 'contact';
    const notesModal = document.getElementById('notesModal');
    notesModal?.classList.add('active');
    await loadNotes(currentNotesEntityId, currentNotesEntityType);
    return;
  }
  if (editBtn) {
    e.preventDefault();
    const id = editBtn.getAttribute('data-id');
    const card = document.querySelector(`[data-note-id="${id}"]`);
    const textEl = card?.querySelector('[data-note-text]');
    const current = (textEl?.textContent || '').trim();
    const editModal = document.getElementById('noteEditModal');
    const editText = document.getElementById('noteEditText');
    if (editModal) editModal.style.display = 'block';
    if (editText) editText.value = current || '';
    const saveBtn = document.getElementById('noteEditSave');
    saveBtn?.setAttribute('data-id', String(id || ''));
    return;
  }
  if (delBtn) {
    e.preventDefault();
    const id = delBtn.getAttribute('data-id');
    if (!id) return;
    const delModal = document.getElementById('noteDeleteModal');
    if (delModal) delModal.style.display = 'block';
    const confirmBtn = document.getElementById('noteDeleteConfirmBtn');
    confirmBtn?.setAttribute('data-id', String(id));
    return;
  }
});

document.getElementById('noteEditCancel')?.addEventListener('click', () => {
  const m = document.getElementById('noteEditModal');
  if (m) m.style.display = 'none';
});
document.getElementById('noteEditCancelBtn')?.addEventListener('click', () => {
  const m = document.getElementById('noteEditModal');
  if (m) m.style.display = 'none';
});
document.getElementById('noteEditSave')?.addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  const id = btn.getAttribute('data-id') || '';
  const editText = document.getElementById('noteEditText');
  const next = (editText?.value || '').trim();
  if (!id || next === '') return;
  try {
    const res = await fetch('/api/admin/notes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, note_text: next }),
    });
    const json = await res.json();
    if (json.ok) {
      {
        const m = document.getElementById('noteEditModal');
        if (m) m.style.display = 'none';
      }
      await loadNotes(currentNotesEntityId, currentNotesEntityType);
    }
  } catch (e) {
    console.warn('Failed to update note text', e);
  }
});

document.getElementById('noteDeleteCancel')?.addEventListener('click', () => {
  const m = document.getElementById('noteDeleteModal');
  if (m) m.style.display = 'none';
});
document.getElementById('noteDeleteCancelBtn')?.addEventListener('click', () => {
  const m = document.getElementById('noteDeleteModal');
  if (m) m.style.display = 'none';
});
document.getElementById('noteDeleteConfirmBtn')?.addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  const id = btn.getAttribute('data-id') || '';
  if (!id) return;
  try {
    const res = await fetch('/api/admin/notes?id=' + encodeURIComponent(id), { method: 'DELETE' });
    const json = await res.json();
    if (json.ok) {
      {
        const m = document.getElementById('noteDeleteModal');
        if (m) m.style.display = 'none';
      }
      await loadNotes(currentNotesEntityId, currentNotesEntityType);
    }
  } catch (e) {
    console.warn('Failed to delete note', e);
  }
});

const searchEl = document.getElementById('search');
searchEl?.addEventListener('input', () => render(applyFilters(allData)));
const statusFilterEl = document.getElementById('statusFilter');
statusFilterEl?.addEventListener('change', () => render(applyFilters(allData)));
const priorityFilterEl = document.getElementById('priorityFilter');
priorityFilterEl?.addEventListener('change', () => render(applyFilters(allData)));

document.getElementById('fromDate')?.addEventListener('change', () => { if (typeof window!== 'undefined' && typeof window['loadPage'] === 'function') window['loadPage'](1); });
document.getElementById('toDate')?.addEventListener('change', () => { if (typeof window!== 'undefined' && typeof window['loadPage'] === 'function') window['loadPage'](1); });

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}
document.getElementById('presetToday')?.addEventListener('click', () => {
  const today = new Date();
  document.getElementById('fromDate')?.setAttribute('value', formatDate(today));
  document.getElementById('toDate')?.setAttribute('value', formatDate(today));
  var fe = document.getElementById('fromDate'); if (fe) fe.dispatchEvent(new Event('change'));
});
document.getElementById('preset7')?.addEventListener('click', () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  document.getElementById('fromDate')?.setAttribute('value', formatDate(start));
  document.getElementById('toDate')?.setAttribute('value', formatDate(end));
  var fe2 = document.getElementById('fromDate'); if (fe2) fe2.dispatchEvent(new Event('change'));
});
document.getElementById('presetMonth')?.addEventListener('click', () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  document.getElementById('fromDate')?.setAttribute('value', formatDate(start));
  document.getElementById('toDate')?.setAttribute('value', formatDate(end));
  document.getElementById('fromDate')?.dispatchEvent(new Event('change'));
});
document.getElementById('clearDates')?.addEventListener('click', () => {
  const f = document.getElementById('fromDate');
  const t = document.getElementById('toDate');
  if (f) { f.value = ''; }
  if (t) { t.value = ''; }
  loadPage(1);
});

loadPage(1);

function collectFilters() {
  const fd = document.getElementById('fromDate');
  const td = document.getElementById('toDate');
  const sf = document.getElementById('statusFilter');
  const pf = document.getElementById('priorityFilter');
  const se = document.getElementById('search');
  const fVal = fd instanceof HTMLInputElement ? fd.value || '' : '';
  const tVal = td instanceof HTMLInputElement ? td.value || '' : '';
  const sVal = sf instanceof HTMLSelectElement ? sf.value || '' : '';
  const pVal = pf instanceof HTMLSelectElement ? pf.value || '' : '';
  const qVal = se instanceof HTMLInputElement ? se.value || '' : '';
  const f = fVal, t = tVal, s = sVal, p = pVal, q = qVal;
  const colsSaved = localStorage.getItem('contacts_export_fields');
  const columns = colsSaved ? JSON.parse(colsSaved) : undefined;
  return { from: f, to: t, status: s, priority: p, search: q, columns };
}
async function loadViews() {
  try {
    if (document.visibilityState === 'hidden') return;
    const res = await fetch('/api/admin/views?page=contacts', { keepalive: true });
    if (!res.ok) {
      const sel = document.getElementById('savedViews');
      if (sel) sel.innerHTML = '<option value="">Saved views…</option>';
      return;
    }
    const j = await res.json();
    const sel = document.getElementById('savedViews');
    if (!sel) return;
    const opts = (j?.data || []).map((v) => `<option value="${v.id}">${v.name}</option>`).join('');
    sel.innerHTML = `<option value="">Saved views…</option>${opts}`;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('ERR_ABORTED')) return;
    console.debug('loadViews error', e);
  }
}
function applyView(filters) {
  try {
    const f = filters || {};
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
        el.value = String(val || '');
      }
    };
    setVal('fromDate', f.from || '');
    setVal('toDate', f.to || '');
    setVal('statusFilter', f.status || '');
    setVal('priorityFilter', f.priority || '');
    setVal('search', f.search || '');
    if (Array.isArray(f.columns) && f.columns.length) localStorage.setItem('contacts_export_fields', JSON.stringify(f.columns));
    loadPage(1);
  } catch (e) {
    console.debug('applyView error', e);
  }
}
document.getElementById('savedViews')?.addEventListener('change', async (e) => {
  const sel = e.target;
  const id = sel instanceof HTMLSelectElement ? sel.value || '' : '';
  if (!id) return;
  try {
    const res = await fetch('/api/admin/views?page=contacts');
    const j = await res.json();
    const v = (j?.data || []).find((x) => x.id === id);
    if (v && v.filters) {
      const filters = JSON.parse(v.filters);
      applyView(filters);
    }
  } catch (e) {
    console.debug('savedViews change error', e);
  }
});
document.getElementById('saveViewBtn')?.addEventListener('click', async () => {
  const vne = document.getElementById('viewName');
  const name = vne instanceof HTMLInputElement ? vne.value || '' : '';
  if (!name.trim()) {
    window.AdminNotify?.error?.('Enter a view name');
    return;
  }
  try {
    const filters = collectFilters();
    const res = await fetch('/api/admin/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'contacts', name, filters }),
    });
    const j = await res.json();
    if (j.ok) {
      window.AdminNotify?.success?.('View saved');
      const vn = document.getElementById('viewName');
      if (vn instanceof HTMLInputElement) vn.value = '';
      await loadViews();
    } else {
      window.AdminNotify?.error?.('Save failed', j.error || '');
    }
  } catch (e) {
    window.AdminNotify?.error?.('Save failed');
    console.debug('saveViewBtn error', e);
  }
});
document.getElementById('deleteViewBtn')?.addEventListener('click', async () => {
  const sel = document.getElementById('savedViews');
  const id = sel instanceof HTMLSelectElement ? sel.value || '' : '';
  if (!id) {
    window.AdminNotify?.error?.('Choose a view to delete');
    return;
  }
  try {
    const res = await fetch('/api/admin/views?id=' + encodeURIComponent(id), { method: 'DELETE' });
    const j = await res.json();
    if (j.ok) {
      window.AdminNotify?.success?.('View deleted');
      await loadViews();
    } else {
      window.AdminNotify?.error?.('Delete failed', j.error || '');
    }
  } catch (e) {
    window.AdminNotify?.error?.('Delete failed');
    console.debug('deleteViewBtn error', e);
  }
});
loadViews();

const sidebar = document.getElementById('adminSidebar');
const backdrop = document.getElementById('sidebarBackdrop');
const toggleBtn = document.getElementById('sidebarToggle');
let isOpen = false;

function openSidebar() {
  sidebar?.classList.add('active');
  backdrop?.classList.add('active');
  toggleBtn?.classList.add('active');
  if (toggleBtn) toggleBtn.innerHTML = '✕';
  isOpen = true;
}

function closeSidebar() {
  sidebar?.classList.remove('active');
  backdrop?.classList.remove('active');
  toggleBtn?.classList.remove('active');
  if (toggleBtn) toggleBtn.innerHTML = '☰';
  isOpen = false;
}

toggleBtn?.addEventListener('click', () => {
  if (isOpen) closeSidebar();
  else openSidebar();
});

backdrop?.addEventListener('click', closeSidebar);
sidebar?.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 900) closeSidebar();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isOpen) closeSidebar();
});
(function () {
  const btn = document.getElementById('toggleSidebarDesktop');
  function sync() {
    if (!btn) return;
    const c = document.body.classList.contains('sidebar-collapse');
    btn.textContent = c ? 'Show sidebar' : 'Hide sidebar';
  }
  async function toggle() {
    const c = document.body.classList.toggle('sidebar-collapse');
    sync();
    try {
      await fetch('/api/admin/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'sidebarCollapsed', value: c ? '1' : '0' }),
      });
    } catch (e) {
      console.error('Error saving sidebarCollapsed:', e);
    }
  }
  btn?.addEventListener('click', toggle);
  sync();
})();

function normalizeDateRange() {
  const fromEl = document.getElementById('fromDate');
  const toEl = document.getElementById('toDate');
  const f = fromEl instanceof HTMLInputElement ? fromEl.value || '' : '';
  const t = toEl instanceof HTMLInputElement ? toEl.value || '' : '';
  if (f && t && f > t) {
    if (toEl && toEl instanceof HTMLInputElement) toEl.value = f;
    window.AdminNotify?.info?.('Adjusted date range: To matched From');
  }
}
function renderActiveChips() {
  const chipsEl = document.getElementById('activeChips');
  if (!chipsEl) return;
  const stEl = document.getElementById('statusFilter');
  const pEl = document.getElementById('priorityFilter');
  const qEl = document.getElementById('search');
  const fromEl = document.getElementById('fromDate');
  const toEl = document.getElementById('toDate');
  const st = stEl instanceof HTMLSelectElement ? stEl.value || '' : '';
  const p = pEl instanceof HTMLSelectElement ? pEl.value || '' : '';
  const q = qEl instanceof HTMLInputElement ? qEl.value || '' : '';
  const f = fromEl instanceof HTMLInputElement ? fromEl.value || '' : '';
  const t = toEl instanceof HTMLInputElement ? toEl.value || '' : '';
  const chips = [];
  if (q) chips.push({ key: 'search', label: `Search: ${q}` });
  if (st) chips.push({ key: 'statusFilter', label: `Status: ${st}` });
  if (p) chips.push({ key: 'priorityFilter', label: `Priority: ${p}` });
  if (f) chips.push({ key: 'fromDate', label: `From: ${f}` });
  if (t) chips.push({ key: 'toDate', label: `To: ${t}` });
  const hasAny = chips.length > 0;
  chipsEl.innerHTML = hasAny
    ? chips.map((c) => `<button class="pill" data-clear="${c.key}">${c.label} ✕</button>`).join('') + `<button class="pill" data-clear="__all__">Clear all ✕</button>`
    : '';
  chipsEl.querySelectorAll('[data-clear]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const t2 = e.currentTarget;
      const key = t2 instanceof Element ? t2.getAttribute('data-clear') || '' : '';
      if (!key) return;
      if (key === '__all__') {
        ['search', 'statusFilter', 'priorityFilter', 'fromDate', 'toDate'].forEach((id) => {
          const el = document.getElementById(id);
          if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
            el.value = '';
          }
        });
      } else {
        const el = document.getElementById(key);
        if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
          el.value = '';
        }
      }
      if (typeof window!== 'undefined' && typeof window['loadPage'] === 'function') window['loadPage'](1);
      renderActiveChips();
    });
  });
}
document.getElementById('fromDate')?.addEventListener('change', () => {
  normalizeDateRange();
  if (typeof window!== 'undefined' && typeof window['loadPage'] === 'function') window['loadPage'](1);
  renderActiveChips();
});
document.getElementById('toDate')?.addEventListener('change', () => {
  normalizeDateRange();
  if (typeof window!== 'undefined' && typeof window['loadPage'] === 'function') window['loadPage'](1);
  renderActiveChips();
});
document.getElementById('preset30')?.addEventListener('click', () => {
  const fromEl = document.getElementById('fromDate');
  const toEl = document.getElementById('toDate');
  const d = new Date();
  const to = d.toISOString().slice(0, 10);
  d.setDate(d.getDate() - 30);
  const from = d.toISOString().slice(0, 10);
  if (fromEl instanceof HTMLInputElement) fromEl.value = from;
  if (toEl instanceof HTMLInputElement) toEl.value = to;
  if (typeof window!== 'undefined' && typeof window['loadPage'] === 'function') window['loadPage'](1);
  renderActiveChips();
});
['statusFilter', 'priorityFilter'].forEach((id) => {
  document.getElementById(id)?.addEventListener('change', () => {
    renderActiveChips();
  });
});
{ const se = document.getElementById('search'); if (se instanceof HTMLInputElement) se.addEventListener('input', () => { renderActiveChips(); }); }
renderActiveChips();

