import express from "express";
import { verifyToken }from "../middleware/VerifyToken.js";
import multer from "multer";
import storage from "../utils/storage.js";
const upload = multer({ storage: storage });
import {createEvent,getEvents,deleteEvent,updateEvent,getEventById} from "../controller/EventController.js"

const router = express.Router()

router.get("/event", getEvents);
router.get("/event/:id", getEventById);
router.post("/event", verifyToken, upload.single("image"), createEvent);          // ✅ admin only
router.patch("/event/:id", verifyToken, upload.single("image"), updateEvent);     // ✅ admin only
router.delete("/event/:id", verifyToken, deleteEvent);    // ✅ admin only

export default router

