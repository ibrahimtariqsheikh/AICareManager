import express from "express";
import { createUser, getUser, getUsers } from "../controllers/userControllers";

const router = express.Router();

router.get("/", getUsers);
router.get("/:cognitoId", getUser);
router.post("/", createUser);

export default router;
