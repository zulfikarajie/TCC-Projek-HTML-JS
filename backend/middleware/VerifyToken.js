import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) return res.status(403).json({ message: "Forbidden" });

    // Tambahkan ini agar bisa digunakan baik user maupun admin
    console.log("✅ Decoded Token:", decoded);

    req.email = decoded.email;
    req.userId = decoded.id;
    req.role = decoded.role || "unknown"; // kalau mau pakai peran di masa depan

    next();
  });
};
