(async function authCheckAdmin() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("🚫 Anda belum login. Silakan login terlebih dahulu.");
    return window.location.href = "../services/login.html";
  }

  try {
    const res = await fetch("http://localhost:5000/admin", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Token admin tidak valid.");
    console.log("✅ Token admin valid.");
  } catch (err) {
    console.warn("Token admin invalid:", err);
    alert("⚠️ Sesi Anda sudah berakhir. Silakan login kembali.");
    localStorage.clear();
    window.location.href = "../services/login.html";
  }
})();
