import { Router } from "express"
import { createUser, getUsers, getUser, getFilteredUsers, getAgencyUsers, getUserById, updateUser, getUserAllDetails, addEmergencyContact, editEmergencyContact, deleteEmergencyContact, addVisitType, addVisitTypeTask, deleteUser } from "../controllers/userControllers"

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

// Get all details of a user by ID
router.get("/all/:id", getUserAllDetails)

// Update a user
router.put("/:id", updateUser)

// Get a specific user by cognitoId
router.get("/:cognitoId", getUser)

// Add emergency contact
router.post("/:userId/emergency-contacts", addEmergencyContact)

// Edit emergency contact
router.put("/:userId/emergency-contacts/:contactId", editEmergencyContact)

// Delete emergency contact
router.delete("/:userId/emergency-contacts/:contactId", deleteEmergencyContact)

// Add visit type
router.post("/:userId/visit-types", addVisitType)

// Add visit type task
router.post("/:userId/visit-types/:visitTypeId/tasks", addVisitTypeTask)

// Delete user
router.delete("/:id", deleteUser)





export default router

