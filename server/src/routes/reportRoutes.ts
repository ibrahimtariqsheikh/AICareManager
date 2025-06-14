import express, { Request, Response, Router } from 'express';
import { getAgencyReports, getReportById, createReport, updateReport, deleteReport, getCareworkerReports, resolveReportAlert } from '../controllers/reportController';

const router: Router = express.Router();

// Get all reports for an agency
router.get('/agency/:agencyId', getAgencyReports);

router.get('/:id', getReportById);

router.post('/create/:userId/:agencyId/:scheduleId', createReport);

router.put('/:id', updateReport);

router.delete('/:id', deleteReport);

router.get('/user/:userId', getCareworkerReports);

//update report resolve
router.put('/resolve/:alertId', resolveReportAlert);




export default router;