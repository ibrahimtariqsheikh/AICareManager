import express from "express"
import {
  getSchedules,
 
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getAgencySchedules,
  getCareWorkerSchedules,
  
} from "../controllers/scheduleController"

const router = express.Router()


router.get("/", getSchedules)
router.post("/", createSchedule)
router.put("/:id", updateSchedule)
router.delete("/:id", deleteSchedule)
router.get("/agency/:agencyId", getAgencySchedules)
router.get("/careworker/:userId", getCareWorkerSchedules)
export default router

