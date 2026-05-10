const API_URL = 'http://localhost:3000/api';

function getToken()         { return localStorage.getItem('token'); }
function setToken(t)        { localStorage.setItem('token', t); }
function removeToken()      { localStorage.removeItem('token'); }

function getAdminToken()    { return localStorage.getItem('admin_token'); }
function setAdminToken(t)   { localStorage.setItem('admin_token', t); }
function removeAdminToken() { localStorage.removeItem('admin_token'); }

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() };
}

function adminHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getAdminToken() };
}

function requireAuth() {
  if (!getToken()) window.location.href = '/frontend/pages/login.html';
}

function requireAdminAuth() {
  if (!getAdminToken()) window.location.href = '/frontend/pages/admin/login.html';
}

function showError(elementId, msg) {
  const el = document.getElementById(elementId);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function showToast(msg, type = '') {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'toast' + (type ? ' ' + type : '');
  t.textContent = msg;
  t.style.cssText += ';animation:none;opacity:0;transform:translateY(10px);transition:opacity 0.25s ease,transform 0.25s ease';
  document.body.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    t.style.opacity = '1';
    t.style.transform = 'translateY(0)';
  }));
  setTimeout(() => t.remove(), 4000);
}

function renderPagination(containerId, pagination, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  if (pagination.totalPages <= 1) {
    container.style.display = 'none';
    return;
  }

  container.style.display = '';

  const btn = (label, page, disabled) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.disabled = disabled;
    b.onclick = () => onPageChange(page);
    return b;
  };

  container.appendChild(btn('← Anterior', pagination.page - 1, pagination.page <= 1));
  const info = document.createElement('span');
  info.textContent = `Página ${pagination.page} de ${pagination.totalPages}`;
  container.appendChild(info);
  container.appendChild(btn('Próximo →', pagination.page + 1, pagination.page >= pagination.totalPages));
}
