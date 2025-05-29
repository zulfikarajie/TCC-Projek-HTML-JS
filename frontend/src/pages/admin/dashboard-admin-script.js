(async function loadAdminDashboard() {
  const token = localStorage.getItem("token");
  const container = document.getElementById("admin-event-list");

  try {
    const res = await fetch("http://localhost:5000/event", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const events = await res.json();

    if (!Array.isArray(events) || events.length === 0) {
      container.innerHTML = `<p class="text-muted">Belum ada event.</p>`;
      return;
    }

    container.innerHTML = "";
    events.forEach(event => {
      const card = `
        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <img src="https://via.placeholder.com/600x400?text=${encodeURIComponent(event.title)}" class="card-img-top" alt="${event.title}" />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${event.title}</h5>
              <p class="card-text">${event.description}</p>
              <p><small class="text-muted">${event.date} @ ${event.location}</small></p>
              <div class="mt-auto">
                <a href="edit-event-detail.html?id=${event.id}" class="btn btn-warning btn-sm">Edit</a>
                <button class="btn btn-danger btn-sm" onclick="deleteEvent(${event.id})">Hapus</button>
                <button class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#registrantsModal" onclick="loadRegistrants(${event.id})">Lihat Pendaftar</button>
              </div>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", card);
    });
  } catch (err) {
    console.error("Gagal memuat event admin:", err);
    container.innerHTML = `<p class="text-danger">Gagal memuat data.</p>`;
  }
})();

async function deleteEvent(id) {
  if (!confirm("Yakin ingin menghapus event ini?")) return;
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`http://localhost:5000/event/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const result = await res.json();
    alert(result.message || "Event dihapus.");
    window.location.reload();
  } catch (err) {
    alert("Gagal menghapus event.");
    console.error(err);
  }
}

async function loadRegistrants(eventId) {
  const token = localStorage.getItem("token");
  const registrantsList = document.getElementById("registrantsList");
  registrantsList.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`http://localhost:5000/registrants/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const users = await res.json();

    if (!Array.isArray(users) || users.length === 0) {
      registrantsList.innerHTML = "<p>Belum ada pendaftar untuk event ini.</p>";
      return;
    }

    registrantsList.innerHTML = users.map(user => `
      <div class="mb-3 border-bottom pb-2">
        <strong>Nama:</strong> ${user.name} <br>
        <strong>Email:</strong> ${user.email} <br>
        <strong>Tanggal Daftar:</strong> ${new Date(user.registered_at).toLocaleDateString("id-ID")}
      </div>
    `).join("");
  } catch (err) {
    registrantsList.innerHTML = "<p class='text-danger'>Gagal memuat pendaftar.</p>";
    console.error(err);
  }
}
