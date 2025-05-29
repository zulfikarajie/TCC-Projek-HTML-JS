(async function handleEditPage() {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");

  if (!eventId) {
    document.getElementById("event-title").textContent = "Event tidak ditemukan.";
    return;
  }

  const titleEl = document.getElementById("title");
  const descEl = document.getElementById("description");
  const dateEl = document.getElementById("date");
  const locEl = document.getElementById("location");
  const imgEl = document.getElementById("image");
  const errorMsg = document.getElementById("error-msg");

  try {
    const res = await fetch(`http://localhost:5000/event/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Gagal memuat event");
    const data = await res.json();

    document.getElementById("event-title").textContent = `Edit Event ${data.title}`;
    titleEl.value = data.title;
    descEl.value = data.description;
    dateEl.value = data.date;
    locEl.value = data.location;
    imgEl.value = data.image || "";
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("d-none");
  }

  document.getElementById("editForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/event/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: titleEl.value,
          description: descEl.value,
          date: dateEl.value,
          location: locEl.value,
          image: imgEl.value
        })
      });

      const result = await res.json();
      if (res.ok) {
        alert("✅ Event berhasil diperbarui!");
        window.location.href = "dashboard-admin.html";
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      errorMsg.textContent = err.message;
      errorMsg.classList.remove("d-none");
    }
  });

  document.getElementById("btn-delete").addEventListener("click", async () => {
    if (!confirm("Yakin ingin menghapus event ini?")) return;

    try {
      const res = await fetch(`http://localhost:5000/event/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await res.json();
      if (res.ok) {
        alert("Event dihapus.");
        window.location.href = "dashboard-admin.html";
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      errorMsg.textContent = "Gagal menghapus event.";
      errorMsg.classList.remove("d-none");
    }
  });
})();
