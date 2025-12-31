// Bundles display logic for verified agents


async function isVerifiedAgent() {
  try {
    const auth = JSON.parse(localStorage.getItem('rdata_auth'));
    if (!auth || !auth.user || auth.role !== 'agent') return false;
    const res = await fetch(`/api/auth/agent/profile?email=${encodeURIComponent(auth.user.email)}`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.user && data.user.isVerified === true;
  } catch { return false; }
}

async function loadBundlesIfVerified() {
  const verified = await isVerifiedAgent();
  const container = document.getElementById('bundles-section');
  if (!verified) {
    container.innerHTML = '<p style="color:red;">You are not approved by admin yet. Please wait for approval.</p>';
    return;
  }
  fetch('/api/bundles')
    .then(async res => {
      if (!res.ok) {
        throw new Error('Bundles fetch failed: ' + res.status + ' ' + res.statusText);
      }
      try {
        return await res.json();
      } catch (jsonErr) {
        throw new Error('Bundles API returned invalid data.');
      }
    })
    .then(result => {
      const bundles = result.data || [];
      if (!Array.isArray(bundles) || bundles.length === 0) {
        container.innerHTML = '<p>No bundles available at this time.</p>';
        return;
      }
      let html = '<h2>Available Bundles</h2><div class="bundles-list">';
      bundles.forEach(b => {
        html += `<div class="bundle-card">
          <h3>${b.name || b.bundle_name || 'Bundle'}</h3>
          <p>Network: ${b.network || b.provider || ''}</p>
          <p>Data: ${b.data || b.size || ''}</p>
          <p>Price: GHS ${b.price || b.amount || ''}</p>
          <button class="buy-bundle-btn" data-id="${b.id || b.bundle_id || ''}" data-network="${b.network || ''}" data-size="${b.data || b.size || ''}">Sell to Customer</button>
        </div>`;
      });
      html += '</div>';
      container.innerHTML = html;
    })
    .catch(err => {
      container.innerHTML = `<p style="color:red;">${err.message}</p>`;
      console.error('Bundles fetch error:', err);
    });
}

document.addEventListener('DOMContentLoaded', function() {
  loadBundlesIfVerified();
  document.getElementById('bundles-section').style.display = 'block';

  // Delegate click for buy-bundle-btn
  document.getElementById('bundles-section').addEventListener('click', async function(e) {
    if (e.target.classList.contains('buy-bundle-btn')) {
      const btn = e.target;
      const bundleId = btn.getAttribute('data-id');
      const network = btn.getAttribute('data-network');
      const size = btn.getAttribute('data-size');
      const beneficiary = prompt(`Enter customer phone number for ${network} ${size}:`);
      if (!beneficiary || !/^0[2357][0-9]{8}$/.test(beneficiary)) {
        alert('Please enter a valid Ghana phone number.');
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Processing...';
      try {
        const res = await fetch('/api/bundles/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ beneficiary, package_size: size })
        });
        const result = await res.json();
        if (result.status === 'success') {
          alert('Bundle purchase successful!');
        } else {
          alert('Purchase failed: ' + (result.error || 'Unknown error'));
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }
      btn.disabled = false;
      btn.textContent = 'Sell to Customer';
    }
  });
});
