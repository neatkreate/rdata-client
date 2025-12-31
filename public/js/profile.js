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
// SOUND EFFECTS
// -----------------------------------------
const sounds = {
  save: new Audio("sounds/pop-open.mp3"),
  error: new Audio("sounds/pop-close.mp3"),
  upload: new Audio("sounds/bubble.mp3")
};
Object.values(sounds).forEach(s => s.volume = 0.25);

// -----------------------------------------
// LOAD PROFILE DATA
// -----------------------------------------
function loadProfile() {
  const auth = JSON.parse(localStorage.getItem("rdata_auth"));

  // ✅ Safe redirect (no loops)
  if (!auth || !auth.user || auth.role !== "agent") {
    window.location.replace("login.html");
    return;
  }

  nameInput.value = profileData.name;
  emailInput.value = profileData.email;
  phoneInput.value = profileData.phone;

  agentIdInput.value =
    profileData.agentId ||
    (profileData.email
      ? "AGT-" +
        profileData.email.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase()
      : "");

  profilePhoto.src = profileData.photo || "assets/default-avatar.png";

  if (createdInput) {
    createdInput.value = profileData.created
      ? new Date(profileData.created).toLocaleDateString()
      : "";
  }
}

loadProfile();

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
function maybeShowBundlesLink() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('showBundles') === '1') {
    const bundlesLinkSection = document.getElementById('bundles-link-section');
    if (bundlesLinkSection) bundlesLinkSection.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', maybeShowBundlesLink);