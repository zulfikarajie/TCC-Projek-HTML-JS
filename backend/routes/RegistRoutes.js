import express from "express";
import Registration from "../models/RegistModel.js";
import User from "../models/UserModel.js";
import Event from "../models/EventModel.js";

const router = express.Router();

// GET all registrations (include user & event info)
router.get("/regist", async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      include: [User, Event]
    });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single registration by ID
router.get("/regist/:id", async (req, res) => {
  try {
    const registration = await Registration.findByPk(req.params.id, {
      include: [User, Event]
    });
    if (!registration) return res.status(404).json({ message: "Not found" });
    res.json(registration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new registration
router.post("/regist", async (req, res) => {
  try {
    const { user_id, event_id, status } = req.body;
    const newReg = await Registration.create({ user_id, event_id, status });
    res.status(201).json(newReg);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a registration
router.put("/regist/:id", async (req, res) => {
  try {
    const registration = await Registration.findByPk(req.params.id);
    if (!registration) return res.status(404).json({ message: "Not found" });

    await registration.update(req.body);
    res.json(registration);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE registration
router.delete("/regist/:id", async (req, res) => {
  try {
    const registration = await Registration.findByPk(req.params.id);
    if (!registration) return res.status(404).json({ message: "Not found" });

    await registration.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
