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

  // Fetch user dashboard data
  fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
          document.getElementById('greeting').textContent = `Good afternoon, ${data.name}`;
          document.getElementById('balance').textContent = `₵${data.balance.toFixed(2)}`;
          document.getElementById('todays-spent').textContent = `₵${data.todaysSpent.toFixed(2)}`;
          document.getElementById('total-spent').textContent = `₵${data.totalSpent.toFixed(2)}`;
      });

  // Fetch available networks for Buy Data
  const networkSelect = document.getElementById('network');
  ["MTN", "Vodafone", "AirtelTigo"].forEach(net => {
      const opt = document.createElement('option');
      opt.value = net.toLowerCase();
      opt.textContent = net;
      networkSelect.appendChild(opt);
  });

  // Update data plans when network changes
  document.getElementById('network').addEventListener('change', function() {
      const networkId = this.value;
      const dataPlanSelect = document.getElementById('data-plan');
      dataPlanSelect.innerHTML = '<option value="">Loading...</option>';
      if (networkId) {
          fetch(`/api/data-plans?network=${networkId}`)
              .then(res => res.json())
              .then(plans => {
                  dataPlanSelect.innerHTML = '';
                  plans.forEach(plan => {
                      const opt = document.createElement('option');
                      opt.value = plan.id;
                      opt.textContent = plan.name;
                      dataPlanSelect.appendChild(opt);
                  });
              });
      } else {
          dataPlanSelect.innerHTML = '<option value="">Select a network first</option>';
      }
  });

  // Handle Buy Data form submission
  document.getElementById('buy-data-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const network = document.getElementById('network').value;
      const dataPlan = document.getElementById('data-plan').value;
      const beneficiary = document.getElementById('beneficiary-number').value;
      fetch('/api/buy-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ network, dataPlan, beneficiary })
      })
      .then(res => res.json())
      .then(result => {
          alert(result.message);
      });
  });

  // Handle Top Up button (show modal)
  document.getElementById('top-up').addEventListener('click', function() {
      document.getElementById('topup-modal').style.display = 'flex';
  });
  // Close modal
  document.getElementById('close-topup').addEventListener('click', function() {
      document.getElementById('topup-modal').style.display = 'none';
  });
  // Handle Top Up form submission
  document.getElementById('topup-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const amount = document.getElementById('topup-amount').value;
      const wallet = document.getElementById('topup-wallet').value;
      fetch('/api/top-up-mobile-money', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, wallet })
      })
      .then(res => res.json())
      .then(result => {
          alert(result.message);
          document.getElementById('topup-modal').style.display = 'none';
          // Optionally refresh balance
          location.reload();
      })
      .catch(() => alert('Top up error'));
  });

  // View Orders button
  document.getElementById('view-orders').addEventListener('click', function() {
      window.location.href = 'orders.html';
  });
});