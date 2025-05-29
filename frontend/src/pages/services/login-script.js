document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!email || !pass) {
    alert("Mohon isi email dan password!");
    return;
  }

  try {
    // Coba login sebagai USER
    const userRes = await fetch("http://localhost:5000/loginuser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pass })
    });

    const userData = await userRes.json();

    if (userRes.ok && userData.accessToken) {
      // Simpan token dan info user
      localStorage.setItem("token", userData.accessToken);
      localStorage.setItem("role", "user");
      localStorage.setItem("email", userData.data.email);
      localStorage.setItem("userId", userData.data.id);
      localStorage.setItem("name", userData.data.name);

      alert("Login sebagai user berhasil!");
      return window.location.href = "/src/pages/user/dashboard-user.html";
    }

    // Kalau gagal, coba login sebagai ADMIN
    const adminRes = await fetch("http://localhost:5000/loginadmin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pass })
    });

    const adminData = await adminRes.json();

    if (adminRes.ok && adminData.accessToken) {
      // Simpan token dan info admin
      localStorage.setItem("token", adminData.accessToken);
      localStorage.setItem("role", "admin");
      localStorage.setItem("email", adminData.data.email);
      localStorage.setItem("adminId", adminData.data.id);
      localStorage.setItem("name", adminData.data.name);

      alert("Login sebagai admin berhasil!");
      return window.location.href = "/src/pages/admin/dashboard-admin.html";
    }

    // Kalau dua-duanya gagal
    alert("❌ Email atau password salah.");
  } catch (err) {
    console.error("Login error:", err);
    alert("❌ Gagal login. Periksa koneksi server.");
  }
});
