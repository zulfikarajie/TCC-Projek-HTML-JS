import User from "../models/UserModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

async function getUsers(req,res) {
    try {
    const user = await User.findAll()
    return res.status(200).json({
        status:"Success",
        message: "user retrieved",
        data: user 
    })   
    } catch (error) {
        return res.status(error.statusCode).json({
            status: "error",
            message : error.message
        })
        
    }
}

async function getUsersById(req,res) {
    try {
        const user = await User.findOne({where:{
            id: req.params.id
        }})
      
    if(!user){
      const error = new Error("User tidak ditemukan 😮");
      error.statusCode = 400;
      throw error;
    }    
    return res.status(200).json({
        status:"Success",
        message: "user retrieved",
        data: user 
    })
    } catch (error) {
        return res.status(error.statusCode).json({
        status: "error",
        message : error.message
        })   
    }   
}

async function createUser(req,res) {
    try {
    // Mengambil name, email, gender, password dari request body
    const { name, email, pass} = req.body;

    if (Object.keys(req.body).length < 3) {
      const error = new Error("Field cannot be empty 😠");
      error.statusCode = 400;
      throw error;
    }

    // Mengenkripsi password, membuat hash sebanyak 2^5 (32) iterasi
    const encryptPassword = await bcrypt.hash(pass, 5);
    const newUser = await User.create({
      name,
      email,
      pass: encryptPassword,
    });

    // Kalo berhasil ngirim respons sukses (201)
    return res.status(201).json({
      status: "Success",
      message: "User Registered",
      data: newUser, // <- Data user baru yg ditambahkan
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }    
}

async function updateUser(req,res) {
    try {
        let {pass} = req.body
        if(pass){
            const encryptPassword = await bcrypt.hash(pass,5)
            pass = encryptPassword
        }

        if (Object.keys(req.body).length < 3) {
        const error = new Error("Field cannot be empty 😠");
      error.statusCode = 400;
      throw error;
    }
    const ifUserExist = await User.findOne({where:{id:req.params.id}})
    if(!ifUserExist){
        const error = new Error("user tidak ditemukan")
        error.statusCode = 400
        throw error
    }
    const result = await User.update(
        {...req.body, pass},
        {where:{id:req.params.id}}
    )

    return res.status(200).json({
        status : "success",
        message: "user updated"
    })

    } catch (error) {
      return res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message
      })
    }
}

async function deleteUser(req, res) {
  try {
    //pengecekan akun user apakah tersedia
    const ifUserExist = await User.findOne({ where: { id: req.params.id } });

    // Kalo gada, masuk ke catch dengan message "User tidak ditemukan 😮" (400)
    if (!ifUserExist) {
      const error = new Error("User tidak ditemukan 😮");
      error.statusCode = 400;
      throw error;
    }
    //hapus akun
    const result = await User.destroy({ where: { id: req.params.id } });
    if (result == 0) {
      const error = new Error("Tidak ada data yang berubah");
      error.statusCode = 400;
      throw error;
    }

    // Kalo berhasil, kirim respons sukses (200)
    return res.status(200).json({
      status: "Success",
      message: "User Deleted",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

// Fungsi LOGIN
async function login(req, res) {
  try {
    const { email, pass } = req.body;

    // Cek apakah email terdaftar di db
    const user = await User.findOne({
      where: { email: email },
    });

    // Kalo email ada (terdaftar)
    if (user) {
      // Konversi data user dari JSON ke dalam bentuk object
      const userPlain = user.toJSON(); // Konversi ke object

      // Disini kita mau mengcopy isi dari variabel userPlain ke variabel baru namanya safeUserData
      // Tapi di sini kita gamau copy semuanya, kita gamau copy password sama refresh_token karena itu sensitif
      const { pass: _, refresh_token: __, id, ...rest } = userPlain;
      const safeUserData = { id, ...rest }; // pastikan ID ikut
      // Ngecek apakah password sama kaya yg ada di DB
      const isPasswordValid = await bcrypt.compare(pass, user.pass);

      // Kalau password benar, artinya berhasil login
      if (isPasswordValid) {
        // Membuat access token dengan masa berlaku 30 detik
        const accessToken = jwt.sign(
          safeUserData, // <- Payload yang akan disimpan di token
          process.env.ACCESS_TOKEN_SECRET, // <- Secret key untuk verifikasi
          { expiresIn: "15m" } // <- Masa berlaku token
        );

        // Membuat refresh token dengan masa berlaku 1 hari
        const refreshToken = jwt.sign(
          safeUserData,
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        // Update refresh token di database untuk user yang login
        await User.update(
          { refresh_token: refreshToken },
          {
            where: { id: user.id },
          }
        );

        // Masukkin refresh token ke cookie
        res.cookie("refreshToken", refreshToken, {
          // httpOnly:
          // - `true`: Cookie tidak bisa diakses via JavaScript (document.cookie)
          // - Mencegah serangan XSS (Cross-Site Scripting)
          // - Untuk development bisa `false` agar bisa diakses via console
          httpOnly: false, // <- Untuk keperluan PRODUCTION wajib true

          // sameSite:
          // - "strict": Cookie, hanya dikirim untuk request SAME SITE (domain yang sama)
          // - "lax": Cookie dikirim untuk navigasi GET antar domain (default)
          // - "none": Cookie dikirim untuk CROSS-SITE requests (butuh secure:true)
          sameSite: "none", // <- Untuk API yang diakses dari domain berbeda

          // maxAge:
          // - Masa aktif cookie dalam milidetik (1 hari = 24x60x60x1000)
          // - Setelah waktu ini, cookie akan otomatis dihapus browser
          maxAge: 24 * 60 * 60 * 1000,

          // secure:
          // - `true`: Cookie hanya dikirim via HTTPS
          // - Mencegah MITM (Man-in-the-Middle) attack
          // - WAJIB `true` jika sameSite: "none"
          secure: true,
        });

        // Kirim respons berhasil (200)
        return res.status(200).json({
          status: "Success",
          message: "Login Berhasil",
          data: safeUserData, // <- Data user tanpa informasi sensitif
          accessToken,
        });
      } else {
        // Kalau password salah, masuk ke catch, kasi message "Password atau email salah" (400)
        const error = new Error("Password atau email salah");
        error.statusCode = 400;
        throw error;
      }
    } else {
      // Kalau email salah, masuk ke catch, kasi message "Password atau email salah" (400)
      const error = new Error("Paassword atau email salah");
      error.statusCode = 400;
      throw error;
    }
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

// Fungsi LOGOUT
async function logout(req, res) {
  try {
    // ngambil refresh token di cookie
    const refreshToken = req.cookies.refreshToken;

    // Ngecek ada ga refresh tokennya, kalo ga ada kirim status code 401
    if (!refreshToken) {
      const error = new Error("Refresh token tidak ada");
      error.statusCode = 401;
      throw error;
    }

    // Kalau ada, cari user berdasarkan refresh token tadi
    const user = await User.findOne({
      where: { refresh_token: refreshToken },
    });

    // Kalau user gaada, kirim status code 401
    if (!user.refresh_token) {
      const error = new Error("User tidak ditemukan");
      error.statusCode = 401;
      throw error;
    }

    // Kalau user ketemu (ada), ambil user id
    const userId = user.id;

    // Hapus refresh token dari DB berdasarkan user id tadi
    await User.update(
      { refresh_token: null },
      {
        where: { id: userId },
      }
    );

    // Ngehapus refresh token yg tersimpan di cookie
    res.clearCookie("refreshToken");

    // Kirim respons berhasil (200)
    return res.status(200).json({
      status: "Success",
      message: "Logout Berhasil",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

export {
  getUsers,
  getUsersById,
  createUser,
  updateUser,
  deleteUser,
  login,
  logout,
};