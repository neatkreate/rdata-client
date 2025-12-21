
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
  const bundle = document.getElementById('filterBundle').value;
  return salesData.filter(s => {
    if (start && s.date < start) return false;
    if (end && s.date > end) return false;
    if (agent && s.agent !== agent) return false;
    if (bundle && s.bundle !== bundle) return false;
    return true;
  });
}

function renderFilters() {
  const agentSel = document.getElementById('filterAgent');
  const bundleSel = document.getElementById('filterBundle');
  agentSel.innerHTML = '<option value="">All</option>' + getUnique(salesData, 'agent').map(a => `<option value="${a}">${a}</option>`).join('');
  bundleSel.innerHTML = '<option value="">All</option>' + getUnique(salesData, 'bundle').map(b => `<option value="${b}">${b}</option>`).join('');
}

function renderTable(filtered) {
  const tbody = document.getElementById('revenueAnalyticsTableBody');
  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td>${s.date}</td>
      <td>${s.bundle}</td>
      <td>${s.agent}</td>
      <td>₵${s.amount.toFixed(2)}</td>
    </tr>
  `).join('') || '<tr><td colspan="4" style="text-align:center;">No data</td></tr>';
}

function renderSummary(filtered) {
  const totalRevenue = filtered.reduce((sum, s) => sum + s.amount, 0);
  document.getElementById('summaryTotalRevenue').textContent = `₵${totalRevenue.toFixed(2)}`;
  // Top bundle
  const bundleCounts = {};
  filtered.forEach(s => { bundleCounts[s.bundle] = (bundleCounts[s.bundle]||0)+s.amount; });
  const topBundle = Object.entries(bundleCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || '-';
  document.getElementById('summaryTopBundle').textContent = topBundle;
  // Top agent
  const agentCounts = {};
  filtered.forEach(s => { agentCounts[s.agent] = (agentCounts[s.agent]||0)+s.amount; });
  const topAgent = Object.entries(agentCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || '-';
  document.getElementById('summaryTopAgent').textContent = topAgent;
  // Top day
  const dayCounts = {};
  filtered.forEach(s => { dayCounts[s.date] = (dayCounts[s.date]||0)+s.amount; });
  const topDay = Object.entries(dayCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || '-';
  document.getElementById('summaryTopDay').textContent = topDay;
}

function renderChart(filtered) {
  if (!window.Chart) return;
  const ctx = document.getElementById('revenueAnalyticsChart').getContext('2d');
  if (window.revenueChart) window.revenueChart.destroy();
  // Group by date
  const dateMap = {};
  filtered.forEach(s => { dateMap[s.date] = (dateMap[s.date]||0)+s.amount; });
  const labels = Object.keys(dateMap).sort();
  const data = labels.map(l => dateMap[l]);
  window.revenueChart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label: 'Revenue', data, backgroundColor: '#0077ff', borderColor: '#0077ff', fill: false }] },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}

function exportCSV(filtered) {
  const header = ['Date','Bundle','Agent','Revenue'];
  const rows = filtered.map(s => [s.date, s.bundle, s.agent, s.amount]);
  let csv = header.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'revenue-analytics.csv';
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
  document.getElementById('filterBundle').addEventListener('change', updateReport);
  document.getElementById('exportCSVBtn').addEventListener('click', () => {
    const filtered = filterSales();
    exportCSV(filtered);
  });
});
