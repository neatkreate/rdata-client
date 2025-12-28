// --- Dark Mode Logic ---
function applyTheme(theme) {
  document.body.classList.toggle('dark-mode', theme === 'dark');
  document.documentElement.classList.toggle('dark-mode', theme === 'dark');
}

function loadTheme() {
  const theme = localStorage.getItem('rdata_theme') || 'light';
  applyTheme(theme);
  const select = document.getElementById('themeSelect');
  if (select) select.value = theme;
}

function saveTheme(theme) {
  localStorage.setItem('rdata_theme', theme);
  applyTheme(theme);
}

document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  const select = document.getElementById('themeSelect');
  if (select) {
    select.addEventListener('change', e => saveTheme(e.target.value));
  }

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
  resetSessionTimer();
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.overlay');
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  // Optional sound effects - only if files exist and browser allows autoplay
  const sounds = {};
  try {
    sounds.openSidebar = new Audio('sounds/pop-open.mp3');
    sounds.closeSidebar = new Audio('sounds/pop-close.mp3');
    sounds.dropdown = new Audio('sounds/bubble.mp3');
    Object.values(sounds).forEach(s => s.volume = 0.25);
  } catch (err) {
    // If audio files aren't available, skip sound playback silently
  }

  // Helper to safely play a sound
  const tryPlay = s => { try { s && typeof s.play === 'function' && s.play(); } catch (e) {} };

  // Sidebar toggle
  if (hamburger && sidebar && overlay) {
    hamburger.addEventListener('click', () => {
      const isOpening = !sidebar.classList.contains('active');

      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
      hamburger.classList.toggle('active');

      isOpening ? tryPlay(sounds.openSidebar) : tryPlay(sounds.closeSidebar);
    });

    // Close sidebar when overlay is clicked
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      hamburger.classList.remove('active');
      tryPlay(sounds.closeSidebar);
    });

    // Click outside to close (safely guarded)
    document.addEventListener('click', e => {
      if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
        if (sidebar.classList.contains('active')) {
          sidebar.classList.remove('active');
          overlay.classList.remove('active');
          hamburger.classList.remove('active');
          tryPlay(sounds.closeSidebar);
        }
      }
    });
  }

  // Dropdown toggles
  if (dropdownToggles && dropdownToggles.length) {
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', e => {
        e.preventDefault();
        const parent = toggle.parentElement;
        parent.classList.toggle('open');
        tryPlay(sounds.dropdown);
        toggle.classList.add('bounce');
        setTimeout(() => toggle.classList.remove('bounce'), 300);
      });
    });
  }
});