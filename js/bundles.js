// Bundles display logic for verified agents

function isVerifiedAgent() {
  try {
    const auth = JSON.parse(localStorage.getItem('rdata_auth'));
    if (!auth || !auth.user || auth.role !== 'agent') return false;
    // Find full user info from rdata_users
    const users = JSON.parse(localStorage.getItem('rdata_users') || '[]');
    const user = users.find(u => u.email === auth.user.email);
    return user && user.verified === true;
  } catch { return false; }
}

function loadBundles() {
  fetch('data/bundles.json')
    .then(res => res.json())
    .then(bundles => {
      const container = document.getElementById('bundles-section');
      if (!Array.isArray(bundles) || bundles.length === 0) {
        container.innerHTML = '<p>No bundles available at this time.</p>';
        return;
      }
      let html = '<h2>Available Bundles</h2><div class="bundles-list">';
      bundles.forEach(b => {
        html += `<div class="bundle-card">
          <h3>${b.name}</h3>
          <p>Network: ${b.network}</p>
          <p>Data: ${b.data}</p>
          <p>Price: GHS ${b.price}</p>
          <button class="buy-bundle-btn" data-id="${b.id}">Sell to Customer</button>
        </div>`;
      });
      html += '</div>';
      container.innerHTML = html;
    });
}

document.addEventListener('DOMContentLoaded', function() {
  if (isVerifiedAgent()) {
    loadBundles();
    document.getElementById('bundles-section').style.display = 'block';
  } else {
    document.getElementById('bundles-section').style.display = 'none';
  }
});
