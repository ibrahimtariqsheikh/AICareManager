import express from 'express';
import {
  createReport,
  getClientReports,
  getCaregiverReports,
  updateReport,
  updateTaskStatus,
  deleteReport
} from '../controllers/reportController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Report routes
router.post('/', authMiddleware(['CARE_WORKER']), createReport);
router.get('/client/:clientId', authMiddleware(['ADMIN', 'CARE_WORKER']), getClientReports);
router.get('/caregiver/:userId', authMiddleware(['ADMIN', 'CARE_WORKER']), getCaregiverReports);
router.put('/:id', authMiddleware(['CARE_WORKER']), updateReport);
router.delete('/:id', authMiddleware(['ADMIN']), deleteReport);

// Task routes
router.put('/task/:taskId', authMiddleware(['CARE_WORKER']), updateTaskStatus);

export default router; 