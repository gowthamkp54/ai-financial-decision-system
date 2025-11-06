// ============================================================
// COGNIFIN — Shared Frontend Utilities
// ============================================================

const API_BASE = '/api';

// ── Auth ──────────────────────────────────────────────────
const Auth = {
  getSessionId() { return localStorage.getItem('cognifin_session'); },
  getUser() { try { return JSON.parse(localStorage.getItem('cognifin_user')); } catch { return null; } },
  setSession(sessionId, user) {
    localStorage.setItem('cognifin_session', sessionId);
    localStorage.setItem('cognifin_user', JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem('cognifin_session');
    localStorage.removeItem('cognifin_user');
  },
  isLoggedIn() { return !!this.getSessionId(); },
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = '/login';
      return false;
    }
    return true;
  },
  requireGuest() {
    if (this.isLoggedIn()) {
      window.location.href = '/dashboard';
      return false;
    }
    return true;
  }
};

// ── API ───────────────────────────────────────────────────
const api = {
  headers() {
    const h = { 'Content-Type': 'application/json' };
    const sid = Auth.getSessionId();
    if (sid) h['x-session-id'] = sid;
    return h;
  },
  async get(path) {
    const r = await fetch(API_BASE + path, { headers: this.headers() });
    if (r.status === 401) { Auth.clear(); window.location.href = '/login'; return null; }
    return r.json();
  },
  async post(path, body) {
    const r = await fetch(API_BASE + path, { method: 'POST', headers: this.headers(), body: JSON.stringify(body) });
    return r.json();
  },
  async put(path, body) {
    const r = await fetch(API_BASE + path, { method: 'PUT', headers: this.headers(), body: JSON.stringify(body) });
    return r.json();
  },
  async del(path) {
    const r = await fetch(API_BASE + path, { method: 'DELETE', headers: this.headers() });
    return r.json();
  }
};

// ── Cursor ────────────────────────────────────────────────
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (!cursor || !ring) return;
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    setTimeout(() => { ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px'; }, 80);
  });
  document.querySelectorAll('a,button,.btn,.nav-item,.card,input,textarea,select').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '20px'; cursor.style.height = '20px'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '10px'; cursor.style.height = '10px'; });
  });
}

// ── Sidebar ───────────────────────────────────────────────
function initSidebar() {
  const user = Auth.getUser();
  if (!user) return;

  // Set user info in sidebar footer
  const nameEl = document.getElementById('sidebarUserName');
  const planEl = document.getElementById('sidebarUserPlan');
  const avEl = document.getElementById('sidebarUserAv');
  if (nameEl) nameEl.textContent = user.name;
  if (planEl) planEl.textContent = user.plan === 'autopilot' ? '★ Autopilot' : 'Starter';
  if (avEl) avEl.textContent = user.name[0].toUpperCase();

  // Mark active nav
  const path = window.location.pathname;
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    if (el.dataset.page === path) el.classList.add('active');
  });

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await api.post('/auth/logout', {});
    Auth.clear();
    window.location.href = '/login';
  });

  // Mobile toggle
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  toggle?.addEventListener('click', () => sidebar.classList.toggle('open'));
}

// ── Toast ─────────────────────────────────────────────────
function toast(msg, type = 'info', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icons = { success: '✓', error: '✗', info: '●', warning: '⚠' };
  el.innerHTML = `<span>${icons[type] || '●'}</span><span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(20px)'; el.style.transition = '0.3s'; setTimeout(() => el.remove(), 300); }, duration);
}

// ── Format helpers ────────────────────────────────────────
function fmt(n) { return '₹' + Math.abs(n).toLocaleString('en-IN'); }
function fmtPct(n) { return (n > 0 ? '+' : '') + n.toFixed(2) + '%'; }
function fmtDate(iso) { return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }

// ── Markdown renderer (simple) ─────────────────────────────
function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

// ── Init on DOM ready ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initSidebar();
});
