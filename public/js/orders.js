// orders.js

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/orders')
    .then(res => res.json())
    .then(data => {
      const ordersList = document.getElementById('orders-list');
      if (!data.orders || data.orders.length === 0) {
        ordersList.innerHTML = '<p>No orders found.</p>';
        return;
      }
      ordersList.innerHTML = '';
      data.orders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'order-card';
        // Status color logic (match screenshot: completed=green, pending=yellow, failed=red, etc.)
        let statusColor = '#4CAF50'; // green for completed
        if (order.status === 'pending' || order.status === 'verified') statusColor = '#FFC107'; // yellow
        if (order.status === 'failed' || order.status === 'api_failed') statusColor = '#F44336'; // red
        card.innerHTML = `
          <div class="order-header">Order #${order.id}</div>
          <div class="order-details">Network: ${order.network}</div>
          <div class="order-details">Plan: ${order.plan}</div>
          <div class="order-details">Beneficiary: ${order.beneficiary}</div>
          <div class="order-details">Amount: ₵${order.amount}</div>
          <div class="order-details">Date: ${order.date}</div>
          <div class="order-details"><b>Status:</b> <span style="color:${statusColor};font-weight:bold;">${order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}</span></div>
          <div class="order-details" style="font-size:0.95em;color:#555;">${order.status_description || ''}</div>
        `;
        ordersList.appendChild(card);
      });
    })
    .catch(() => {
      document.getElementById('orders-list').innerHTML = '<p>Error loading orders.</p>';
    });
});
