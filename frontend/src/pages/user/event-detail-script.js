(async function loadEventDetail() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");
  const container = document.getElementById("event-container");
  const token = localStorage.getItem("token");

  if (!eventId) {
    container.innerHTML = `<p class="text-danger">ID event tidak valid.</p>`;
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/event/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Event tidak ditemukan");

    const event = await res.json();

    const eventDate = new Date(event.date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    container.innerHTML = `
      <div class="card shadow-sm">
        <img src="https://via.placeholder.com/600x400?text=${encodeURIComponent(event.title)}" class="card-img-top" alt="${event.title}" />
        <div class="card-body">
          <h3 class="card-title">${event.title}</h3>
          <p>${event.description.replace(/\n/g, "<br>")}</p>
          <p><small class="text-muted">${eventDate} @ ${event.location}</small></p>
          <p><small class="text-muted">Kuota peserta: ${event.quota} orang</small></p>
          <a href="daftar-event.html?id=${event.id}" class="btn btn-primary">Daftar Event</a>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="card-body"><p class="text-danger">Event tidak ditemukan.</p></div>`;
  }
})();
