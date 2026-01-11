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
        card.innerHTML = `
          <div class="order-header">Order #${order.id}</div>
          <div class="order-details">Network: ${order.network}</div>
          <div class="order-details">Plan: ${order.plan}</div>
          <div class="order-details">Beneficiary: ${order.beneficiary}</div>
          <div class="order-details">Amount: ₵${order.amount}</div>
          <div class="order-details">Date: ${order.date}</div>
        `;
        ordersList.appendChild(card);
      });
    })
    .catch(() => {
      document.getElementById('orders-list').innerHTML = '<p>Error loading orders.</p>';
    });
});
