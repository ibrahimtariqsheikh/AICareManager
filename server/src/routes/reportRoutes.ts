import express, { Request, Response, Router } from 'express';
import { getAgencyReports } from '../controllers/reportController';

const router: Router = express.Router();

// Get all reports for an agency
router.get('/agency/:agencyId', getAgencyReports);

export default router;