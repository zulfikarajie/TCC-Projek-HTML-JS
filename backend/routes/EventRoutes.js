import express from "express";
import {createEvent,getEvents,deleteEvent,updateEvent,getEventById} from "../controller/EventController.js"

const router = express.Router()

router.get("/event",getEvents)
router.get("/event/:id",getEventById)
router.post("/event",createEvent)
router.patch("/event/:id",updateEvent)
router.delete("/event/:id",deleteEvent)

export default router

