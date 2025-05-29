(async function loadEvents() {
  const token = localStorage.getItem("token");
  const container = document.getElementById("event-list");

  try {
    const res = await fetch("http://localhost:5000/event", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Gagal fetch data event");

    const events = await res.json();
    if (!Array.isArray(events) || events.length === 0) {
      container.innerHTML = `<div class="col-12 text-center"><p>Tidak ada event yang tersedia saat ini.</p></div>`;
      return;
    }

    events.forEach(event => {
      const eventDate = new Date(event.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });

      const card = `
        <div class="col-md-4">
          <div class="card h-100 shadow-sm" style="cursor:pointer;" onclick="location.href='event-detail.html?id=${event.id}'">
            <img src="https://via.placeholder.com/600x400?text=${encodeURIComponent(event.title)}" class="card-img-top" alt="${event.title}">
            <div class="card-body">
              <h5 class="card-title">${event.title}</h5>
              <p class="card-text">${event.description.substring(0, 100)}...</p>
              <p><small class="text-muted">${eventDate} @ ${event.location}</small></p>
              <p><small class="text-muted">Kuota: ${event.quota} orang</small></p>
              <a href="daftar-event.html?id=${event.id}" class="btn btn-primary">Daftar</a>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", card);
    });
  } catch (err) {
    console.error("Error:", err);
    container.innerHTML = `<div class="col-12 text-center"><p>Gagal memuat event.</p></div>`;
  }
})();
