// Minimal AdminNotify helper used by Admin pages
// Provides window.AdminNotify.success/error/info to show lightweight toasts
(function(){
  try{
    const rootId = 'admin-toast-root';
    function ensureRoot(){
      let r = document.getElementById(rootId);
      if(!r){
        r = document.createElement('div');
        r.id = rootId;
        r.style.position = 'fixed';
        r.style.top = '16px';
        r.style.right = '16px';
        r.style.zIndex = '99999';
        r.style.display = 'flex';
        r.style.flexDirection = 'column';
        r.style.gap = '8px';
        document.body.appendChild(r);
      }
      return r;
    }

    function makeToast(kind, title, message){
      const r = ensureRoot();
      const el = document.createElement('div');
      el.role = 'status';
      el.style.display = 'flex';
      el.style.alignItems = 'start';
      el.style.gap = '8px';
      el.style.minWidth = '260px';
      el.style.maxWidth = '380px';
      el.style.padding = '10px 12px';
      el.style.borderRadius = '10px';
      el.style.border = '1px solid rgba(255,255,255,0.15)';
      el.style.boxShadow = '0 6px 24px rgba(0,0,0,0.25)';
      el.style.backdropFilter = 'blur(6px)';
      el.style.background = 'rgba(20, 24, 40, 0.85)';
      el.style.color = '#cfe8ea';
      const dot = document.createElement('span');
      dot.style.display = 'inline-block';
      dot.style.width = '10px';
      dot.style.height = '10px';
      dot.style.borderRadius = '50%';
      dot.style.marginTop = '4px';
      if(kind === 'success') dot.style.background = '#22c55e';
      else if(kind === 'error') dot.style.background = '#ef4444';
      else dot.style.background = '#3498db';
      const content = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = String(title|| (kind==='success'?'Success':'Notice'));
      strong.style.display = 'block';
      strong.style.marginBottom = '2px';
      const p = document.createElement('div');
      p.textContent = String(message||'');
      p.style.fontSize = '13px';
      p.style.color = '#8bb0b3';
      content.appendChild(strong);
      content.appendChild(p);
      const close = document.createElement('button');
      close.textContent = '×';
      close.setAttribute('aria-label','Dismiss');
      close.style.marginLeft = 'auto';
      close.style.background = 'transparent';
      close.style.border = 'none';
      close.style.color = '#cfe8ea';
      close.style.cursor = 'pointer';
      close.style.fontSize = '16px';
      close.addEventListener('click', ()=>{ try{ r.removeChild(el); }catch(err){ void err; } });
      el.appendChild(dot);
      el.appendChild(content);
      el.appendChild(close);
      r.appendChild(el);
      setTimeout(()=>{ try{ r.removeChild(el); }catch(err){ void err; } }, 4000);
    }

    window.AdminNotify = {
      success(msg, detail){ makeToast('success', 'Success', detail? (msg+': '+detail) : msg); },
      error(msg, detail){ makeToast('error', 'Error', detail? (msg+': '+detail) : msg); },
      info(msg, detail){ makeToast('info', 'Info', detail? (msg+': '+detail) : msg); }
    };
  }catch(e){ void e; }
})();