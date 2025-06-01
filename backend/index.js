import express from "express";
import cors from "cors";
import "dotenv/config";
import EventRoute from "./routes/EventRoutes.js"
import UserRoute from "./routes/UserRoutes.js"
import RegistRoute from "./routes/RegistRoutes.js"
import AdminRoute from "./routes/AdminRoutes.js"
import cookieParser from "cookie-parser";

const app = express();
const corsOptions = {
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500" // Tambahkan localhost untuk pengembangan lokal
    // url deploy frontend
  ],
  credentials: true, // Memungkinkan penggunaan cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions)); // Menggunakan opsi CORS
// Menambahkan penanganan preflight request (OPTIONS)
app.options("*", cors(corsOptions)); // Menanggapi preflight requests

app.use(express.json());
app.use(cookieParser())
app.use(EventRoute);
app.use(UserRoute);
app.use(RegistRoute);
app.use(AdminRoute);
app.listen(5000, ()=>console.log("server is running"));