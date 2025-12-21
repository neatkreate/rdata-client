/* -----------------------------------------
   RECENT SALES — JAVASCRIPT LOGIC
------------------------------------------*/

// Sample sales data (replace with backend later)
const sales = [
  {
    id: 1,
    date: "2025-01-10 14:22",
    number: "0551234567",
    network: "mtn",
    bundle: "5GB",
    price: 25,
    profit: 5,
    status: "success"
  },
  {
    id: 2,
    date: "2025-01-10 09:10",
    number: "0249988776",
    network: "vodafone",
    bundle: "3GB",
    price: 15,
    profit: 3,
    status: "success"
  },
  {
    id: 3,
    date: "2025-01-09 18:40",
    number: "0275566778",
    network: "airteltigo",
    bundle: "1GB",
    price: 5,
    profit: 1,
    status: "failed"
  },
  {
    id: 4,
    date: "2025-01-08 11:05",
    number: "0558884441",
    network: "mtn",
    bundle: "10GB",
    price: 45,
    profit: 10,
    status: "success"
  }
];

// Elements
const tableBody = document.getElementById("sales-table-body");
const cardsContainer = document.getElementById("sales-cards");

const filterNetwork = document.getElementById("filter-network");
const filterPeriod = document.getElementById("filter-period");
const searchInput = document.getElementById("search-sales");

const toast = document.getElementById("toast");

// Playful sound effects
const sounds = {
  success: new Audio("sounds/pop-open.mp3"),
  error: new Audio("sounds/pop-close.mp3")
};
Object.values(sounds).forEach(s => s.volume = 0.25);

// -----------------------------------------
// RENDER FUNCTIONS
// -----------------------------------------

function renderSales(list) {
  renderTable(list);
  renderCards(list);
}

function renderTable(list) {
  tableBody.innerHTML = "";

  list.forEach(sale => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${sale.date}</td>
      <td>${sale.number}</td>
      <td>${sale.network.toUpperCase()}</td>
      <td>${sale.bundle}</td>
      <td>₵${sale.price}</td>
      <td>₵${sale.profit}</td>
      <td>
        <span class="${sale.status === 'success' ? 'status-success' : 'status-failed'}">
          ${sale.status.toUpperCase()}
        </span>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function renderCards(list) {
  cardsContainer.innerHTML = "";

  list.forEach(sale => {
    const card = document.createElement("div");
    card.classList.add("sale-card");

    const statusClass = sale.status === "success" ? "status-success" : "status-failed";

    card.innerHTML = `
      <h3>${sale.bundle} — ${sale.network.toUpperCase()}</h3>
      <p><strong>Date:</strong> ${sale.date}</p>
      <p><strong>Customer:</strong> ${sale.number}</p>
      <p><strong>Price:</strong> ₵${sale.price}</p>
      <p><strong>Profit:</strong> ₵${sale.profit}</p>
      <span class="status-badge ${statusClass}">
        ${sale.status.toUpperCase()}
      </span>
    `;

    cardsContainer.appendChild(card);
  });
}

// -----------------------------------------
// FILTERING + SEARCH
// -----------------------------------------

function applyFilters() {
  let filtered = sales;

  // Network filter
  if (filterNetwork.value) {
    filtered = filtered.filter(s => s.network === filterNetwork.value);
  }

  // Period filter
  if (filterPeriod.value) {
    const now = new Date();

    filtered = filtered.filter(s => {
      const saleDate = new Date(s.date);

      if (filterPeriod.value === "today") {
        return saleDate.toDateString() === now.toDateString();
      }

      if (filterPeriod.value === "week") {
        const diff = now - saleDate;
        return diff <= 7 * 24 * 60 * 60 * 1000;
      }

      if (filterPeriod.value === "month") {
        return saleDate.getMonth() === now.getMonth() &&
               saleDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }

  // Search filter
  const search = searchInput.value.toLowerCase();
  if (search) {
    filtered = filtered.filter(s =>
      s.number.includes(search) ||
      s.bundle.toLowerCase().includes(search) ||
      s.network.toLowerCase().includes(search)
    );
  }

  renderSales(filtered);
}

// Event listeners
filterNetwork.addEventListener("change", applyFilters);
filterPeriod.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

// -----------------------------------------
// TOAST NOTIFICATION
// -----------------------------------------

function showToast(message, type = "success") {
  toast.textContent = message;
  toast.classList.add("show");

  if (type === "success") sounds.success.play();
  else sounds.error.play();

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// -----------------------------------------
// INITIAL RENDER
// -----------------------------------------
renderSales(sales);