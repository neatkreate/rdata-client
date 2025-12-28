
// --- Mock sales data ---
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
  const tbody = document.getElementById('salesReportTableBody');
  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td>${s.date}</td>
      <td>${s.agent}</td>
      <td>${s.bundle}</td>
      <td>₵${s.amount.toFixed(2)}</td>
      <td>${s.status}</td>
    </tr>
  `).join('') || '<tr><td colspan="5" style="text-align:center;">No sales found</td></tr>';
}

function renderSummary(filtered) {
  document.getElementById('summaryTotalSales').textContent = filtered.length;
  const totalRevenue = filtered.reduce((sum, s) => sum + s.amount, 0);
  document.getElementById('summaryTotalRevenue').textContent = `₵${totalRevenue.toFixed(2)}`;
  // Top bundle
  const bundleCounts = {};
  filtered.forEach(s => { bundleCounts[s.bundle] = (bundleCounts[s.bundle]||0)+1; });
  const topBundle = Object.entries(bundleCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || '-';
  document.getElementById('summaryTopBundle').textContent = topBundle;
  // Top agent
  const agentCounts = {};
  filtered.forEach(s => { agentCounts[s.agent] = (agentCounts[s.agent]||0)+1; });
  const topAgent = Object.entries(agentCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || '-';
  document.getElementById('summaryTopAgent').textContent = topAgent;
}

function renderChart(filtered) {
  if (!window.Chart) return;
  const ctx = document.getElementById('salesReportChart').getContext('2d');
  if (window.salesChart) window.salesChart.destroy();
  // Group by date
  const dateMap = {};
  filtered.forEach(s => { dateMap[s.date] = (dateMap[s.date]||0)+s.amount; });
  const labels = Object.keys(dateMap).sort();
  const data = labels.map(l => dateMap[l]);
  window.salesChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Revenue', data, backgroundColor: '#0077ff' }] },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}

function exportCSV(filtered) {
  const header = ['Date','Agent','Bundle','Amount','Status'];
  const rows = filtered.map(s => [s.date, s.agent, s.bundle, s.amount, s.status]);
  let csv = header.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sales-report.csv';
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
