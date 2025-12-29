// --- Dark Mode Logic ---
function applyTheme(theme) {
  document.body.classList.toggle('dark-theme', theme === 'dark');
}

function loadTheme() {
  const theme = localStorage.getItem('rdata_theme') || 'light';
  applyTheme(theme);
  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.checked = theme === 'dark';
}

function saveTheme(isDark) {
  localStorage.setItem('rdata_theme', isDark ? 'dark' : 'light');
  applyTheme(isDark ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('change', e => saveTheme(e.target.checked));
  }
});
// --- Dark Mode Logic ---
function applyTheme(theme) {
  document.body.classList.toggle('dark-theme', theme === 'dark');
}

function loadTheme() {
  const theme = localStorage.getItem('rdata_theme') || 'light';
  applyTheme(theme);
  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.checked = theme === 'dark';
}

function saveTheme(isDark) {
  localStorage.setItem('rdata_theme', isDark ? 'dark' : 'light');
  applyTheme(isDark ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('change', e => saveTheme(e.target.checked));
  }
});
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
const notificationBtn = document.getElementById('notificationBtn');
const notificationPanel = document.getElementById('notificationPanel');
const closeNotifications = document.getElementById('closeNotifications');
const markAllRead = document.getElementById('markAllRead');
const notificationCount = document.getElementById('notificationCount');
const toast = document.getElementById('toast');
const notificationSound = document.getElementById('notificationSound');
const soundToggle = document.getElementById('soundToggle');

// Load sound preference from localStorage
if (localStorage.getItem('soundEnabled') === 'false') {
  soundToggle.checked = false;
}

// Sidebar toggle
hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
});

// Close sidebar when overlay is clicked
overlay.addEventListener('click', () => {
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
  notificationPanel.classList.remove('active');
});

// Dropdown toggle
dropdownToggles.forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    toggle.parentElement.classList.toggle('open');
  });
});

// Notification panel toggle
notificationBtn.addEventListener('click', () => {
  notificationPanel.classList.toggle('active');
});

// Close notifications
closeNotifications.addEventListener('click', () => {
  notificationPanel.classList.remove('active');
});

// Mark all as read
markAllRead.addEventListener('click', () => {
  notificationCount.textContent = "0";
  const list = notificationPanel.querySelector('ul');
  list.innerHTML = "<li>No new notifications</li>";
});

// --- Fetch real notifications from backend ---
async function fetchNotifications() {
  try {
    const res = await fetch('/api/admin/notifications');
    const data = await res.json();
    renderNotifications(data.notifications);
  } catch (err) {
    console.error('Failed to fetch notifications:', err);
  }
}

function renderNotifications(notifications) {
  const list = notificationPanel.querySelector('ul');
  if (!list) return;
  list.innerHTML = notifications.length
    ? notifications.map(n => `<li>${n.message} <span style="font-size:0.8em;color:#888;">(${n.date})</span></li>`).join('')
    : '<li>No notifications</li>';
  notificationCount.textContent = notifications.length;
  notificationCount.style.display = notifications.length ? 'inline-block' : 'none';
}

document.addEventListener('DOMContentLoaded', fetchNotifications);
// --- Admin Navbar Links ---
const adminNavbarLinks = [
  { name: 'Dashboard', href: 'dashboard.html' },
  { name: 'All Agents', href: 'all-agents.html' },
  { name: 'Pending Approvals', href: 'pending-approvals.html' },
  { name: 'Suspended Agents', href: 'suspended-agents.html' },
  { name: 'Pricing', href: 'pricing.html' },
  { name: 'Discounts', href: 'discounts.html' },
  { name: 'Sales Report', href: 'sales-report.html' },
  { name: 'Agent Performance', href: 'agent-performance.html' },
  { name: 'Revenue Analytics', href: 'revenue-analytics.html' },
  { name: 'Admin Settings', href: 'admin-settings.html' },
  // ...add more links as needed
];

function renderAdminNavbar() {
  const navbar = document.getElementById('adminNavbar');
  if (!navbar) return;
  navbar.innerHTML = `
    <nav class="admin-navbar">
      <ul>
        ${adminNavbarLinks.map(link => `<li><a href="${link.href}">${link.name}</a></li>`).join('')}
      </ul>
    </nav>
  `;
}
document.addEventListener('DOMContentLoaded', renderAdminNavbar);
// --- User Management Logic ---
const userTableBody = document.getElementById('userTableBody');
const addUserBtns = document.querySelectorAll('.addUserBtn');
const userModal = document.getElementById('userModal');
const userModalTitle = document.getElementById('userModalTitle');
const userForm = document.getElementById('userForm');
const closeUserModal = document.getElementById('closeUserModal');
const modalUserName = document.getElementById('modalUserName');
const modalUserEmail = document.getElementById('modalUserEmail');
const modalUserRole = document.getElementById('modalUserRole');
const modalUserStatus = document.getElementById('modalUserStatus');
const selectAllUsers = document.getElementById('selectAllUsers');
const bulkApproveBtn = document.getElementById('bulkApproveBtn');
const bulkSuspendBtn = document.getElementById('bulkSuspendBtn');
const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
const searchUsers = document.getElementById('searchUsers');
const filterRole = document.getElementById('filterRole');

// --- Fetch real users from backend ---
let users = [];
async function fetchUsers() {
  try {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    users = data.users || [];
    renderUsers();
  } catch (err) {
    console.error('Failed to fetch users:', err);
  }
}
document.addEventListener('DOMContentLoaded', fetchUsers);
let editingUserId = null;

function saveUsers() {
  localStorage.setItem('admin_users', JSON.stringify(users));
}

function renderUsers() {
  let filtered = users;
  const search = (searchUsers && searchUsers.value.trim().toLowerCase()) || '';
  const role = (filterRole && filterRole.value) || '';
  if (search) {
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.status.toLowerCase().includes(search)
    );
  }
  if (role) {
    filtered = filtered.filter(u => u.role === role);
  }
  userTableBody.innerHTML = filtered.map(u => `
    <tr>
      <td><input type="checkbox" class="user-checkbox" data-id="${u.id}"></td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>
        <select class="role-select" data-id="${u.id}">
          <option value="admin" ${u.role==='admin'?'selected':''}>Admin</option>
          <option value="agent" ${u.role==='agent'?'selected':''}>Agent</option>
          <option value="viewer" ${u.role==='viewer'?'selected':''}>Viewer</option>
        </select>
      </td>
      <td>${u.status || (u.paid ? 'Active' : 'Pending') }</td>
      <td>
        <button class="edit-btn" data-id="${u.id}">Edit</button>
        <button class="delete-btn" data-id="${u.id}">Delete</button>
        ${u.role === 'agent' && !u.paid ? `<button class="approve-btn" data-id="${u.id}">Approve</button>` : ''}
      </td>
    </tr>
  `).join('');
}

function openUserModal(editId = null) {
  userModal.style.display = 'flex';
  if (editId) {
    const user = users.find(u => u.id === editId);
    modalUserName.value = user.name;
    modalUserEmail.value = user.email;
    modalUserRole.value = user.role;
    modalUserStatus.value = user.status;
    userModalTitle.textContent = 'Edit User';
    editingUserId = editId;
  } else {
    userForm.reset();
    userModalTitle.textContent = 'Add User';
    editingUserId = null;
  }
}

function closeModal() {
  userModal.style.display = 'none';
}

addUserBtns.forEach(btn => btn.addEventListener('click', () => openUserModal()));
closeUserModal && closeUserModal.addEventListener('click', closeModal);

userForm && userForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = modalUserName.value.trim();
  const email = modalUserEmail.value.trim();
  const role = modalUserRole.value;
  const status = modalUserStatus.value;
  if (editingUserId) {
    const idx = users.findIndex(u => u.id === editingUserId);
    users[idx] = {...users[idx], name, email, role, status};
    showToast('User updated');
  } else {
    users.push({id: Date.now(), name, email, role, status});
    showToast('User added');
  }
  saveUsers();
  renderUsers();
  closeModal();
});

userTableBody && userTableBody.addEventListener('click', async e => {
  if (e.target.classList.contains('edit-btn')) {
    openUserModal(Number(e.target.getAttribute('data-id')));
  } else if (e.target.classList.contains('delete-btn')) {
    const id = Number(e.target.getAttribute('data-id'));
    users = users.filter(u => u.id !== id);
    saveUsers();
    renderUsers();
    showToast('User deleted');
  } else if (e.target.classList.contains('approve-btn')) {
    const id = Number(e.target.getAttribute('data-id'));
    try {
      const res = await fetch(`/api/admin/approve-payment/${id}`, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        showToast('Agent approved!');
        fetchUsers();
      } else {
        showToast(data.error || 'Approval failed');
      }
    } catch (err) {
      showToast('Approval failed');
    }
  }
});

userTableBody && userTableBody.addEventListener('change', e => {
  if (e.target.classList.contains('role-select')) {
    const id = Number(e.target.getAttribute('data-id'));
    const role = e.target.value;
    const idx = users.findIndex(u => u.id === id);
    users[idx].role = role;
    saveUsers();
    showToast('Role updated');
  }
});

selectAllUsers && selectAllUsers.addEventListener('change', () => {
  document.querySelectorAll('.user-checkbox').forEach(cb => {
    cb.checked = selectAllUsers.checked;
  });
});

function getSelectedUserIds() {
  return Array.from(document.querySelectorAll('.user-checkbox:checked')).map(cb => Number(cb.getAttribute('data-id')));
}

bulkApproveBtn && bulkApproveBtn.addEventListener('click', () => {
  const ids = getSelectedUserIds();
  users.forEach(u => { if (ids.includes(u.id)) u.status = 'Active'; });
  saveUsers();
  renderUsers();
  showToast('Selected users approved');
});
bulkSuspendBtn && bulkSuspendBtn.addEventListener('click', () => {
  const ids = getSelectedUserIds();
  users.forEach(u => { if (ids.includes(u.id)) u.status = 'Suspended'; });
  saveUsers();
  renderUsers();
  showToast('Selected users suspended');
});
bulkDeleteBtn && bulkDeleteBtn.addEventListener('click', () => {
  const ids = getSelectedUserIds();
  users = users.filter(u => !ids.includes(u.id));
  saveUsers();
  renderUsers();
  showToast('Selected users deleted');
});

searchUsers && searchUsers.addEventListener('input', renderUsers);
filterRole && filterRole.addEventListener('change', renderUsers);

// Initial render
if (userTableBody) renderUsers();

// --- Fetch real dashboard stats from backend ---
async function fetchDashboardStats() {
  try {
    const res = await fetch('/api/admin/stats');
    const stats = await res.json();
    renderDashboardStats(stats);
  } catch (err) {
    console.error('Failed to fetch dashboard stats:', err);
  }
}

function renderDashboardStats(stats) {
  // Example: update dashboard stat elements
  const agentCount = document.getElementById('statTotalAgents');
  const adminCount = document.getElementById('statTotalAdmins');
  const userCount = document.getElementById('statTotalUsers');
  const salesCount = document.getElementById('statTotalSales');
  const revenueCount = document.getElementById('statTotalRevenue');
  const bundlesCount = document.getElementById('statBundlesSold');
    if (agentCount) agentCount.textContent = stats.totalAgents || 0;
    if (bundlesCount) bundlesCount.textContent = stats.bundlesSold || 0;
    if (salesCount) salesCount.textContent = stats.totalSales ? `₵${stats.totalSales}` : '₵0';
    const pendingApprovals = document.getElementById('statPendingApprovals');
    if (pendingApprovals) pendingApprovals.textContent = stats.pendingApprovals || 0;
    if (adminCount) adminCount.textContent = stats.totalAdmins || 0;
    if (userCount) userCount.textContent = stats.totalUsers || 0;
    if (revenueCount) revenueCount.textContent = stats.totalRevenue || 0;
}

document.addEventListener('DOMContentLoaded', fetchDashboardStats);
// --- Role & Permission Control Logic ---

// --- System Logs Logic ---

// --- Audit Trail Logic ---
// --- Session Timeout Logic ---
const SESSION_TIMEOUT_MINUTES = 10;
let sessionTimeout, sessionWarningTimeout;

function resetSessionTimer() {
  clearTimeout(sessionTimeout);
  clearTimeout(sessionWarningTimeout);
  sessionWarningTimeout = setTimeout(showSessionWarning, (SESSION_TIMEOUT_MINUTES - 1) * 60 * 1000);
  sessionTimeout = setTimeout(forceLogout, SESSION_TIMEOUT_MINUTES * 60 * 1000);
}

function showSessionWarning() {
  let modal = document.getElementById('sessionWarningModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'sessionWarningModal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <h3>Session Expiring Soon</h3>
        <p>Your session will expire in 1 minute due to inactivity.</p>
        <button id="stayLoggedInBtn" class="cta-btn">Stay Logged In</button>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('stayLoggedInBtn').onclick = () => {
      modal.remove();
      resetSessionTimer();
    };
  }
}

function forceLogout() {
  clearTimeout(sessionTimeout);
  clearTimeout(sessionWarningTimeout);
  if (typeof clearAuth === 'function') clearAuth();
  window.location.href = 'login.html';
}

['click','mousemove','keydown','scroll','touchstart'].forEach(evt => {
  window.addEventListener(evt, resetSessionTimer, true);
});
document.addEventListener('DOMContentLoaded', resetSessionTimer);
const auditTrailBody = document.getElementById('auditTrailBody');
const auditSearch = document.getElementById('auditSearch');
const auditUserFilter = document.getElementById('auditUserFilter');
const sampleAudit = [
  { date: '2025-12-13 10:25', user: 'Akua Serwaa', change: 'Password Changed', details: 'Changed password for own account.' },
  { date: '2025-12-13 10:35', user: 'Kojo Mensah', change: 'Bundle Price Updated', details: 'Updated MTN 10GB price from ₵45 to ₵50.' },
  { date: '2025-12-13 10:40', user: 'Akua Serwaa', change: 'User Deleted', details: 'Deleted user Yaw Boateng.' },
  { date: '2025-12-13 10:50', user: 'Kojo Mensah', change: 'Agent Suspended', details: 'Suspended agent Akua Serwaa.' },
  { date: '2025-12-13 11:00', user: 'Yaw Boateng', change: 'Profile Updated', details: 'Updated profile picture.' },
  { date: '2025-12-13 11:10', user: 'Kojo Mensah', change: 'Role Changed', details: 'Changed role of Akua Serwaa to admin.' }
];
function renderAuditTrail() {
  let logs = sampleAudit;
  const search = (auditSearch && auditSearch.value.trim().toLowerCase()) || '';
  const user = (auditUserFilter && auditUserFilter.value) || '';
  if (search) {
    logs = logs.filter(l =>
      l.user.toLowerCase().includes(search) ||
      l.change.toLowerCase().includes(search) ||
      l.details.toLowerCase().includes(search)
    );
  }
  if (user) {
    logs = logs.filter(l => l.user === user);
  }
  auditTrailBody.innerHTML = logs.map(l =>
    `<tr>
      <td>${l.date}</td>
      <td>${l.user}</td>
      <td>${l.change}</td>
      <td>${l.details}</td>
    </tr>`
  ).join('');
}
auditSearch && auditSearch.addEventListener('input', renderAuditTrail);
auditUserFilter && auditUserFilter.addEventListener('change', renderAuditTrail);
if (auditTrailBody) renderAuditTrail();
const logsTableBody = document.getElementById('logsTableBody');
const logSearch = document.getElementById('logSearch');
const logStatusFilter = document.getElementById('logStatusFilter');
const sampleLogs = [
  { time: '2025-12-13 10:22', user: 'Kojo Mensah', action: 'Logged in', status: 'Success' },
  { time: '2025-12-13 10:25', user: 'Akua Serwaa', action: 'Changed password', status: 'Success' },
  { time: '2025-12-13 10:30', user: 'Yaw Boateng', action: 'Failed login attempt', status: 'Failed' },
  { time: '2025-12-13 10:35', user: 'Kojo Mensah', action: 'Updated bundle price', status: 'Success' },
  { time: '2025-12-13 10:40', user: 'Akua Serwaa', action: 'Deleted user', status: 'Warning' },
  { time: '2025-12-13 10:45', user: 'Yaw Boateng', action: 'Logged out', status: 'Success' },
  { time: '2025-12-13 10:50', user: 'Kojo Mensah', action: 'Suspended agent', status: 'Warning' },
  { time: '2025-12-13 10:55', user: 'Akua Serwaa', action: 'Failed login attempt', status: 'Failed' }
];
function renderLogs() {
  let logs = sampleLogs;
  const search = (logSearch && logSearch.value.trim().toLowerCase()) || '';
  const status = (logStatusFilter && logStatusFilter.value) || '';
  if (search) {
    logs = logs.filter(l =>
      l.user.toLowerCase().includes(search) ||
      l.action.toLowerCase().includes(search) ||
      l.status.toLowerCase().includes(search)
    );
  }
  if (status) {
    logs = logs.filter(l => l.status === status);
  }
  logsTableBody.innerHTML = logs.map(l =>
    `<tr>
      <td>${l.time}</td>
      <td>${l.user}</td>
      <td>${l.action}</td>
      <td class="status-${l.status.toLowerCase()}">${l.status}</td>
    </tr>`
  ).join('');
}
logSearch && logSearch.addEventListener('input', renderLogs);
logStatusFilter && logStatusFilter.addEventListener('change', renderLogs);
if (logsTableBody) renderLogs();
const rolesTableBody = document.getElementById('rolesTableBody');
const saveRolesBtn = document.getElementById('saveRolesBtn');
const defaultRoles = [
  { role: 'admin', canView: true, canEdit: true, canDelete: true, canManageUsers: true },
  { role: 'agent', canView: true, canEdit: true, canDelete: false, canManageUsers: false },
  { role: 'viewer', canView: true, canEdit: false, canDelete: false, canManageUsers: false }
];
let rolesPermissions = JSON.parse(localStorage.getItem('roles_permissions')) || defaultRoles;

function renderRolesTable() {
  rolesTableBody.innerHTML = rolesPermissions.map((r, idx) => `
    <tr>
      <td style="text-transform:capitalize;">${r.role}</td>
      <td><input type="checkbox" data-role="${r.role}" data-perm="canView" ${r.canView ? 'checked' : ''}></td>
      <td><input type="checkbox" data-role="${r.role}" data-perm="canEdit" ${r.canEdit ? 'checked' : ''}></td>
      <td><input type="checkbox" data-role="${r.role}" data-perm="canDelete" ${r.canDelete ? 'checked' : ''}></td>
      <td><input type="checkbox" data-role="${r.role}" data-perm="canManageUsers" ${r.canManageUsers ? 'checked' : ''}></td>
    </tr>
  `).join('');
}

rolesTableBody && rolesTableBody.addEventListener('change', e => {
  if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
    const role = e.target.getAttribute('data-role');
    const perm = e.target.getAttribute('data-perm');
    const idx = rolesPermissions.findIndex(r => r.role === role);
    rolesPermissions[idx][perm] = e.target.checked;
  }
});

saveRolesBtn && saveRolesBtn.addEventListener('click', () => {
  localStorage.setItem('roles_permissions', JSON.stringify(rolesPermissions));
  showToast('Permissions saved');
});

if (rolesTableBody) renderRolesTable();
window.addEventListener('DOMContentLoaded', () => {
  if (typeof Chart === 'undefined') return;
  // Sales Chart
  const salesCtx = document.getElementById('salesChart');
  if (salesCtx) {
    new Chart(salesCtx, {
      type: 'line',
      data: {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Sales',
          data: [12000, 15000, 18000, 16000, 20000, 22000],
          borderColor: '#0077ff',
          backgroundColor: 'rgba(0,119,255,0.08)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
  // User Growth Chart
  const userCtx = document.getElementById('userChart');
  if (userCtx) {
    new Chart(userCtx, {
      type: 'bar',
      data: {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Users',
          data: [30, 45, 60, 80, 120, 150],
          backgroundColor: '#28a745',
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
  // Profit Chart
  const profitCtx = document.getElementById('profitChart');
  if (profitCtx) {
    new Chart(profitCtx, {
      type: 'line',
      data: {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Profit',
          data: [4000, 6000, 7000, 6500, 9000, 11000],
          borderColor: '#ffc107',
          backgroundColor: 'rgba(255,193,7,0.08)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
});
let count = 3; // starting count
function addNotification(message) {
  // Add to panel
  const list = notificationPanel.querySelector('ul');
  const li = document.createElement('li');
  li.textContent = message;
  list.prepend(li);

  // Update badge
  count++;
  notificationCount.textContent = count;
  notificationCount.style.display = 'inline-block';

  // Play sound only if toggle is enabled
  if (soundToggle.checked) {
    notificationSound.currentTime = 0;
    notificationSound.play();
  }

  // Show toast popup
  showToast(message);
}

// Toast popup function
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Example: simulate new notifications every 10 seconds
// Removed random notification simulation

// Save sound preference
soundToggle.addEventListener('change', () => {
  localStorage.setItem('soundEnabled', soundToggle.checked ? 'true' : 'false');
});