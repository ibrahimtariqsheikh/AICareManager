import express from "express"
import {
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedulesByClient,
  getSchedulesByUser,
  getSchedulesByDateRange,
} from "../controllers/scheduleController"

const router = express.Router()


router.get("/", getSchedules)
router.get("/:id", getSchedule)
router.post("/", createSchedule)
router.put("/:id", updateSchedule)
router.delete("/:id", deleteSchedule)


router.get("/client/:clientId", getSchedulesByClient)
router.get("/user/:userId", getSchedulesByUser)
router.get("/date-range", getSchedulesByDateRange) 

export default router

