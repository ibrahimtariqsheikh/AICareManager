import express from 'express';
import {
  createMedicationRecord,
  getClientMedications,
  updateMedicationRecord,
  deleteMedicationRecord,
  recordAdministration,
  getAdministrationHistory
} from '../controllers/medicationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Medication record routes
router.post('/records', authMiddleware(['ADMIN', 'CARE_WORKER']), createMedicationRecord);
router.get('/client/:clientId', authMiddleware(['ADMIN', 'CARE_WORKER']), getClientMedications);
router.put('/records/:id', authMiddleware(['ADMIN', 'CARE_WORKER']), updateMedicationRecord);
router.delete('/records/:id', authMiddleware(['ADMIN']), deleteMedicationRecord);

// Medication administration routes
router.post('/administration', authMiddleware(['CARE_WORKER']), recordAdministration);
router.get('/administration/:medicationRecordId', authMiddleware(['ADMIN', 'CARE_WORKER']), getAdministrationHistory);

export default router; 