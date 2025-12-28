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
});
