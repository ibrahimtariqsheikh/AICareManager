import express from "express"
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getAgencySchedules,
  getCareWorkerSchedules,
  createLeaveEvent,
  getAgencyLeaveEvents,
  getUserLeaveEvents,
  deleteLeaveEvent
} from "../controllers/scheduleController"

const router = express.Router()


// Schedule Routes
router.get("/", getSchedules)
router.post("/", createSchedule)
router.put("/:id", updateSchedule)
router.delete("/:id", deleteSchedule)
router.get("/agency/:agencyId", getAgencySchedules)
router.get("/careworker/:userId", getCareWorkerSchedules)

// Leave Event Routes
router.post("/leave", createLeaveEvent)
router.get("/leave/agency/:agencyId", getAgencyLeaveEvents)
router.get("/leave/user/:userId", getUserLeaveEvents)
router.delete("/leave/:id", deleteLeaveEvent)

export default router

