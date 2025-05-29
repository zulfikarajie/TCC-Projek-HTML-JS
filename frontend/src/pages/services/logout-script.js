(async function logout() {
  const role = localStorage.getItem("role");
  const endpoint = role === "admin"
    ? "http://localhost:5000/logoutadmin"
    : "http://localhost:5000/logoutuser";

  try {
    await fetch(endpoint, {
      method: "DELETE",
      credentials: "include" // agar refreshToken dari cookie ikut dikirim
    });
  } catch (err) {
    console.warn("Gagal logout:", err);
  }

  // Bersihkan localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("email");

  // Redirect ke login
  window.location.href = "../index.html";
})();
