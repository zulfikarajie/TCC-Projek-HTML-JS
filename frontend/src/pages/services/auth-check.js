(async function authCheck() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("🚫 Anda belum login. Silakan login terlebih dahulu.");
    return window.location.href = "login.html";
  }

  // Cek validitas token ke backend (opsional tapi direkomendasikan)
  try {
    const res = await fetch("http://localhost:5000/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Token tidak valid atau expired.");
    }

    // Token valid, lanjut akses halaman
    console.log("✅ Token valid, akses diizinkan.");
  } catch (err) {
    console.warn("Token invalid:", err);
    alert("⚠️ Sesi Anda sudah berakhir. Silakan login kembali.");
    localStorage.clear();
    window.location.href = "login.html";
  }
})();
