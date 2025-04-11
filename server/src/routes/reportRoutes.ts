import express, { Request, Response, Router } from 'express';
import { getAgencyReports, getReportById } from '../controllers/reportController';

const router: Router = express.Router();

// Get all reports for an agency
router.get('/agency/:agencyId', getAgencyReports);

router.get('/:id', getReportById);

export default router;