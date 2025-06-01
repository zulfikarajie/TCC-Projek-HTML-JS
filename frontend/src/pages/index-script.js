const API_URL = "http://localhost:5000/event";  // backend event API

function isLoggedIn() {
  return !!localStorage.getItem("token"); // cek apakah token ada
}

function setAuthLinks() {
  const navLinks = document.getElementById("nav-links");
  const authButtons = document.getElementById("auth-buttons");

  if (isLoggedIn()) {
    // Jika login, tampilkan tombol Logout di navbar dan kosongkan tombol hero
    if (navLinks) {
      navLinks.innerHTML = `
        <li class="nav-item"><a class="nav-link" href="user/dashboard-user.html">Dashboard</a></li>
        <li class="nav-item"><a class="nav-link" href="services/logout.html">Logout</a></li>
      `;
    }
    if (authButtons) authButtons.innerHTML = "";
  } else {
    // Jika belum login, tampilkan Sign In & Sign Up di navbar dan hero
    if (navLinks) {
      navLinks.innerHTML = `
        <li class="nav-item"><a class="nav-link" href="services/login.html">Sign In</a></li>
        <li class="nav-item"><a class="nav-link" href="services/register.html">Sign Up</a></li>
      `;
    }
    if (authButtons) {
      authButtons.innerHTML = `
        <a href="services/login.html" class="btn btn-light">Sign In</a>
        <a href="services/register.html" class="btn btn-outline-light ms-2">Sign Up</a>
      `;
    }
  }
}

async function loadEvents() {
  try {
    const res = await fetch(`${API_URL}`);
    let events = await res.json();

    if (!Array.isArray(events)) events = [];
    events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // Batasi 3 event teratas (jika backend tidak support _limit)
    if (events.length > 3) {
      events = events.slice(0, 3);
    }

    const container = document.getElementById("events-container");
    container.innerHTML = "";

    events.forEach(event => {
      const eventDate = new Date(event.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const link = isLoggedIn() ? `user/event-detail.html?id=${event.id}` : "services/login.html";

      const card = `
        <div class="col-md-4">
          <a href="${link}" class="text-decoration-none text-dark">
            <div class="card h-100 shadow-sm hover-card">
              <img src="${event.img_url ? event.img_url : 'https://placehold.co/600x400?text=' + encodeURIComponent(event.title)}" class="card-img-top" alt="${event.title}" />
              <div class="card-body">
                <h5 class="card-title">${event.title}</h5>
                <p class="card-text">${event.description.substring(0, 100)}...</p>
                <p class="card-text"><small class="text-muted">${eventDate} @ ${event.location}</small></p>
              </div>
            </div>
          </a>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", card);
    });
  } catch (error) {
    console.error("Gagal memuat event:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setAuthLinks();
  loadEvents();
});
