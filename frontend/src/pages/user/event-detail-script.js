(async function loadEventDetail() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");
  const container = document.getElementById("event-container");
  const token = localStorage.getItem("token");

  if (!eventId) {
    container.innerHTML = `
      <div class="alert alert-warning text-center mt-4">
        ID event tidak valid.
      </div>`;
    return;
  }

  try {
    // ✅ 1. Ambil data detail event (GET)
    const res = await fetch(`http://localhost:5000/event/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType?.includes("application/json")) {
      const fallback = await res.text();
      throw new Error(`Respon tidak valid: ${res.status} - ${fallback.slice(0, 100)}`);
    }

    const event = await res.json();

    const eventDate = new Date(event.date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    // ✅ 2. Render tampilan
    container.innerHTML = `
      <div class="card shadow-sm p-4 mx-auto" style="max-width: 700px; background-color: #ffffff; border-radius: 12px;">
        <h3 class="card-title mb-3 text-primary">${event.title}</h3>
        <img src="${event.img_url ? event.img_url : 'https://placehold.co/600x400?text=' + encodeURIComponent(event.title)}" class="card-img-top" alt="${event.title}" />

        <p><strong>Deskripsi:</strong><br>${event.description?.replace(/\n/g, "<br>") || "-"}</p>
        <p><strong>Tanggal:</strong> ${eventDate}</p>
        <p><strong>Lokasi:</strong> ${event.location || "-"}</p>
        <p><strong>Kuota Peserta:</strong> ${event.quota || 0} orang</p>

        <button class="btn btn-primary mt-3" id="btn-daftar">Daftar Sekarang</button>
        <div id="response-message" class="mt-3"></div>
      </div>
    `;

    // ✅ 3. Tangani klik tombol daftar
    document.getElementById("btn-daftar").addEventListener("click", async () => {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams(window.location.search);
      const eventId = params.get("id");
      const responseContainer = document.getElementById("response-message");

      try {
        const res = await fetch(`http://localhost:5000/register/${eventId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType?.includes("application/json")) {
          const fallback = await res.text();
          throw new Error(`Gagal daftar: ${res.status} - ${fallback.slice(0, 100)}`);
        }

        const result = await res.json();
        responseContainer.innerHTML = `
          <div class="alert alert-success">✅ ${result.message || "Berhasil daftar!"}</div>
        `;

        // 🔁 Redirect setelah beberapa detik
        setTimeout(() => {
          window.location.href = "dashboard-user.html";
        }, 2000);

      } catch (err) {
        console.error("❌ Gagal daftar:", err.message);
        responseContainer.innerHTML = `
          <div class="alert alert-danger">❌ ${err.message}</div>
        `;
      }
    });

  } catch (err) {
    console.error("[❌ loadEventDetail] Gagal:", err.message);
    container.innerHTML = `
      <div class="alert alert-danger text-center mt-4">
        Event tidak ditemukan atau terjadi kesalahan.
      </div>`;
  }
})();
