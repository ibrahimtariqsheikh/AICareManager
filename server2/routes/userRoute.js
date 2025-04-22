import express from "express";
import { addUser, getUsers, getUserById, updateUser, deleteUser } from "../controllers/userController.js";
const router = express.Router();


router.post("/users", addUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;