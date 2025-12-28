
const STORAGE_KEY = 'rdata_auth';

// --- Helpers ---
function getAuth() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; }
  catch { return null; }
}

function setAuth(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

function isExpired(exp) {
  return typeof exp === 'number' && Date.now() > exp;
}

// --- Route protection ---
function requireAuth(allowedRoles = []) {
  const auth = getAuth();
  if (!auth || !auth.token || isExpired(auth.exp)) {
    clearAuth();
    window.location.href = 'login.html';
    return;
  }
  if (allowedRoles.length && !allowedRoles.includes(auth.role)) {
    // Always redirect to login page for unauthorized access
    clearAuth();
    window.location.href = 'login.html';
    return;
  }
}

// --- Attach logout to any .logout-link or #logoutBtn ---
function wireLogout() {
  const logoutLinks = document.querySelectorAll('.logout-link, #logoutBtn, a[href="index.html"]');
  logoutLinks.forEach(el => {
    el.addEventListener('click', (e) => {
      // If it's a regular link, allow navigation after clearing
      e.preventDefault();
      clearAuth();
      window.location.href = 'login.html';
    });
  });
}

// --- Mock login API (replace with real backend call) ---
// --- Password Strength Validation ---
function isStrongPassword(pw) {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol
  return typeof pw === 'string' &&
    pw.length >= 8 &&
    /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /[0-9]/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw);
}

// Attach to registration and password change forms
document.addEventListener('DOMContentLoaded', () => {
  const pwForms = document.querySelectorAll('form');
  pwForms.forEach(form => {
    const pwInput = form.querySelector('input[type="password"]');
    if (pwInput) {
      form.addEventListener('submit', e => {
        if (!isStrongPassword(pwInput.value)) {
          e.preventDefault();
          alert('Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.');
        }
      });
    }
  });
});

// Real login API (connects to backend)
async function loginApi({ email, password, role }) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Login failed');
  }
  const data = await response.json();
  // If renewal is due, enforce payment before allowing access
  if (data.renewalDue) {
    alert('Your yearly registration fee is due. Please renew to continue.');
    window.location.href = 'login.html';
    throw new Error('Renewal required');
  }
  return {
    token: 'session-' + Math.random().toString(36).slice(2),
    role: data.user.role,
    user: data.user,
    exp: Date.now() + 2 * 60 * 60 * 1000
  };
}

// --- Login form handler (only runs on login.html) ---
function wireLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    // Check lockout before calling loginApi
    const LOCKOUT_KEY = 'rdata_lockout';
    function getLockout(email) {
      try {
        const data = JSON.parse(localStorage.getItem(LOCKOUT_KEY) || '{}');
        return data[email] || null;
      } catch { return null; }
    }
    function isLockedOut(email) {
      const until = getLockout(email);
      return until && Date.now() < until;
    }
    if (isLockedOut(email)) {
      alert('Account locked due to too many failed attempts. Try again later.');
      return;
    }
    try {
      const data = await loginApi({ email, password, role });
      setAuth(data);
      window.location.href = role === 'admin' ? 'admin.html' : 'profile.html';
    } catch (err) {
      alert(err.message || 'Login failed');
    }
  });
}


// Signup form handler (connects to backend)
function wireSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    const fee = document.getElementById('signupFee').value;
    // Validate fields
    if (!name || !email || !phone || !password) {
      alert('Please fill in all fields.');
      return;
    }
    if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
      alert('Enter a valid phone number.');
      return;
    }
    if (!isStrongPassword(password)) {
      alert('Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.');
      return;
    }
    // Call backend signup endpoint
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    });
    if (!response.ok) {
      const err = await response.json();
      alert(err.error || 'Signup failed');
      return;
    }
    // Initiate Paystack payment for registration fee
    if (!window.confirm(`Proceed to pay registration fee of GHC ${fee}?`)) {
      return;
    }
    // Call backend to initiate Paystack payment
    const payRes = await fetch('/api/payment/paystack/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, amount: fee })
    });
    const payData = await payRes.json();
    if (payData.status !== 'success') {
      alert('Payment initiation failed.');
      return;
    }
    // Redirect to Paystack payment page
    window.location.href = payData.data.data.authorization_url;
  });
}

// --- Auto-redirect from login if already signed in ---
function redirectIfLoggedIn() {
  const auth = getAuth();
  if (auth && auth.token && !isExpired(auth.exp)) {
     window.location.href = auth.role === 'admin' ? 'admin.html' : 'profile.html';
  }
}

// --- Public API: protect pages by role ---
window.RDataAuth = {
  requireAuth,
  wireLogout,
  getAuth
};

// --- Bootstrapping ---
document.addEventListener('DOMContentLoaded', () => {
  // On login page: wire forms & redirect if already signed in
  if (window.location.pathname.endsWith('login.html')) {
    wireLoginForm();
    wireSignupForm();
    redirectIfLoggedIn();
    return;
  }

  // On admin page: protect for admin
  if (window.location.pathname.endsWith('admin.html')) {
    requireAuth(['admin']);
    wireLogout();
    return;
  }

  // On agent profile: protect for agent
  if (window.location.pathname.endsWith('profile.html')) {
    requireAuth(['agent']);
    wireLogout();
    return;
  }

  // Default: just ensure logged in
  requireAuth();
  wireLogout();
});