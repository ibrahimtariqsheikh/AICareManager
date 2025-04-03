import express from "express";
import { getDashboardData } from "../controllers/dashboardController";

const router = express.Router();

router.get("/:userId", getDashboardData);

export default router; 