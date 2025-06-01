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
  const imgEl = document.getElementById("image"); // input type="file"
  const imgPreview = document.getElementById("img-preview"); // <img id="img-preview">
  const errorMsg = document.getElementById("error-msg");

  let oldImgUrl = "";

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

    // Tampilkan gambar lama sebagai preview (jika ada)
    oldImgUrl = data.img_url || "";
    if (oldImgUrl && imgPreview) {
      imgPreview.src = oldImgUrl;
      imgPreview.classList.remove("d-none");
    } else if (imgPreview) {
      imgPreview.classList.add("d-none");
    }
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("d-none");
  }

  // PATCH pakai FormData!
  document.getElementById("editForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", titleEl.value);
      formData.append("description", descEl.value);
      formData.append("date", dateEl.value);
      formData.append("location", locEl.value);

      // Jika file baru diupload, pakai file baru
      if (imgEl.files[0]) {
        formData.append("image", imgEl.files[0]);
      }

      const res = await fetch(`http://localhost:5000/event/${eventId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
          // Tidak perlu set Content-Type, FormData akan otomatis
        },
        body: formData
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

  // Optional: Preview gambar baru saat dipilih
  if (imgEl && imgPreview) {
    imgEl.addEventListener("change", function () {
      if (imgEl.files[0]) {
        imgPreview.src = URL.createObjectURL(imgEl.files[0]);
        imgPreview.classList.remove("d-none");
      } else if (oldImgUrl) {
        imgPreview.src = oldImgUrl;
      } else {
        imgPreview.classList.add("d-none");
      }
    });
  }
})();
