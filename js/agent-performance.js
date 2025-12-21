
// --- Mock sales data (shared with sales report) ---
const MOCK_SALES = [
  { date: '2025-12-01', agent: 'Alice', bundle: 'MTN - 5GB', amount: 50, status: 'Completed' },
  { date: '2025-12-02', agent: 'Bob', bundle: 'Vodafone - 10GB', amount: 90, status: 'Completed' },
  { date: '2025-12-02', agent: 'Alice', bundle: 'MTN - 10GB', amount: 95, status: 'Completed' },
  { date: '2025-12-03', agent: 'Charlie', bundle: 'AirtelTigo - 2GB', amount: 20, status: 'Pending' },
  { date: '2025-12-03', agent: 'Bob', bundle: 'Vodafone - 5GB', amount: 45, status: 'Completed' },
  { date: '2025-12-04', agent: 'Alice', bundle: 'MTN - 5GB', amount: 50, status: 'Completed' },
  { date: '2025-12-04', agent: 'Charlie', bundle: 'AirtelTigo - 10GB', amount: 95, status: 'Completed' },
  { date: '2025-12-05', agent: 'Bob', bundle: 'Vodafone - 10GB', amount: 90, status: 'Completed' },
  { date: '2025-12-05', agent: 'Alice', bundle: 'MTN - 2GB', amount: 20, status: 'Completed' },
];

let salesData = [...MOCK_SALES];

function getUnique(arr, key) {
  return [...new Set(arr.map(x => x[key]))];
}

function filterSales() {
  const start = document.getElementById('filterStartDate').value;
  const end = document.getElementById('filterEndDate').value;
  const agent = document.getElementById('filterAgent').value;
  return salesData.filter(s => {
    if (start && s.date < start) return false;
    if (end && s.date > end) return false;
    if (agent && s.agent !== agent) return false;
    return true;
  });
}

function renderFilters() {
  const agentSel = document.getElementById('filterAgent');
  agentSel.innerHTML = '<option value="">All</option>' + getUnique(salesData, 'agent').map(a => `<option value="${a}">${a}</option>`).join('');
}

function renderTable(filtered) {
  // Aggregate by agent
  const agentMap = {};
  filtered.forEach(s => {
    if (!agentMap[s.agent]) agentMap[s.agent] = { sales: 0, revenue: 0, bundles: {}, completed: 0 };
    agentMap[s.agent].sales++;
    agentMap[s.agent].revenue += s.amount;
    agentMap[s.agent].bundles[s.bundle] = (agentMap[s.agent].bundles[s.bundle]||0)+1;
    if (s.status === 'Completed') agentMap[s.agent].completed++;
  });
  const tbody = document.getElementById('agentPerformanceTableBody');
  tbody.innerHTML = Object.entries(agentMap).map(([agent, data]) => {
    // Simple rating: percent completed
    const rating = data.sales ? Math.round((data.completed/data.sales)*5) : 0;
    return `<tr>
      <td>${agent}</td>
      <td>${data.sales}</td>
      <td>₵${data.revenue.toFixed(2)}</td>
      <td>${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="4" style="text-align:center;">No data</td></tr>';
}

function renderSummary(filtered) {
  document.getElementById('summaryTotalSales').textContent = filtered.length;
  const totalRevenue = filtered.reduce((sum, s) => sum + s.amount, 0);
  document.getElementById('summaryTotalRevenue').textContent = `₵${totalRevenue.toFixed(2)}`;
  const avgSale = filtered.length ? totalRevenue/filtered.length : 0;
  document.getElementById('summaryAvgSale').textContent = `₵${avgSale.toFixed(2)}`;
  // Top bundle
  const bundleCounts = {};
  filtered.forEach(s => { bundleCounts[s.bundle] = (bundleCounts[s.bundle]||0)+1; });
  const topBundle = Object.entries(bundleCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || '-';
  document.getElementById('summaryTopBundle').textContent = topBundle;
}

function renderChart(filtered) {
  if (!window.Chart) return;
  const ctx = document.getElementById('agentPerformanceChart').getContext('2d');
  if (window.agentPerfChart) window.agentPerfChart.destroy();
  // Group by agent
  const agentMap = {};
  filtered.forEach(s => { agentMap[s.agent] = (agentMap[s.agent]||0)+s.amount; });
  const labels = Object.keys(agentMap);
  const data = labels.map(l => agentMap[l]);
  window.agentPerfChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Revenue', data, backgroundColor: '#0077ff' }] },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}

function exportCSV(filtered) {
  // Aggregate by agent
  const agentMap = {};
  filtered.forEach(s => {
    if (!agentMap[s.agent]) agentMap[s.agent] = { sales: 0, revenue: 0, completed: 0 };
    agentMap[s.agent].sales++;
    agentMap[s.agent].revenue += s.amount;
    if (s.status === 'Completed') agentMap[s.agent].completed++;
  });
  const header = ['Agent','Sales','Revenue','Rating'];
  const rows = Object.entries(agentMap).map(([agent, data]) => {
    const rating = data.sales ? Math.round((data.completed/data.sales)*5) : 0;
    return [agent, data.sales, data.revenue, rating];
  });
  let csv = header.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'agent-performance.csv';
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
}

function updateReport() {
  const filtered = filterSales();
  renderTable(filtered);
  renderSummary(filtered);
  renderChart(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
  renderFilters();
  updateReport();
  document.getElementById('filterStartDate').addEventListener('change', updateReport);
  document.getElementById('filterEndDate').addEventListener('change', updateReport);
  document.getElementById('filterAgent').addEventListener('change', updateReport);
  document.getElementById('exportCSVBtn').addEventListener('click', () => {
    const filtered = filterSales();
    exportCSV(filtered);
  });
});
