// Admin Settings Page Logic
const SETTINGS_KEY = 'rdata_admin_settings';
const ACTIVITY_KEY = 'rdata_admin_activity_log';
let settings = {};
let activityLog = [];

function loadSettings() {
  try { settings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch { settings = {}; }
  try { activityLog = JSON.parse(localStorage.getItem(ACTIVITY_KEY)) || []; } catch { activityLog = []; }
}
function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
function saveActivityLog() {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activityLog));
}
function renderSettings() {
  document.getElementById('adminName').value = settings.name || '';
  document.getElementById('adminEmail').value = settings.email || '';
  document.getElementById('notificationEmail').value = settings.notificationEmail || '';
  document.getElementById('twoFAToggle').checked = settings.twoFA === true;
  document.getElementById('themeSelect').value = settings.theme || 'light';
  document.getElementById('languageSelect').value = settings.language || 'en';
  if (settings.profilePic) {
    document.getElementById('profilePicPreview').src = settings.profilePic;
  }
  if (settings.theme === 'dark') document.body.classList.add('dark');
  else document.body.classList.remove('dark');
}
function renderActivityLog() {
  const ul = document.getElementById('activityLog');
  ul.innerHTML = activityLog.length ? activityLog.map(e => `<li>${e}</li>`).join('') : '<li>No activity yet.</li>';
}
function addActivity(msg) {
  const entry = `${new Date().toLocaleString()}: ${msg}`;
  activityLog.unshift(entry);
  if (activityLog.length > 20) activityLog.pop();
  saveActivityLog();
  renderActivityLog();
}
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  renderSettings();
  renderActivityLog();
  document.getElementById('adminSettingsForm').onsubmit = e => {
    e.preventDefault();
    settings.name = document.getElementById('adminName').value.trim();
    settings.email = document.getElementById('adminEmail').value.trim();
    settings.notificationEmail = document.getElementById('notificationEmail').value.trim();
    settings.twoFA = document.getElementById('twoFAToggle').checked;
    settings.theme = document.getElementById('themeSelect').value;
    settings.language = document.getElementById('languageSelect').value;
    saveSettings();
    renderSettings();
    addActivity('Updated profile/settings');
    alert('Settings updated!');
  };
  document.getElementById('profilePicInput').onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      settings.profilePic = evt.target.result;
      document.getElementById('profilePicPreview').src = evt.target.result;
      saveSettings();
      addActivity('Changed profile picture');
    };
    reader.readAsDataURL(file);
  };
  document.getElementById('twoFAToggle').onchange = e => {
    settings.twoFA = e.target.checked;
    saveSettings();
    addActivity(e.target.checked ? 'Enabled 2FA' : 'Disabled 2FA');
  };
  document.getElementById('themeSelect').onchange = e => {
    settings.theme = e.target.value;
    saveSettings();
    renderSettings();
    addActivity('Changed theme');
  };
  document.getElementById('languageSelect').onchange = e => {
    settings.language = e.target.value;
    saveSettings();
    addActivity('Changed language');
  };
  document.getElementById('passwordForm').onsubmit = e => {
    e.preventDefault();
    const curr = document.getElementById('currentPassword').value;
    const npw = document.getElementById('newPassword').value;
    const cnpw = document.getElementById('confirmNewPassword').value;
    if (!curr || !npw || !cnpw) return alert('Fill all password fields.');
    if (npw !== cnpw) return alert('New passwords do not match.');
    addActivity('Changed password');
    alert('Password changed!');
    document.getElementById('passwordForm').reset();
  };
  const deleteModal = document.getElementById('deleteAccountModal');
  const openDeleteModal = () => {
      deleteModal.style.display = 'flex';
      deleteModal.style.visibility = 'visible';
      deleteModal.style.zIndex = '2000';
      deleteModal.setAttribute('aria-modal', 'true');
      deleteModal.setAttribute('tabindex', '-1');
      if (deleteModal.focus) deleteModal.focus();
  };
  const closeDeleteModal = (e) => {
    if (e) e.stopPropagation();
    deleteModal.style.display = 'none';
    deleteModal.style.visibility = 'hidden';
    deleteModal.style.zIndex = '0';
    deleteModal.removeAttribute('aria-modal');
    deleteModal.removeAttribute('tabindex');
  };
  document.getElementById('deleteAccountBtn').addEventListener('click', openDeleteModal);
  document.getElementById('closeDeleteModalBtn').addEventListener('click', closeDeleteModal);
  document.getElementById('confirmDeleteBtn').addEventListener('click', function(e) {
    e.preventDefault();
    addActivity('Deleted account');
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(ACTIVITY_KEY);
    alert('Account deleted. Logging out...');
    window.location.href = 'index.html';
  });
  // Overlay click
  deleteModal.addEventListener('click', function(e) {
    if (e.target === deleteModal) closeDeleteModal();
  });
  // Escape key
  document.addEventListener('keydown', function(e) {
    if (deleteModal.style.display === 'flex' && (e.key === 'Escape' || e.key === 'Esc')) {
      closeDeleteModal();
    }
  });
});
