import Admin from "../models/AdminModel.js";
import jwt from "jsonwebtoken"

export const getAccessTokenAdmin = async(req,res) =>{
    try {
         const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            const error = new Error("Refresh token tidak ada");
            error.statusCode = 401;
            throw error;
        }

        const admin = await Admin.findOne({
            where:{ refresh_token: refreshToken}
        })

        if (!admin.refresh_token) {
            const error = new Error("Refresh token tidak ada");
            error.statusCode = 401;
            throw error;
            }

    else {
      jwt.verify(
        refreshToken, // <- refresh token yg mau diverifikasi
        process.env.REFRESH_TOKEN_SECRET, // <- Secret key dari refresh token
        (error, decoded) => {
          // Jika ada error (access token tidak valid/kadaluarsa), kirim respons error
          if (error) {
            return res.status(403).json({
              status: "Error",
              message: "Refresh token tidak valid",
            });
          }
          // Konversi data user ke bentuk object
          const adminPlain = admin.toJSON();

          // Hapus data sensitif sebelum membuat token baru, dalam hal ini password sama refresh token dihapus
          const { password: _, refresh_token: __, ...safeAdminData } = adminPlain;

          // Buat access token baru (expire selama 30 detik)
          const accessToken = jwt.sign(
            safeAdminData,
            process.env.ACCESS_TOKEN_SECRET, // ⬅️ INI YANG PENTING
            { expiresIn: "15m" }
          );


          // Kirim respons sukses + kasih access token yg udah dibikin tadi
          return res.status(200).json({
            status: "Success",
            message: "Berhasil mendapatkan access token.",
            accessToken, // <- Access token baru untuk client
          });
        }
      );
    }

    } catch (error) {
      return res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
    }
}