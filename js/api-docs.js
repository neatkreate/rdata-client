
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#api-"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Copy code blocks
  document.querySelectorAll('.api-docs-section pre code').forEach(block => {
    block.addEventListener('click', function() {
      navigator.clipboard.writeText(this.textContent);
      this.classList.add('copied');
      setTimeout(() => this.classList.remove('copied'), 1200);
    });
  });

  // Website API registration form logic
  const registerForm = document.getElementById('register-api-form');
  const messageDiv = document.getElementById('register-api-message');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const urlInput = document.getElementById('website-url');
      const websiteUrl = urlInput.value.trim();
      // Check if user is a verified agent
      const user = JSON.parse(localStorage.getItem('rdata_user'));
      if (!user || !user.verified) {
        messageDiv.textContent = 'Only verified agents can register their website.';
        messageDiv.style.color = 'red';
        return;
      }
      // Save website URL to localStorage under the agent's username
      let registrations = JSON.parse(localStorage.getItem('rdata_api_registrations') || '{}');
      registrations[user.username] = websiteUrl;
      localStorage.setItem('rdata_api_registrations', JSON.stringify(registrations));
      messageDiv.textContent = 'Website registered successfully! Pending approval.';
      messageDiv.style.color = 'green';
      urlInput.value = '';
    });
  }
});
