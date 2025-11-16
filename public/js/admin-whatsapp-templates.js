// WhatsApp Templates page client-side logic
(function(){
  const textArea = document.getElementById('text');
  if (!textArea) return;

  function updatePreview() {
    const text = textArea.value;
    const preview = document.getElementById('preview');
    const charCountEl = document.getElementById('charCount');
    const sampleText = text
      .replace(/\{name\}/g, 'John Doe')
      .replace(/\{service\}/g, 'Kundli Analysis')
      .replace(/\{date\}/g, '2024-01-15')
      .replace(/\{time\}/g, '10:00 AM')
      .replace(/\{method\}/g, 'Video Call')
      .replace(/\{status\}/g, 'confirmed')
      .replace(/\{appointment_id\}/g, 'APPT-0001');
    if (preview) preview.innerHTML = sampleText || '<span class="muted">Preview will appear here</span>';
    const count = text.length;
    if (charCountEl) {
      charCountEl.textContent = count + ' characters (WhatsApp limit: 4096)';
      charCountEl.className = 'char-count';
      if (count > 4096) charCountEl.classList.add('error');
      else if (count > 160) charCountEl.classList.add('warning');
    }
  }

  const defaultTemplates = [
    { key: 'pending', text: [
      'Dear {name},','',
      '🙏 Thank you for choosing JyotirSetu Astrology. We have received your appointment request for {service}.','',
      '🕐 Your appointment is currently pending. We will confirm your slot based on availability and inform you shortly.','',
      '📋 Appointment Details:','• 🆔 Appointment ID: {appointment_id}','• 📆 Date: {date}','• ⏰ Time: {time}','• 🧭 Consultation Method: {method}'
    ].join('\n') },
    { key: 'confirmed', text: [
      'Dear {name},','',
      '✅ Your appointment for {service} is confirmed on {date} at {time} ({method}).','',
      '📝 To prepare and provide accurate guidance, please share your horoscope details in reply:','• Birth Date','• Birth Time','• Birth Place','• Gender','',
      '🆔 Appointment ID: {appointment_id}','',
      '💬 Feel free to include any specific questions you want us to focus on.','',
      '🔗 Follow for tips and updates: https://follow.jyotirsetu.com','',
      'Looking forward to connecting,','JyotirSetu Astrology'
    ].join('\n') },
    { key: 'rescheduled', text: [
      'Dear {name},','',
      '🔁 Your appointment for {service} has been rescheduled to {date} at {time} ({method}).','',
      '📝 To prepare and provide accurate guidance, please share your horoscope details in reply:','• Birth Date','• Birth Time','• Birth Place','• Gender','',
      '🆔 Appointment ID: {appointment_id}','',
      '🔗 Follow for tips and updates: https://follow.jyotirsetu.com','',
      'Warm regards,','JyotirSetu Astrology'
    ].join('\n') },
    { key: 'cancelled_user', text: [
      'Dear {name},','',
      '❌ As per your request, your appointment for {service} has been cancelled.','',
      '🆔 Appointment ID: {appointment_id}','',
      'We look forward to connecting with you again. Feel free to reply to this message to book a new slot at your convenience.','',
      '🔗 Explore updates and insights: https://follow.jyotirsetu.com','',
      'Warm regards,','JyotirSetu Astrology'
    ].join('\n') },
    { key: 'cancelled_provider', text: [
      'Dear {name},','',
      '⚠️ We sincerely apologize — your appointment for {service} has been cancelled due to unforeseen circumstances.','',
      '🆔 Appointment ID: {appointment_id}','',
      'We value your time and will reach out shortly to offer alternate slots. If you prefer, please reply with your availability.','',
      'Thank you for your understanding.','',
      '🔗 Stay connected: https://follow.jyotirsetu.com','',
      'Warm regards,','JyotirSetu Astrology'
    ].join('\n') }
  ];

  function renderQuickTemplates() {
    const container = document.getElementById('quickTemplates');
    if (!container) return;
    container.innerHTML = defaultTemplates.map(function(t){
      const short = t.text.length > 120 ? (t.text.slice(0, 120) + '…') : t.text;
      return '<div class="template-card">' +
        '<div style="font-weight:600;margin-bottom:4px">' + t.key + '</div>' +
        '<div class="muted" style="font-size:12px;margin-bottom:8px">' + short + '</div>' +
        '<div style="display:flex;gap:8px">' +
          '<button class="btn-sm" data-use="' + t.key + '" style="background:#25d366;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:11px">Use</button>' +
          '<button class="btn-sm" data-save="' + t.key + '" style="background:#0ea5e9;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:11px">Save</button>' +
        '</div>' +
      '</div>';
    }).join('');

    container.querySelectorAll('[data-use]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-use');
        const t = defaultTemplates.find(x => x.key === key);
        if (t) {
          const keyEl = document.getElementById('key');
          if (keyEl) keyEl.value = t.key;
          textArea.value = t.text;
          updatePreview();
          window.AdminNotify?.info('Loaded', 'Template moved into editor');
        }
      });
    });

    container.querySelectorAll('[data-save]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const key = btn.getAttribute('data-save');
        const t = defaultTemplates.find(x => x.key === key);
        if (t) {
          await saveTemplate(t.key, t.text);
        }
      });
    });
  }

  async function loadTemplates() {
    const res = await fetch('/api/admin/templates?type=whatsapp');
    const json = await res.json();
    const list = document.getElementById('templateList');
    const templates = json.data || [];
    if (!list) return;
    list.innerHTML = templates.length ? templates.map(function(t) {
      return '<div class="template-card" data-key="' + t.key + '">' +
        '<div style="font-weight:600;margin-bottom:4px">' + t.key + '</div>' +
        '<div class="muted" style="font-size:12px;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + t.text.slice(0,80) + '...</div>' +
        '<div class="muted" style="font-size:11px;margin-bottom:8px">Updated: ' + new Date(t.updated_at).toLocaleDateString() + '</div>' +
        '<div style="display:flex;gap:8px">' +
          '<button class="btn-sm" data-edit="' + t.key + '" style="background:#25d366;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:11px;flex:1">Edit</button>' +
          '<button class="btn-sm" data-delete="' + t.key + '" style="background:#ef4444;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:11px">Delete</button>' +
        '</div>' +
        '</div>';
    }).join('') : '<p class="muted">No templates saved yet</p>';

    list.querySelectorAll('[data-edit]').forEach(b => {
      b.addEventListener('click', async () => {
        const key = b.getAttribute('data-edit');
        const t = templates.find(x => x.key === key);
        const keyEl = document.getElementById('key');
        if (t && keyEl) {
          keyEl.value = t.key;
          textArea.value = t.text;
          updatePreview();
        }
      });
    });

    list.querySelectorAll('[data-delete]').forEach(b => {
      b.addEventListener('click', () => {
        const key = b.getAttribute('data-delete');
        const t = templates.find(x => x.key === key) || { key, text: '' };
        const snippet = (t.text || '').slice(0, 160) || '(no message)';
        openDeleteConfirm(t.key, snippet);
      });
    });
  }

  async function saveTemplate(key, text) {
    if (!key || !text) {
      window.AdminNotify?.error('Missing fields', 'Key and Message are required');
      return false;
    }
    const res = await fetch('/api/admin/templates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'whatsapp', key, text: text || textArea.value })
    });
    const json = await res.json();
    if (json.ok) {
      window.AdminNotify?.success('WhatsApp template saved', 'Key: ' + key);
      loadTemplates();
      return true;
    } else {
      window.AdminNotify?.error('Save failed', (json.error || 'Failed to save template'));
      return false;
    }
  }

  let deleteKey = '';
  function openDeleteConfirm(key, messageSnippet) {
    deleteKey = key || '';
    const body = document.getElementById('deleteConfirmBody');
    if (body) body.innerHTML = [
      '<div class="muted" style="color:#94a3b8">Template Key</div><div>' + (key || '') + '</div>',
      '<div class="muted" style="color:#94a3b8">Message</div><div style="max-height:120px;overflow:auto">' + (messageSnippet || '(no message)') + '</div>',
      '<div class="muted" style="color:#ef4444">Warning</div><div>This will permanently delete the template from the database.</div>'
    ].join('');
    const modal = document.getElementById('deleteConfirmModal');
    modal?.classList.add('active');
  }
  function closeDeleteConfirm() {
    const modal = document.getElementById('deleteConfirmModal');
    modal?.classList.remove('active');
    deleteKey = '';
  }

  document.getElementById('saveBtn')?.addEventListener('click', async () => {
    const keyEl = document.getElementById('key');
    const key = keyEl ? keyEl.value.trim() : '';
    await saveTemplate(key);
  });

  document.getElementById('deleteBtn')?.addEventListener('click', () => {
    const keyEl = document.getElementById('key');
    const key = keyEl ? keyEl.value.trim() : '';
    const msg = (textArea.value || '').slice(0, 160);
    if (!key) {
      window.AdminNotify?.error('Missing key', 'Enter template key to delete');
      return;
    }
    openDeleteConfirm(key, msg || '(no message)');
  });

  document.getElementById('seedDefaults')?.addEventListener('click', async () => {
    for (const t of defaultTemplates) {
      await saveTemplate(t.key, t.text);
    }
    window.AdminNotify?.success('Defaults seeded', 'All WhatsApp defaults saved');
    loadTemplates();
  });

  document.getElementById('testBtn')?.addEventListener('click', async () => {
    const text = textArea.value;
    if (!text) {
      window.AdminNotify?.error('Message required', 'Please enter a message to test');
      return;
    }
    const phone = prompt('Enter phone number (with country code, e.g., 919876543210):');
    if (phone) {
      const message = text
        .replace(/\{name\}/g, 'Test User')
        .replace(/\{service\}/g, 'Test Service')
        .replace(/\{date\}/g, new Date().toLocaleDateString())
        .replace(/\{time\}/g, '10:00 AM')
        .replace(/\{method\}/g, 'Video Call')
        .replace(/\{status\}/g, 'confirmed');
      try {
        await fetch('/api/admin/whatsapp-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient_phone: String(phone).replace(/\D/g, ''),
            recipient_name: 'Test User',
            message,
            type: 'test',
            status: 'sent'
          })
        });
      } catch (e) {
        console.warn('Failed to record WhatsApp test history', e);
      }
      const url = 'https://wa.me/' + phone.replace(/\D/g, '') + '?text=' + encodeURIComponent(message);
      window.open(url, '_blank');
    }
  });

  document.getElementById('exportBtn')?.addEventListener('click', async () => {
    const res = await fetch('/api/admin/templates?type=whatsapp');
    const json = await res.json();
    const dataStr = JSON.stringify(json.data || [], null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'whatsapp-templates-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
  });

  textArea.addEventListener('input', updatePreview);
  textArea.addEventListener('keyup', updatePreview);

  document.querySelectorAll('.variable-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const varName = tag.getAttribute('data-var') || '';
      const start = textArea.selectionStart || 0;
      const end = textArea.selectionEnd || 0;
      const text = textArea.value;
      textArea.value = text.substring(0, start) + varName + text.substring(end);
      textArea.selectionStart = textArea.selectionEnd = start + varName.length;
      textArea.focus();
      updatePreview();
    });
  });

  document.getElementById('deleteClose')?.addEventListener('click', closeDeleteConfirm);
  document.getElementById('deleteCancel')?.addEventListener('click', closeDeleteConfirm);
  document.getElementById('deleteConfirm')?.addEventListener('click', async () => {
    if (!deleteKey) return closeDeleteConfirm();
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'whatsapp', key: deleteKey })
      });
      const json = await res.json();
      if (json.ok) {
        window.AdminNotify?.success('Template deleted', deleteKey);
        const keyEl = document.getElementById('key');
        const currentKey = keyEl ? keyEl.value.trim() : '';
        if (currentKey === deleteKey) {
          if (keyEl) keyEl.value = '';
          textArea.value = '';
          updatePreview();
        }
        await loadTemplates();
        closeDeleteConfirm();
      } else {
        window.AdminNotify?.error('Delete failed', json.error || 'Unknown error');
      }
    } catch (e) {
      window.AdminNotify?.error('Delete failed', String(e && (e.message || e) || 'Unknown error'));
    }
  });

  loadTemplates();
  renderQuickTemplates();
  updatePreview();
})();