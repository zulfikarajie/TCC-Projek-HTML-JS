const token = localStorage.getItem("token");
const API_BASE = "http://localhost:5000";

const modal = new bootstrap.Modal(document.getElementById("formModal"));

function showAdminForm(id = "", name = "", email = "") {
  prepareForm({
    type: "admin",
    title: id ? "Edit Admin" : "Tambah Admin",
    id,
    name,
    email
  });
}

function showUserForm(id = "", name = "", email = "") {
  prepareForm({
    type: "user",
    title: id ? "Edit User" : "Tambah User",
    id,
    name,
    email
  });
}

function prepareForm({ type, title, id, name, email }) {
  document.getElementById("formType").value = type;
  document.getElementById("editId").value = id || "";
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("name").value = name || "";
  document.getElementById("email").value = email || "";
  document.getElementById("pass").value = "";
  modal.show();
}

document.getElementById("accountForm").addEventListener("submit", async e => {
  e.preventDefault();
  const type = document.getElementById("formType").value;
  const id = document.getElementById("editId").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const pass = document.getElementById("pass").value;

  const url = `${API_BASE}/${type}${id ? `/${id}` : ""}`;
  const method = id ? "PATCH" : "POST";

  const body = pass.trim() !== ""
    ? { name, email, pass }
    : { name, email };

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errorRes = await res.json();
      alert(`❌ Gagal menyimpan: ${errorRes.message}`);
    } else {
      modal.hide();
      loadAll();
    }
  } catch (err) {
    alert("❌ Terjadi kesalahan saat menyimpan data.");
    console.error(err);
  }
});

async function loadAll() {
  try {
    const [adminsRes, usersRes] = await Promise.all([
      fetch(`${API_BASE}/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(`${API_BASE}/user`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    const adminJson = await adminsRes.json();
    const userJson = await usersRes.json();

    const admins = Array.isArray(adminJson) ? adminJson : adminJson.data;
    const users = Array.isArray(userJson) ? userJson : userJson.data;

    const adminTbody = document.getElementById("adminTableBody");
    const userTbody = document.getElementById("userTableBody");

    adminTbody.innerHTML = admins.map(a => `
      <tr>
        <td>${a.name}</td>
        <td>${a.email}</td>
        <td class="align-middle">
          <div class="d-flex justify-content-between">
            <button class="btn btn-warning btn-sm w-50 me-2" onclick="showAdminForm('${a.id}', '${a.name}', '${a.email}')">Edit</button>
            <button class="btn btn-danger btn-sm w-50" onclick="deleteAccount('admin', ${a.id})">Delete</button>
          </div>
        </td>
      </tr>
    `).join("");

    userTbody.innerHTML = users.map(u => `
      <tr>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td class="align-middle">
          <div class="d-flex">
            <button class="btn btn-warning btn-sm w-50 me-2" onclick="showUserForm('${u.id}', '${u.name}', '${u.email}')">Edit</button>
            <button class="btn btn-danger btn-sm w-50" onclick="deleteAccount('user', ${u.id})">Delete</button>
          </div>
        </td>
      </tr>
    `).join("");
  } catch (error) {
    console.error("❌ Gagal memuat data akun:", error);
  }
}

async function deleteAccount(type, id) {
  if (!confirm("Yakin ingin menghapus?")) return;
  try {
    await fetch(`${API_BASE}/${type}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    loadAll();
  } catch (error) {
    alert("❌ Gagal menghapus akun.");
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", loadAll);
