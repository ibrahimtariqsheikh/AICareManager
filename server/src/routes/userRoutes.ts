import { Router } from "express"
import { createUser, getUsers, getUser, getFilteredUsers, getAgencyUsers, getUserById, updateUser } from "../controllers/userControllers"

const router = Router()

// Create a new user
router.post("/", createUser)

// Get all users
router.get("/", getUsers)

// Get users by agency
router.get("/agency/:agencyId", getAgencyUsers)

// Get filtered users for scheduling
router.get("/filtered/:inviterId", getFilteredUsers)

// Get a specific user by ID
router.get("/id/:id", getUserById)

// Update a user
router.put("/:id", updateUser)

// Get a specific user by cognitoId
router.get("/:cognitoId", getUser)

export default router

