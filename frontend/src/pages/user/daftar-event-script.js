(async function handleRegistrationPage() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");
  const token = localStorage.getItem("token");

  const info = document.getElementById("event-info");
  const button = document.getElementById("btn-daftar");
  const message = document.getElementById("response-message");

  if (!eventId) {
    info.textContent = "ID event tidak valid.";
    button.disabled = true;
    return;
  }

  // Ambil info event
  try {
    const res = await fetch(`http://localhost:5000/event/${eventId}`);
    if (!res.ok) throw new Error("Event tidak ditemukan.");
    const event = await res.json();
    info.innerHTML = `<strong>${event.title}</strong><br>${event.date} @ ${event.location}`;
  } catch (err) {
    console.error(err);
    info.textContent = "Gagal memuat data event.";
    button.disabled = true;
    return;
  }

  // Daftar event saat klik
  button.addEventListener("click", async () => {
    try {
      const res = await fetch(`http://localhost:5000/register/${eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const result = await res.json();
      if (res.ok) {
        message.innerHTML = `<div class="alert alert-success">✅ ${result.message || "Berhasil mendaftar!"}</div>`;
        button.disabled = true;
      } else {
        message.innerHTML = `<div class="alert alert-danger">❌ ${result.message || "Gagal mendaftar."}</div>`;
      }
    } catch (err) {
      message.innerHTML = `<div class="alert alert-danger">❌ Error saat mendaftar.</div>`;
      console.error(err);
    }
  });
})();
