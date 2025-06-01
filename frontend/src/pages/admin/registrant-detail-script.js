const API = "http://localhost:5000/regist";
const token = localStorage.getItem("token"); // Ambil token login
const tbody = document.getElementById("registrantsTableBody");
const form = document.getElementById("registrantForm");
const params = new URLSearchParams(window.location.search);
const selectedEventId = params.get("event_id");

async function loadRegistrants() {
  try {
    console.log("Token:", token);

    const res = await fetch(`http://localhost:5000/registrants/${selectedEventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    tbody.innerHTML = "";
    console.log("DATA DARI BACKEND:", data);

    data.forEach(r => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${r.user?.name || r.user_id}</td>
        <td>${r.user?.email || "-"}</td>
        <td>${r.event?.title || r.event_id}</td>
        <td>${r.status}</td>
        <td>
          <button class="btn btn-sm btn-warning btn-edit" data-user="${r.user_id}" data-event="${r.event_id}">Edit</button>
          <button class="btn btn-sm btn-danger btn-delete" data-user="${r.user_id}" data-event="${r.event_id}">Hapus</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    // Event listener Edit
    document.querySelectorAll(".btn-edit").forEach(btn => {
      btn.addEventListener("click", () => {
        const userId = btn.dataset.user;
        const eventId = btn.dataset.event;
        if (!userId || !eventId) return alert("ID tidak ditemukan.");
        editRegistrant(userId, eventId);
      });
    });

    // Event listener Hapus
    document.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", () => {
        const userId = btn.dataset.user;
        const eventId = btn.dataset.event;
        if (!userId || !eventId) return alert("ID tidak ditemukan.");
        deleteRegistrant(userId, eventId);
      });
    });

  } catch (err) {
    console.error("❌ Gagal memuat data pendaftar:", err.message);
    tbody.innerHTML = `<tr><td colspan="5" class="text-danger">${err.message}</td></tr>`;
  }
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  const id = document.getElementById("registId").value;
  const [user_id, event_id] = id.split("|");
  const status = document.getElementById("status").value;

  if (!user_id || !event_id) {
    alert("Gagal mengupdate, ID tidak lengkap.");
    return;
  }

  const url = `${API}/${user_id}/${event_id}`;
  console.log("🔄 Kirim update:", { user_id, event_id, status });

  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status }) // hanya update status
  });

  bootstrap.Modal.getInstance(document.getElementById("registrantModal")).hide();
  loadRegistrants();
});

function showAddModal() {
  document.getElementById("registrantForm").reset();
  document.getElementById("registId").value = "";
  new bootstrap.Modal(document.getElementById("registrantModal")).show();
}

async function editRegistrant(userId, eventId) {
  console.log("Edit", userId, eventId);
  const res = await fetch(`${API}/${userId}/${eventId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const r = await res.json();

  document.getElementById("userId").value = r.user_id;
  document.getElementById("eventId").value = r.event_id;
  document.getElementById("status").value = r.status;
  document.getElementById("registId").value = `${r.user_id}|${r.event_id}`;
  new bootstrap.Modal(document.getElementById("registrantModal")).show();
}

async function deleteRegistrant(userId, eventId) {
  if (!confirm("Yakin ingin menghapus pendaftar ini?")) return;
  await fetch(`${API}/${userId}/${eventId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  loadRegistrants();
}

document.addEventListener("DOMContentLoaded", loadRegistrants);
