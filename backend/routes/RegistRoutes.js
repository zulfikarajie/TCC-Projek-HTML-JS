import express from "express";
import Registration from "../models/RegistModel.js";
import User from "../models/UserModel.js";
import Event from "../models/EventModel.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

// ✅ GET semua pendaftaran (akses admin saja)
router.get("/regist", verifyToken, async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      attributes: ["user_id", "event_id", "status", "registered_at"],
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Event, attributes: ["id", "title"] }
      ]
    });
    console.log("✅ Data yang dikirim:", registrations); // ⬅️ debug di sini
    res.json(registrations);
  } catch (err) {
    console.error("❌ Error backend /regist:", err); // ⬅️ tampilkan errornya
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET 1 pendaftaran by ID (akses admin)
router.get("/regist/:userId/:eventId", verifyToken, async (req, res) => {
  try {
    const registration = await Registration.findOne({
      where: {
        user_id: req.params.userId,
        event_id: req.params.eventId
      },
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Event, attributes: ["id", "title"] }
      ]
    });

    if (!registration) return res.status(404).json({ message: "Not found" });
    res.json(registration);
  } catch (err) {
    console.error("❌ Error GET /regist/:userId/:eventId", err);
    res.status(500).json({ message: err.message });
  }
});


// ✅ POST daftar event oleh user login
router.post("/register/:id", verifyToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.userId;

    const existing = await Registration.findOne({ where: { user_id: userId, event_id: eventId } });
    if (existing) return res.status(400).json({ message: "Sudah terdaftar di event ini." });

    const regist = await Registration.create({ user_id: userId, event_id: eventId });
    res.status(201).json({ message: "Pendaftaran berhasil!", data: regist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ PUT update status/pendaftaran (admin atau pemilik akun)
router.put("/regist/:userId/:eventId", verifyToken, async (req, res) => {
  const { userId, eventId } = req.params;
  const { status } = req.body;

  try {
    const registration = await Registration.findOne({
      where: { user_id: userId, event_id: eventId }
    });
    if (!registration) return res.status(404).json({ message: "Not found" });

    await registration.update({ status });
    res.json(registration);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/regist/:userId/:eventId", verifyToken, async (req, res) => {
  const { userId, eventId } = req.params;

  try {
    const registration = await Registration.findOne({
      where: { user_id: userId, event_id: eventId }
    });
    if (!registration) return res.status(404).json({ message: "Not found" });

    await registration.destroy();
    res.json({ message: "Pendaftaran dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET semua peserta berdasarkan event_id
router.get("/registrants/:eventId", verifyToken, async (req, res) => {
  try {
    const registrants = await Registration.findAll({
      where: { event_id: req.params.eventId },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"]
        },
        {
          model: Event,
          attributes: ["id", "title"] // ⬅️ tambahkan ini
        }
      ]
    });
    res.json(registrants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
