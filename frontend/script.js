// frontend/script.js
 console.log("✅ JS loaded");

const backendURL = "https://mental-health-journal-and-resource-app.onrender.com";
// Change if using different port

// Register
const registerForm = document.getElementById('registerForm');
console.log("registerForm found?", registerForm);

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Register form submitted!");

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      console.log("Sending request to:", `${backendURL}/api/auth/register`);
      const res = await fetch(`${backendURL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok) {
        alert('Registration successful!');
        window.location.href = 'login.html';
      } else {
        alert(data.message || 'Registration failed');
      }

    } catch (error) {
      console.error("❌ Fetch error:", error);
      alert("Network error: Could not connect to server");
    }
  });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const res = await fetch(`${backendURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Login failed');
    }
  });
}
// Check if token exists
const token = localStorage.getItem('token');

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });
}

// Add Journal Entry
const journalForm = document.getElementById('journalForm');
if (journalForm && token) {
  journalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.getElementById('entry').value.trim();
    const res = await fetch(`${backendURL}/api/journals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });

    const data = await res.json();
    if (res.ok) {
      document.getElementById('entry').value = '';
      loadJournals(); // reload entries
    } else {
      alert(data.message || 'Failed to save entry');
    }
  });
}

// Load Journal Entries
async function loadJournals() {
  const list = document.getElementById('journalList');
  if (!list || !token) return;

  const res = await fetch(`${backendURL}/api/journals`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await res.json();
  if (res.ok) {
    list.innerHTML = '';
    data.forEach(j => {
      const li = document.createElement('li');
      li.textContent = `[${new Date(j.date).toLocaleString()}] ${j.content}`;
      list.appendChild(li);
    });
  } else {
    alert('Could not load journal entries');
  }
}

if (document.getElementById('journalList')) loadJournals();
// ======================
// Mood Tracker Logic
// ======================



const moodForm = document.getElementById('moodForm');
const moodSelect = document.getElementById('moodSelect');
const moodHistory = document.getElementById('moodHistory');
//const backendURL = 'http://localhost:5000'; // Update if needed

if (moodForm && moodSelect && moodHistory) {
  // Submit mood
  moodForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedMood = moodSelect.value;
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in to track your mood.');
      window.location.href = 'login.html';
      return;
    }

    try {
      const res = await fetch(`${backendURL}/api/mood`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ mood: selectedMood })
      });

      if (!res.ok) throw new Error('Mood submission failed');

      alert('Mood saved successfully!');
      moodForm.reset();
      loadMoodHistory();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });

  // Load mood history
  async function loadMoodHistory() {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${backendURL}/api/mood`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to load moods');

      const moods = await res.json();
      moodHistory.innerHTML = '';

      if (moods.length === 0) {
        moodHistory.innerHTML = '<li>No moods tracked yet.</li>';
        return;
      }

      moods.forEach((entry) => {
        const li = document.createElement('li');
        const date = new Date(entry.date).toLocaleString();
        li.textContent = `${date} — ${entry.mood}`;
        moodHistory.appendChild(li);
      });

    } catch (err) {
      moodHistory.innerHTML = '<li>Error loading moods.</li>';
    }
  }

  // Load on page load
  loadMoodHistory();
}
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    try {
      const res = await fetch(`${backendURL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      const data = await res.json();
      document.getElementById('responseMsg').textContent = data.message;
    } catch (err) {
      document.getElementById('responseMsg').textContent = 'Error sending message.';
    }
  });
}
