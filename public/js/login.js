// Login/Signup Page Logic (Overrides & Additions)
// This file can be used for page-specific logic if needed.

document.addEventListener('DOMContentLoaded', function() {
  // Autofocus on email field for login
  const emailInput = document.getElementById('email');
  if (emailInput) emailInput.focus();

  // Show/hide password toggle (optional enhancement)
  document.querySelectorAll('input[type="password"]').forEach(input => {
    const toggle = document.createElement('span');
    toggle.textContent = '👁️';
    toggle.style.cursor = 'pointer';
    toggle.style.marginLeft = '8px';
    toggle.title = 'Show/Hide Password';
    input.parentNode.appendChild(toggle);
    toggle.addEventListener('click', () => {
      input.type = input.type === 'password' ? 'text' : 'password';
      toggle.textContent = input.type === 'password' ? '👁️' : '🙈';
    });
  });

  // Enter key submits the correct form
  document.querySelectorAll('.login-form, .signup-form').forEach(form => {
    form.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        this.querySelector('.cta-btn').click();
      }
    });
  });

  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          // Optionally store user info in localStorage/sessionStorage
          window.location.href = 'dashboard.html';
        } else {
          alert(result.error || 'Login failed');
        }
      })
      .catch(() => alert('Login error'));
    });
  }

  // Signup form
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const phone = document.getElementById('signupPhone').value;
      const password = document.getElementById('signupPassword').value;
      fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      })
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          alert('Signup successful! Please login.');
          document.getElementById('loginTab').click();
        } else {
          alert(result.error || 'Signup failed');
        }
      })
      .catch(() => alert('Signup error'));
    });
  }
});
