/* -----------------------------------------
   AVAILABLE BUNDLES — JAVASCRIPT LOGIC
*/
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.overlay');
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  // Optional sound effects - only if files exist and browser allows autoplay
  const sounds = {};
  try {
    sounds.openSidebar = new Audio('sounds/pop-open.mp3');
    sounds.closeSidebar = new Audio('sounds/pop-close.mp3');
    sounds.dropdown = new Audio('sounds/bubble.mp3');
    Object.values(sounds).forEach(s => s.volume = 0.25);
  } catch (err) {
    // If audio files aren't available, skip sound playback silently
  }

  // Helper to safely play a sound
  const tryPlay = s => { try { s && typeof s.play === 'function' && s.play(); } catch (e) {} };

  // Sidebar toggle
  if (hamburger && sidebar && overlay) {
    hamburger.addEventListener('click', () => {
      const isOpening = !sidebar.classList.contains('active');

      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
      hamburger.classList.toggle('active');

      isOpening ? tryPlay(sounds.openSidebar) : tryPlay(sounds.closeSidebar);
    });

    // Close sidebar when overlay is clicked
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      hamburger.classList.remove('active');
      tryPlay(sounds.closeSidebar);
    });

    // Click outside to close (safely guarded)
    document.addEventListener('click', e => {
      if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
        if (sidebar.classList.contains('active')) {
          sidebar.classList.remove('active');
          overlay.classList.remove('active');
          hamburger.classList.remove('active');
          tryPlay(sounds.closeSidebar);
        }
      }
    });
  }

  // Dropdown toggles
  if (dropdownToggles && dropdownToggles.length) {
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', e => {
        e.preventDefault();
        const parent = toggle.parentElement;
        parent.classList.toggle('open');
        tryPlay(sounds.dropdown);
        toggle.classList.add('bounce');
        setTimeout(() => toggle.classList.remove('bounce'), 300);
      });
    });
  }
});

// Sample bundle data (replace with backend later)
// Sample bundle data (replace with backend later)
const bundles = [
  { id: 1, network: "mtn", size: "5GB", price: 25, profit: 5, validity: "30 days" },
  { id: 2, network: "mtn", size: "10GB", price: 45, profit: 10, validity: "30 days" },
  { id: 3, network: "vodafone", size: "3GB", price: 15, profit: 3, validity: "7 days" },
  { id: 4, network: "vodafone", size: "20GB", price: 70, profit: 15, validity: "30 days" },
  { id: 5, network: "airteltigo", size: "1GB", price: 5, profit: 1, validity: "1 day" },
  { id: 6, network: "airteltigo", size: "12GB", price: 50, profit: 12, validity: "30 days" }
];

// Elements
const tableBody = document.getElementById("bundles-table-body");
const cardsContainer = document.getElementById("bundles-cards");

const filterNetwork = document.getElementById("filter-network");
const filterSize = document.getElementById("filter-size");
const filterValidity = document.getElementById("filter-validity");
const searchInput = document.getElementById("search-bundles");

const sellModal = document.getElementById("sellModal");
const selectedBundleInfo = document.getElementById("selected-bundle-info");
const customerNumberInput = document.getElementById("customer-number");
const confirmSellBtn = document.getElementById("confirm-sell");
const closeSellModalBtn = document.getElementById("close-sell-modal");

const toast = document.getElementById("toast");

// Playful sound effects for modal
const modalSounds = {
  openModal: new Audio("sounds/bubble.mp3"),
  confirm: new Audio("sounds/pop-open.mp3"),
  error: new Audio("sounds/pop-close.mp3")
};
Object.values(modalSounds).forEach(s => s.volume = 0.25);

// -----------------------------------------
// RENDER FUNCTIONS
// -----------------------------------------

function renderBundles(list) {
  renderTable(list);
  renderCards(list);
}

function renderTable(list) {
  tableBody.innerHTML = "";

  list.forEach(bundle => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${bundle.network.toUpperCase()}</td>
      <td>${bundle.size}</td>
      <td>₵${bundle.price}</td>
      <td>₵${bundle.profit}</td>
      <td>${bundle.validity}</td>
      <td><button class="sell-btn" onclick="openSellModal(${bundle.id})">Sell Now</button></td>
    `;
    tableBody.appendChild(row);
  });
}

function renderCards(list) {
  cardsContainer.innerHTML = "";

  list.forEach(bundle => {
    const card = document.createElement("div");
    card.classList.add("bundle-card");

    const networkClass =
      bundle.network === "mtn" ? "network-mtn" :
      bundle.network === "vodafone" ? "network-vodafone" :
      "network-airteltigo";

    card.innerHTML = `
      <span class="network-badge ${networkClass}">${bundle.network.toUpperCase()}</span>
      <h3>${bundle.size}</h3>
      <p><strong>Price:</strong> ₵${bundle.price}</p>
      <p><strong>Profit:</strong> ₵${bundle.profit}</p>
      <p><strong>Validity:</strong> ${bundle.validity}</p>
      <button class="sell-btn" onclick="openSellModal(${bundle.id})">Sell Now</button>
    `;
    cardsContainer.appendChild(card);
  });
}

// -----------------------------------------
// FILTERING + SEARCH
// -----------------------------------------

function applyFilters() {
  let filtered = bundles;

  // Network filter
  if (filterNetwork.value) {
    filtered = filtered.filter(b => b.network === filterNetwork.value);
  }

  // Size filter
  if (filterSize.value) {
    const [min, max] = filterSize.value.split("-");
    filtered = filtered.filter(b => {
      const sizeNum = parseInt(b.size);
      if (max) return sizeNum >= min && sizeNum <= max;
      return sizeNum >= parseInt(min);
    });
  }

  // Validity filter
  if (filterValidity.value) {
    filtered = filtered.filter(b =>
      b.validity.toLowerCase().includes(filterValidity.value)
    );
  }

  // Search
  const search = searchInput.value.toLowerCase();
  if (search) {
    filtered = filtered.filter(b =>
      b.size.toLowerCase().includes(search) ||
      b.network.toLowerCase().includes(search)
    );
  }

  renderBundles(filtered);
}

// Event listeners
filterNetwork.addEventListener("change", applyFilters);
filterSize.addEventListener("change", applyFilters);
filterValidity.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

// -----------------------------------------
// SELL MODAL LOGIC
// -----------------------------------------

let selectedBundle = null;

function openSellModal(id) {
  selectedBundle = bundles.find(b => b.id === id);

  selectedBundleInfo.innerHTML = `
    <strong>${selectedBundle.network.toUpperCase()}</strong> — ${selectedBundle.size} (₵${selectedBundle.price})
  `;

  customerNumberInput.value = "";
  sellModal.classList.add("active");
  modalSounds.openModal.play();
}

closeSellModalBtn.addEventListener("click", () => {
  sellModal.classList.remove("active");
});

// Confirm sale
confirmSellBtn.addEventListener("click", () => {
  const number = customerNumberInput.value.trim();

  if (number.length < 10) {
    showToast("Invalid customer number");
    modalSounds.error.play();
    return;
  }

  sellModal.classList.remove("active");
  showToast("Sale Successful!");
  modalSounds.confirm.play();
});

// -----------------------------------------
// TOAST
// -----------------------------------------

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// -----------------------------------------
// INITIAL RENDER
// -----------------------------------------
renderBundles(bundles);

// Make openSellModal globally accessible
window.openSellModal = openSellModal;