// Hamburger menu toggle for mobile navbar (EliteDrive style)
  document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
      });
      // Close menu when a link is clicked
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
      // Optional: close menu on outside click
      document.addEventListener('click', function(e) {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
          navLinks.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
  // Logout button handler
  document.getElementById('logoutBtn')?.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('rdata_auth');
    window.location.href = 'login.html';
  });
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

    // Fetch user dashboard data (send email)
    let userEmail = '';
    let userFirstName = '';
    try {
      const auth = JSON.parse(localStorage.getItem('rdata_auth'));
      if (!auth) {
        document.getElementById('greeting').textContent = 'Welcome, please log in.';
        alert('No user session found. Please log in.');
        return;
      }
      if (!auth.user || !auth.user.email) {
        document.getElementById('greeting').textContent = 'Welcome, user (missing email)';
        alert('User info missing in session. Debug info: ' + JSON.stringify(auth));
        return;
      }
      userEmail = auth.user.email;
      if (auth.user.name) {
        userFirstName = auth.user.name.split(' ')[0];
      } else {
        userFirstName = userEmail;
      }
    } catch (e) {
      document.getElementById('greeting').textContent = 'Welcome, error reading session.';
      alert('Error reading user session: ' + e.message);
      return;
    }
    document.getElementById('greeting').textContent = `Welcome, ${userFirstName}`;
    // Optionally, fetch dashboard data if needed
    // fetch('/api/dashboard?email=' + encodeURIComponent(userEmail))
    //   .then(res => res.json())
    //   .then(data => {
    //     document.getElementById('balance').textContent = `₵${data.balance.toFixed(2)}`;
    //     document.getElementById('todays-spent').textContent = `₵${data.todaysSpent.toFixed(2)}`;
    //     document.getElementById('total-spent').textContent = `₵${data.totalSpent.toFixed(2)}`;
    //   });
    // Responsive centering for dashboard main content
    function centerDashboardOnMobile() {
      if (window.innerWidth <= 600) {
        document.querySelector('main').style.display = 'flex';
        document.querySelector('main').style.flexDirection = 'column';
        document.querySelector('main').style.alignItems = 'center';
      } else {
        document.querySelector('main').style.display = '';
        document.querySelector('main').style.flexDirection = '';
        document.querySelector('main').style.alignItems = '';
      }
    }
    window.addEventListener('resize', centerDashboardOnMobile);
    centerDashboardOnMobile();

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
  // Handle Top Up form submission (Paystack redirect integration)
  document.getElementById('topup-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const amount = document.getElementById('topup-amount').value;
    let email = '';
    try {
      const auth = JSON.parse(localStorage.getItem('rdata_auth'));
      if (!auth) {
        alert('No user session found. Please log in.');
        return;
      }
      if (!auth.user || !auth.user.email) {
        alert('User info missing in session. Debug info: ' + JSON.stringify(auth));
        return;
      }
      email = auth.user.email;
    } catch (e) {
      alert('Error reading user session: ' + e.message);
      return;
    }
    // Call backend to get Paystack payment URL
    let result;
    try {
      const res = await fetch('/api/top-up-mobile-money', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, amount })
      });
      result = await res.json();
      if (!result.payment_url) throw new Error('No payment URL returned');
    } catch (err) {
      alert('Failed to initiate payment.');
      return;
    }
    // Redirect user to Paystack payment page
    window.location.href = result.payment_url;
  });

  // View Orders button
  document.getElementById('view-orders').addEventListener('click', function() {
      window.location.href = 'orders.html';
  });
});