document.getElementById("addEventForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const date = document.getElementById("date").value;
  const location = document.getElementById("location").value.trim();
  const quota = parseInt(document.getElementById("quota").value);
  const imageInput = document.getElementById("image");
  const imageFile = imageInput.files[0]; // Bisa undefined

  if (!token) {
    alert("❌ Anda belum login sebagai admin.");
    return window.location.href = "/src/pages/services/login.html";
  }

  try {
    // Gunakan FormData agar support upload file
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("location", location);
    formData.append("quota", quota);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch("http://localhost:5000/event", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
        // *JANGAN SET Content-Type manual!*
        // fetch akan otomatis set multipart boundary jika pakai FormData
      },
      body: formData
    });

    const result = await res.json();

    if (res.ok) {
      alert("✅ Event berhasil ditambahkan!");
      window.location.href = "dashboard-admin.html";
    } else {
      alert("❌ Gagal menambahkan event: " + (result.message || "Terjadi kesalahan."));
    }
  } catch (err) {
    console.error("Error saat menambahkan event:", err);
    alert("❌ Gagal koneksi ke server.");
  }
});
