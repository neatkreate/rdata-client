// Suspended Agents Page Logic
const SUSPENDED_KEY = 'rdata_suspended_agents';
let suspended = [];
let reinstateIdx = null;
let historyIdx = null;

function loadSuspended() {
  try {
    suspended = JSON.parse(localStorage.getItem(SUSPENDED_KEY)) || [];
  } catch { suspended = []; }
}
function saveSuspended() {
  localStorage.setItem(SUSPENDED_KEY, JSON.stringify(suspended));
}
function renderSuspended() {
  const tbody = document.getElementById('suspendedTableBody');
  const search = (document.getElementById('searchSuspended')?.value || '').toLowerCase();
  let filtered = suspended.filter(a =>
    (!search || a.name.toLowerCase().includes(search) || a.email.toLowerCase().includes(search))
  );
  tbody.innerHTML = filtered.map((a, i) => `
    <tr>
      <td><input type="checkbox" class="suspended-select" data-idx="${i}"></td>
      <td>${a.name}</td>
      <td>${a.email}</td>
      <td>${a.suspendedOn}</td>
      <td>${a.reason || ''} <button class="history-btn" data-idx="${i}">History</button></td>
      <td>
        <button class="reinstate-btn" data-idx="${i}">Reinstate</button>
      </td>
    </tr>
  `).join('');
}
function openReinstateModal(idx) {
  reinstateIdx = idx;
  document.getElementById('reinstateModal').style.display = 'block';
}
function closeReinstateModal() {
  document.getElementById('reinstateModal').style.display = 'none';
}
function openHistoryModal(idx) {
  historyIdx = idx;
  const list = document.getElementById('historyList');
  const hist = suspended[idx]?.history || [];
  list.innerHTML = hist.length ? hist.map(h => `<li>${h}</li>`).join('') : '<li>No history</li>';
  document.getElementById('historyModal').style.display = 'block';
}
function closeHistoryModal() {
  document.getElementById('historyModal').style.display = 'none';
}
document.addEventListener('DOMContentLoaded', () => {
  loadSuspended();
  renderSuspended();
  document.getElementById('searchSuspended').addEventListener('input', renderSuspended);
  document.getElementById('bulkReinstateBtn').addEventListener('click', () => {
    document.querySelectorAll('.suspended-select:checked').forEach(cb => {
      const idx = Number(cb.dataset.idx);
      suspended[idx].reinstate = true;
    });
    suspended = suspended.filter(a => !a.reinstate);
    saveSuspended();
    renderSuspended();
  });
  document.getElementById('suspendedTableBody').addEventListener('click', e => {
    if (e.target.classList.contains('reinstate-btn')) {
      openReinstateModal(Number(e.target.dataset.idx));
    } else if (e.target.classList.contains('history-btn')) {
      openHistoryModal(Number(e.target.dataset.idx));
    }
  });
  document.getElementById('selectAllSuspended').addEventListener('change', function() {
    document.querySelectorAll('.suspended-select').forEach(cb => cb.checked = this.checked);
  });
  document.getElementById('confirmReinstateBtn').addEventListener('click', () => {
    if (reinstateIdx !== null) {
      suspended.splice(reinstateIdx, 1);
      saveSuspended();
      renderSuspended();
      closeReinstateModal();
    }
  });
  document.getElementById('cancelReinstateBtn').addEventListener('click', closeReinstateModal);
  document.getElementById('closeHistoryBtn').addEventListener('click', closeHistoryModal);
});
