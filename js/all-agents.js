// All Agents Page Logic
const AGENTS_KEY = 'rdata_agents';
let agents = [];
let editingAgentIdx = null;
let deleteAgentIdx = null;

function loadAgents() {
  try {
    agents = JSON.parse(localStorage.getItem(AGENTS_KEY)) || [];
  } catch { agents = []; }
}
function saveAgents() {
  localStorage.setItem(AGENTS_KEY, JSON.stringify(agents));
}
function renderAgents() {
  const tbody = document.getElementById('agentsTableBody');
  const search = (document.getElementById('searchAgents')?.value || '').toLowerCase();
  const status = document.getElementById('filterAgentStatus')?.value || '';
  let filtered = agents.filter(a =>
    (!search || a.name.toLowerCase().includes(search) || a.email.toLowerCase().includes(search) || a.status.toLowerCase().includes(search)) &&
    (!status || a.status === status)
  );
  tbody.innerHTML = filtered.map((a, i) => `
    <tr>
      <td><input type="checkbox" class="agent-select" data-idx="${i}"></td>
      <td>${a.name}</td>
      <td>${a.email}</td>
      <td><span class="status-badge status-${a.status.toLowerCase()}">${a.status}</span></td>
      <td>
        <button class="edit-btn" data-idx="${i}">Edit</button>
        <button class="suspend-btn" data-idx="${i}">${a.status === 'Suspended' ? 'Reinstate' : 'Suspend'}</button>
        <button class="delete-btn" data-idx="${i}">Delete</button>
      </td>
    </tr>
  `).join('');
}
function openAgentModal(editIdx = null) {
  editingAgentIdx = editIdx;
  const modal = document.getElementById('agentModal');
  const title = document.getElementById('agentModalTitle');
  const name = document.getElementById('modalAgentName');
  const email = document.getElementById('modalAgentEmail');
  const status = document.getElementById('modalAgentStatus');
  if (editIdx !== null) {
    const a = agents[editIdx];
    title.textContent = 'Edit Agent';
    name.value = a.name;
    email.value = a.email;
    status.value = a.status;
  } else {
    title.textContent = 'Add Agent';
    name.value = '';
    email.value = '';
    status.value = 'Active';
  }
  modal.style.display = 'block';
}
function closeAgentModal() {
  document.getElementById('agentModal').style.display = 'none';
}
function openDeleteModal(idx) {
  deleteAgentIdx = idx;
  document.getElementById('confirmDeleteModal').style.display = 'block';
}
function closeDeleteModal() {
  document.getElementById('confirmDeleteModal').style.display = 'none';
}
document.addEventListener('DOMContentLoaded', () => {
  loadAgents();
  renderAgents();
  document.getElementById('searchAgents').addEventListener('input', renderAgents);
  document.getElementById('filterAgentStatus').addEventListener('change', renderAgents);
  document.getElementById('addAgentBtn').addEventListener('click', () => openAgentModal());
  document.getElementById('closeAgentModal').addEventListener('click', closeAgentModal);
  document.getElementById('agentForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('modalAgentName').value.trim();
    const email = document.getElementById('modalAgentEmail').value.trim();
    const status = document.getElementById('modalAgentStatus').value;
    if (!name || !email) return alert('Name and email required');
    if (editingAgentIdx !== null) {
      agents[editingAgentIdx] = { name, email, status };
    } else {
      agents.push({ name, email, status });
    }
    saveAgents();
    closeAgentModal();
    renderAgents();
  });
  document.getElementById('agentsTableBody').addEventListener('click', e => {
    if (e.target.classList.contains('edit-btn')) {
      openAgentModal(Number(e.target.dataset.idx));
    } else if (e.target.classList.contains('suspend-btn')) {
      const idx = Number(e.target.dataset.idx);
      agents[idx].status = agents[idx].status === 'Suspended' ? 'Active' : 'Suspended';
      saveAgents();
      renderAgents();
    } else if (e.target.classList.contains('delete-btn')) {
      openDeleteModal(Number(e.target.dataset.idx));
    }
  });
  document.getElementById('closeAgentModal').addEventListener('click', closeAgentModal);
  document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (deleteAgentIdx !== null) {
      agents.splice(deleteAgentIdx, 1);
      saveAgents();
      renderAgents();
      closeDeleteModal();
    }
  });
  document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
  document.getElementById('selectAllAgents').addEventListener('change', function() {
    document.querySelectorAll('.agent-select').forEach(cb => cb.checked = this.checked);
  });
  document.getElementById('bulkSuspendBtn').addEventListener('click', () => {
    document.querySelectorAll('.agent-select:checked').forEach(cb => {
      const idx = Number(cb.dataset.idx);
      if (agents[idx].status !== 'Suspended') agents[idx].status = 'Suspended';
    });
    saveAgents();
    renderAgents();
  });
  document.getElementById('bulkDeleteBtn').addEventListener('click', () => {
    agents = agents.filter((a, i) => !document.querySelector('.agent-select[data-idx="'+i+'"]:checked'));
    saveAgents();
    renderAgents();
  });
});
