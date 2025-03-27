import express from "express"
import * as userController from "../controllers/userControllers"

const router = express.Router()

// User routes
router.get("/", userController.getUsers)
router.post("/", userController.createUser)
router.get("/:cognitoId", userController.getUser)

// Client routes (handled by user controller)
router.get("/clients", userController.getClients)

// Filtered users for scheduling
router.get("/filtered/:inviterId", userController.getFilteredUsers)


export default router

