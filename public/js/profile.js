/* -----------------------------------------
   PROFILE PAGE — JAVASCRIPT LOGIC
------------------------------------------*/

// Load agent profile from backend API

async function getCurrentAgent() {
  try {
    const auth = JSON.parse(localStorage.getItem('rdata_auth'));
    if (!auth || !auth.user || auth.role !== 'agent') return null;
    const url = `/api/auth/agent/profile?email=${encodeURIComponent(auth.user.email)}`;
    console.log('Fetching profile:', url);
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Profile fetch failed:', res.status, res.statusText);
      showProfileError('Profile fetch failed: ' + res.status + ' ' + res.statusText);
      return null;
    }
    const data = await res.json();
    if (!data.user) {
      showProfileError('No user data returned from backend.');
    }
    return data.user || null;
  } catch (err) {
    console.error('Profile fetch error:', err);
    showProfileError('Profile fetch error: ' + err.message);
    return null;
  }
}

function showProfileError(msg) {
  let errDiv = document.getElementById('profile-error');
  if (!errDiv) {
    errDiv = document.createElement('div');
    errDiv.id = 'profile-error';
    errDiv.style.color = 'red';
    errDiv.style.margin = '1em 0';
    document.body.prepend(errDiv);
  }
  errDiv.textContent = msg;
}

let profileData = {
  name: '',
  email: '',
  phone: '',
  agentId: '',
  created: '',
  photo: 'assets/default-avatar.png',
  role: 'agent'
};

// -----------------------------------------
// ELEMENTS
// -----------------------------------------
const nameInput = document.getElementById("profile-name");
const emailInput = document.getElementById("profile-email");
const phoneInput = document.getElementById("profile-phone");
const agentIdInput = document.getElementById("profile-agent-id");

// Logout button logic
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function(e) {
    e.preventDefault();
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("rdata_auth");
      window.location.href = "index.html";
    }
  });
}

let createdInput = document.getElementById("profile-created");
if (!createdInput && agentIdInput) {
  const regDateLabel = document.createElement("label");
  regDateLabel.innerHTML = `Registration Date 
    <input type="text" id="profile-created" disabled>`;
  agentIdInput.parentNode.insertAdjacentElement("afterend", regDateLabel);
  createdInput = document.getElementById("profile-created");
}

const passwordInput = document.getElementById("profile-password");
const profilePhoto = document.querySelector(".profile-photo");
const uploadBtn = document.querySelector(".upload-btn");
const saveBtn = document.getElementById("save-profile");
const toast = document.getElementById("toast");

// ✅ Disable email editing (prevents identity break)
emailInput.disabled = true;



// -----------------------------------------
// LOAD PROFILE DATA
// -----------------------------------------
async function loadProfile() {
  const auth = JSON.parse(localStorage.getItem("rdata_auth"));
  if (!auth || !auth.user || auth.role !== "agent") {
    window.location.replace("login.html");
    return;
  }
  // Fetch agent details from backend
  try {
    const res = await fetch(`/api/auth/agent/profile?email=${encodeURIComponent(auth.user.email)}`);
    if (!res.ok) {
      showProfileError('Failed to fetch agent profile.');
      return;
    }
    const data = await res.json();
    if (!data.user) {
      showProfileError('No agent data found.');
      return;
    }
    // Fill profile fields
    nameInput.value = data.user.name || '';
    emailInput.value = data.user.email || '';
    phoneInput.value = data.user.phone || '';
    agentIdInput.value = data.user.agentId || (data.user.email ? "AGT-" + data.user.email.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase() : '');
    if (createdInput) {
      createdInput.value = data.user.created ? new Date(data.user.created).toLocaleDateString() : '';
    }
    // Optionally show photo if available
    profilePhoto.src = data.user.photo || "assets/default-avatar.png";
    // Save to profileData for other uses
    profileData = { ...profileData, ...data.user };
  } catch (err) {
    showProfileError('Error loading profile: ' + err.message);
  }
}

document.addEventListener('DOMContentLoaded', loadProfile);

// -----------------------------------------
// UPDATE PROFILE PHOTO
// -----------------------------------------
uploadBtn.addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      profilePhoto.src = reader.result;
      profileData.photo = reader.result;
      showToast("Profile photo updated");
      sounds.upload.play();
    };

    reader.readAsDataURL(file);
  };

  fileInput.click();
});

// -----------------------------------------
// SAVE PROFILE
// -----------------------------------------
saveBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim(); // disabled but kept for safety
  const phone = phoneInput.value.trim();
  const password = passwordInput.value.trim();

  if (!name || !email || !phone) {
    showToast("Please fill all required fields");
    sounds.error.play();
    return;
  }

  let users = JSON.parse(localStorage.getItem("rdata_users") || "[]");
  let idx = users.findIndex(u => u.email === profileData.email);

  if (idx === -1) {
    showToast("User not found.");
    sounds.error.play();
    return;
  }

  users[idx].name = name;
  users[idx].phone = phone;

  if (password) {
    users[idx].password = password;
    showToast("Password updated.");
  } else {
    showToast("Profile updated successfully");
  }

  localStorage.setItem("rdata_users", JSON.stringify(users));

  // ✅ Update auth session
  let auth = JSON.parse(localStorage.getItem("rdata_auth"));
  if (auth && auth.user && auth.user.email === email) {
    auth.user.name = name;
    auth.user.phone = phone;
    localStorage.setItem("rdata_auth", JSON.stringify(auth));
  }

  sounds.save.play();
});

// -----------------------------------------
// TOAST NOTIFICATION
// -----------------------------------------
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Show bundles link if agent just logged in or if showBundles param is present


function showBundlesSection() {
  const bundlesSection = document.getElementById('bundles-section');
  if (bundlesSection) {
    bundlesSection.classList.remove('bundles-section-hidden');
    bundlesSection.style.display = 'block';
    // If bundles are not loaded, load them
    if (!bundlesSection.innerHTML.trim()) {
      if (typeof loadBundlesIfVerified === 'function') {
        loadBundlesIfVerified();
      }
    }
    bundlesSection.scrollIntoView({ behavior: 'smooth' });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Show the Sell Bundles button if agent is logged in
  const auth = JSON.parse(localStorage.getItem('rdata_auth'));
  if (auth && auth.user && auth.role === 'agent') {
    const bundlesLinkSection = document.getElementById('bundles-link-section');
    if (bundlesLinkSection) bundlesLinkSection.style.display = 'block';
    const showBundlesBtn = document.getElementById('show-bundles-btn');
    if (showBundlesBtn) {
      showBundlesBtn.addEventListener('click', showBundlesSection);
    }
  }
});