// Pending Approvals Page Logic
const PENDING_KEY = 'rdata_pending_agents';
let pending = [];
let approveIdx = null;
let rejectIdx = null;

function loadPending() {
  try {
    pending = JSON.parse(localStorage.getItem(PENDING_KEY)) || [];
  } catch { pending = []; }
}
function savePending() {
  localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
}
function renderPending() {
  const tbody = document.getElementById('pendingTableBody');
  const search = (document.getElementById('searchPending')?.value || '').toLowerCase();
  let filtered = pending.filter(a =>
    (!search || a.name.toLowerCase().includes(search) || a.email.toLowerCase().includes(search))
  );
  tbody.innerHTML = filtered.map((a, i) => `
    <tr>
      <td><input type="checkbox" class="pending-select" data-idx="${i}"></td>
      <td>${a.name}</td>
      <td>${a.email}</td>
      <td>${a.requestedOn}</td>
      <td><span class="status-badge status-pending">Pending</span></td>
      <td>
        <button class="approve-btn" data-idx="${i}">Approve</button>
        <button class="reject-btn" data-idx="${i}">Reject</button>
      </td>
    </tr>
  `).join('');
}
function openApproveModal(idx) {
  approveIdx = idx;
  document.getElementById('approveModal').style.display = 'block';
}
function closeApproveModal() {
  document.getElementById('approveModal').style.display = 'none';
}
function openRejectModal(idx) {
  rejectIdx = idx;
  document.getElementById('rejectModal').style.display = 'block';
}
function closeRejectModal() {
  document.getElementById('rejectModal').style.display = 'none';
}
document.addEventListener('DOMContentLoaded', () => {
  loadPending();
  renderPending();
  document.getElementById('searchPending').addEventListener('input', renderPending);
  document.getElementById('bulkApproveBtn').addEventListener('click', () => {
    document.querySelectorAll('.pending-select:checked').forEach(cb => {
      const idx = Number(cb.dataset.idx);
      pending[idx].status = 'Approved';
    });
    pending = pending.filter(a => a.status !== 'Approved');
    savePending();
    renderPending();
  });
  document.getElementById('pendingTableBody').addEventListener('click', e => {
    if (e.target.classList.contains('approve-btn')) {
      openApproveModal(Number(e.target.dataset.idx));
    } else if (e.target.classList.contains('reject-btn')) {
      openRejectModal(Number(e.target.dataset.idx));
    }
  });
  document.getElementById('selectAllPending').addEventListener('change', function() {
    document.querySelectorAll('.pending-select').forEach(cb => cb.checked = this.checked);
  });
  document.getElementById('confirmApproveBtn').addEventListener('click', () => {
    if (approveIdx !== null) {
      pending[approveIdx].status = 'Approved';
      pending.splice(approveIdx, 1);
      savePending();
      renderPending();
      closeApproveModal();
    }
  });
  document.getElementById('cancelApproveBtn').addEventListener('click', closeApproveModal);
  document.getElementById('confirmRejectBtn').addEventListener('click', () => {
    if (rejectIdx !== null) {
      pending[rejectIdx].status = 'Rejected';
      pending.splice(rejectIdx, 1);
      savePending();
      renderPending();
      closeRejectModal();
    }
  });
  document.getElementById('cancelRejectBtn').addEventListener('click', closeRejectModal);
});
