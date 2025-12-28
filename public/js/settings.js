/* -----------------------------------------
   SETTINGS PAGE — JAVASCRIPT LOGIC
------------------------------------------*/

// Elements
const linkedAccountsList = document.getElementById("linked-accounts-list");
const linkGoogleBtn = document.getElementById("link-google-btn");
const linkFacebookBtn = document.getElementById("link-facebook-btn");
const loginHistoryBody = document.getElementById("login-history-body");
const deleteAccountBtn = document.getElementById("delete-account-btn");
const modalDeleteAccount = document.getElementById("modal-delete-account");
const confirmDeleteAccountBtn = document.getElementById("confirm-delete-account");
const cancelDeleteAccountBtn = document.getElementById("cancel-delete-account");
const downloadDataBtn = document.getElementById("download-data-btn");
const userEmailInput = document.getElementById("user-email");
const userPhoneInput = document.getElementById("user-phone");
const emailStatus = document.getElementById("email-status");
const phoneStatus = document.getElementById("phone-status");
const verifyEmailBtn = document.getElementById("verify-email-btn");
const verifyPhoneBtn = document.getElementById("verify-phone-btn");
const apiKeyForm = document.getElementById("api-key-form");
const apiKeyInput = document.getElementById("api-key-input");
const apiKeysList = document.getElementById("api-keys-list");
const toggleSound = document.getElementById("toggle-sound");
const toggleToast = document.getElementById("toggle-toast");
const toggleOffers = document.getElementById("toggle-offers");
const toggleDark = document.getElementById("toggle-dark");
const toggleCompact = document.getElementById("toggle-compact");
const toggle2FA = document.getElementById("toggle-2fa");
const toggleDataSharing = document.getElementById("toggle-data-sharing");
const toggleCookies = document.getElementById("toggle-cookies");
const toggleTracking = document.getElementById("toggle-tracking");

const newPasswordInput = document.getElementById("new-password");
const savePasswordBtn = document.getElementById("save-password");

const toast = document.getElementById("toast");
const modal2FA = document.getElementById("modal-2fa");
const close2FAModalBtn = document.getElementById("close-2fa-modal");

// Playful sound effects
const sounds = {
  toggle: new Audio("sounds/bubble.mp3"),
  save: new Audio("sounds/pop-open.mp3"),
  error: new Audio("sounds/pop-close.mp3")
};
Object.values(sounds).forEach(s => s.volume = 0.25);

// -----------------------------------------
// LOAD SETTINGS FROM LOCAL STORAGE
// -----------------------------------------

function loadSettings() {
          // Linked Accounts
          if (linkedAccountsList) renderLinkedAccounts();
        // Simulated login history
        if (loginHistoryBody) {
          const history = [
            { date: "2025-12-13 10:22", device: "Windows Chrome", location: "Accra, Ghana", status: "Success" },
            { date: "2025-12-12 21:05", device: "Android Mobile", location: "Kumasi, Ghana", status: "Success" },
            { date: "2025-12-11 18:44", device: "Mac Safari", location: "Cape Coast, Ghana", status: "Failed" },
            { date: "2025-12-10 08:12", device: "iPhone", location: "Takoradi, Ghana", status: "Success" }
          ];
          loginHistoryBody.innerHTML = history.map(h =>
            `<tr>
              <td>${h.date}</td>
              <td>${h.device}</td>
              <td>${h.location}</td>
              <td style="color:${h.status==='Success'?'#27ae60':'#c0392b'};font-weight:600;">${h.status}</td>
            </tr>`
          ).join("");
        }
      // Email/Phone verification load
      if (userEmailInput) {
        userEmailInput.value = localStorage.getItem("user_email") || "";
        const verified = localStorage.getItem("user_email_verified") === "true";
        emailStatus.textContent = verified ? "Verified" : "Not verified";
        emailStatus.style.color = verified ? "#27ae60" : "#e67e22";
      }
      if (userPhoneInput) {
        userPhoneInput.value = localStorage.getItem("user_phone") || "";
        const verified = localStorage.getItem("user_phone_verified") === "true";
        phoneStatus.textContent = verified ? "Verified" : "Not verified";
        phoneStatus.style.color = verified ? "#27ae60" : "#e67e22";
      }
    // Load API keys
    if (apiKeysList) renderApiKeys();
  toggleSound.checked = JSON.parse(localStorage.getItem("setting_sound")) ?? true;
  toggleToast.checked = JSON.parse(localStorage.getItem("setting_toast")) ?? true;
  toggleOffers.checked = JSON.parse(localStorage.getItem("setting_offers")) ?? true;
  toggleDark.checked = JSON.parse(localStorage.getItem("setting_dark")) ?? false;
  toggleCompact.checked = JSON.parse(localStorage.getItem("setting_compact")) ?? false;

  toggle2FA.checked = JSON.parse(localStorage.getItem("setting_2fa")) ?? false;
  toggleDataSharing.checked = JSON.parse(localStorage.getItem("setting_data_sharing")) ?? true;
  toggleCookies.checked = JSON.parse(localStorage.getItem("setting_cookies")) ?? true;
  toggleTracking.checked = JSON.parse(localStorage.getItem("setting_tracking")) ?? false;

  applyDarkMode(toggleDark.checked);
  applyCompactMode(toggleCompact.checked);
}

loadSettings();

// -----------------------------------------
// SAVE SETTINGS
// -----------------------------------------

function saveSetting(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  sounds.toggle.play();
  showToast("Setting updated");
}

// -----------------------------------------
// DARK MODE
// -----------------------------------------

function applyDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

// -----------------------------------------
// COMPACT MODE
// -----------------------------------------

function applyCompactMode(enabled) {
  if (enabled) {
    document.body.classList.add("compact-mode");
  } else {
    document.body.classList.remove("compact-mode");
  }
}

// -----------------------------------------
// EVENT LISTENERS FOR TOGGLES

// Email/Phone input persistence
if (userEmailInput) {
  userEmailInput.addEventListener("input", () => {
    localStorage.setItem("user_email", userEmailInput.value);
    localStorage.setItem("user_email_verified", "false");
    emailStatus.textContent = "Not verified";
    emailStatus.style.color = "#e67e22";
  });
}
if (userPhoneInput) {
  userPhoneInput.addEventListener("input", () => {
    localStorage.setItem("user_phone", userPhoneInput.value);
    localStorage.setItem("user_phone_verified", "false");
    phoneStatus.textContent = "Not verified";
    phoneStatus.style.color = "#e67e22";
  });
}

// Simulated verification
if (verifyEmailBtn) {
  verifyEmailBtn.addEventListener("click", () => {
    if (!userEmailInput.value || !userEmailInput.value.includes("@")) {
      showToast("Enter a valid email address", "error");
      return;
    }
    // Simulate sending code and verifying
    setTimeout(() => {
      localStorage.setItem("user_email_verified", "true");
      emailStatus.textContent = "Verified";
      emailStatus.style.color = "#27ae60";
      showToast("Email verified");
    }, 700);
  });
}
if (verifyPhoneBtn) {
  verifyPhoneBtn.addEventListener("click", () => {
    if (!userPhoneInput.value || userPhoneInput.value.length < 7) {
      showToast("Enter a valid phone number", "error");
      return;
    }
    // Simulate sending code and verifying
    setTimeout(() => {
      localStorage.setItem("user_phone_verified", "true");
      phoneStatus.textContent = "Verified";
      phoneStatus.style.color = "#27ae60";
      showToast("Phone verified");
    }, 700);
  });
}

if (toggleDataSharing) {
  toggleDataSharing.addEventListener("change", () => {
    saveSetting("setting_data_sharing", toggleDataSharing.checked);
  });
}
if (toggleCookies) {
  toggleCookies.addEventListener("change", () => {
    saveSetting("setting_cookies", toggleCookies.checked);
  });
}
if (toggleTracking) {
  toggleTracking.addEventListener("change", () => {
    saveSetting("setting_tracking", toggleTracking.checked);
  });
}

toggle2FA.addEventListener("change", () => {
  saveSetting("setting_2fa", toggle2FA.checked);
  if (toggle2FA.checked) {
    // Show modal with info when enabling 2FA
    if (modal2FA) modal2FA.style.display = "flex";
  }
});

if (close2FAModalBtn) {
  close2FAModalBtn.addEventListener("click", () => {
    if (modal2FA) modal2FA.style.display = "none";
  });
}
// -----------------------------------------

toggleSound.addEventListener("change", () => {
  saveSetting("setting_sound", toggleSound.checked);
});

toggleToast.addEventListener("change", () => {
  saveSetting("setting_toast", toggleToast.checked);
});

toggleOffers.addEventListener("change", () => {
  saveSetting("setting_offers", toggleOffers.checked);
});

toggleDark.addEventListener("change", () => {
  saveSetting("setting_dark", toggleDark.checked);
  applyDarkMode(toggleDark.checked);
});

toggleCompact.addEventListener("change", () => {
  saveSetting("setting_compact", toggleCompact.checked);
  applyCompactMode(toggleCompact.checked);
});

// -----------------------------------------
// PASSWORD UPDATE
// -----------------------------------------


// Auto-save draft for password field
const PASSWORD_DRAFT_KEY = "draft_new_password";
if (newPasswordInput) {
  // Restore draft on load
  const draft = localStorage.getItem(PASSWORD_DRAFT_KEY);
  if (draft) newPasswordInput.value = draft;

  // Save draft on input
  newPasswordInput.addEventListener("input", () => {
    localStorage.setItem(PASSWORD_DRAFT_KEY, newPasswordInput.value);
  });
}

savePasswordBtn.addEventListener("click", () => {
  const newPass = newPasswordInput.value.trim();

  if (!newPass) {
    showToast("Enter a new password", "error");
    sounds.error.play();
    return;
  }

  // Placeholder for backend update
  console.log("Password updated:", newPass);

  newPasswordInput.value = "";
  localStorage.removeItem(PASSWORD_DRAFT_KEY);
  showToast("Password updated successfully");
  sounds.save.play();
});

// -----------------------------------------
// TOAST NOTIFICATION

// Linked Accounts Management
const LINKED_ACCOUNTS_KEY = "linked_accounts";
function getLinkedAccounts() {
  return JSON.parse(localStorage.getItem(LINKED_ACCOUNTS_KEY)) || [];
}
function setLinkedAccounts(accounts) {
  localStorage.setItem(LINKED_ACCOUNTS_KEY, JSON.stringify(accounts));
}
function renderLinkedAccounts() {
  const accounts = getLinkedAccounts();
  linkedAccountsList.innerHTML = "";
  if (accounts.length === 0) {
    linkedAccountsList.innerHTML = '<li style="color:#888;">No accounts linked.</li>';
    return;
  }
  accounts.forEach(acc => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "space-between";
    li.innerHTML = `<span>${acc}</span> <button data-acc="${acc}" class="unlink-account-btn" style="margin-left:1rem;background:#e74c3c;color:#fff;border:none;padding:0.2rem 0.7rem;border-radius:4px;cursor:pointer;">Unlink</button>`;
    linkedAccountsList.appendChild(li);
  });
}
if (linkedAccountsList) {
  linkedAccountsList.addEventListener("click", e => {
    if (e.target.classList.contains("unlink-account-btn")) {
      const acc = e.target.getAttribute("data-acc");
      let accounts = getLinkedAccounts();
      accounts = accounts.filter(a => a !== acc);
      setLinkedAccounts(accounts);
      renderLinkedAccounts();
      showToast(acc + " unlinked");
    }
  });
}
if (linkGoogleBtn) {
  linkGoogleBtn.addEventListener("click", () => {
    let accounts = getLinkedAccounts();
    if (!accounts.includes("Google")) {
      accounts.push("Google");
      setLinkedAccounts(accounts);
      renderLinkedAccounts();
      showToast("Google linked");
    } else {
      showToast("Google already linked", "error");
    }
  });
}
if (linkFacebookBtn) {
  linkFacebookBtn.addEventListener("click", () => {
    let accounts = getLinkedAccounts();
    if (!accounts.includes("Facebook")) {
      accounts.push("Facebook");
      setLinkedAccounts(accounts);
      renderLinkedAccounts();
      showToast("Facebook linked");
    } else {
      showToast("Facebook already linked", "error");
    }
  });
}

// Delete Account logic
if (deleteAccountBtn && modalDeleteAccount) {
  deleteAccountBtn.addEventListener("click", () => {
    modalDeleteAccount.style.display = "flex";
  });
}
if (cancelDeleteAccountBtn && modalDeleteAccount) {
  cancelDeleteAccountBtn.addEventListener("click", () => {
    modalDeleteAccount.style.display = "none";
  });
}
if (confirmDeleteAccountBtn && modalDeleteAccount) {
  confirmDeleteAccountBtn.addEventListener("click", () => {
    // Clear all user data
    localStorage.clear();
    modalDeleteAccount.style.display = "none";
    showToast("Account deleted. Reloading...");
    setTimeout(() => {
      location.reload();
    }, 1200);
  });
}

// Download My Data
if (downloadDataBtn) {
  downloadDataBtn.addEventListener("click", () => {
    // Gather user data from localStorage
    const data = {
      email: localStorage.getItem("user_email") || null,
      emailVerified: localStorage.getItem("user_email_verified") === "true",
      phone: localStorage.getItem("user_phone") || null,
      phoneVerified: localStorage.getItem("user_phone_verified") === "true",
      settings: {
        sound: JSON.parse(localStorage.getItem("setting_sound")),
        toast: JSON.parse(localStorage.getItem("setting_toast")),
        offers: JSON.parse(localStorage.getItem("setting_offers")),
        dark: JSON.parse(localStorage.getItem("setting_dark")),
        compact: JSON.parse(localStorage.getItem("setting_compact")),
        twoFA: JSON.parse(localStorage.getItem("setting_2fa")),
        dataSharing: JSON.parse(localStorage.getItem("setting_data_sharing")),
        cookies: JSON.parse(localStorage.getItem("setting_cookies")),
        tracking: JSON.parse(localStorage.getItem("setting_tracking")),
      },
      apiKeys: JSON.parse(localStorage.getItem("user_api_keys")) || []
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rdata-user-data.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    showToast("Data downloaded");
  });
}
// API Keys/Integrations Management
const API_KEYS_STORAGE_KEY = "user_api_keys";

function getApiKeys() {
  return JSON.parse(localStorage.getItem(API_KEYS_STORAGE_KEY)) || [];
}

function setApiKeys(keys) {
  localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(keys));
}

function renderApiKeys() {
  const keys = getApiKeys();
  apiKeysList.innerHTML = "";
  if (keys.length === 0) {
    apiKeysList.innerHTML = '<li style="color:#888;">No API keys added.</li>';
    return;
  }
  keys.forEach((key, idx) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "space-between";
    li.innerHTML = `<span style="word-break:break-all;">${key}</span> <button data-idx="${idx}" class="remove-api-key-btn" style="margin-left:1rem;background:#e74c3c;color:#fff;border:none;padding:0.2rem 0.7rem;border-radius:4px;cursor:pointer;">Remove</button>`;
    apiKeysList.appendChild(li);
  });
}

if (apiKeyForm && apiKeyInput && apiKeysList) {
  apiKeyForm.addEventListener("submit", e => {
    e.preventDefault();
    const val = apiKeyInput.value.trim();
    if (!val) {
      showToast("Enter a valid API key", "error");
      return;
    }
    const keys = getApiKeys();
    keys.push(val);
    setApiKeys(keys);
    apiKeyInput.value = "";
    renderApiKeys();
    showToast("API key added");
  });

  apiKeysList.addEventListener("click", e => {
    if (e.target.classList.contains("remove-api-key-btn")) {
      const idx = parseInt(e.target.getAttribute("data-idx"));
      const keys = getApiKeys();
      keys.splice(idx, 1);
      setApiKeys(keys);
      renderApiKeys();
      showToast("API key removed");
    }
  });
}
// -----------------------------------------

function showToast(message, type = "success") {
  if (!toggleToast.checked) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}