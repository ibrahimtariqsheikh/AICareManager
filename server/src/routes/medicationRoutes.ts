import express from 'express';
import { createMedication, deleteMedication, getMedications, updateMedication, createMedicationLog, checkInMedication } from '../controllers/medicationController';

const router = express.Router();

router.post('/:userId', createMedication);
router.get('/:userId', getMedications);
router.put('/:id', updateMedication);
router.delete('/:id', deleteMedication);

router.post('/:userId/logs/:medicationId', createMedicationLog);
router.post('/:userId/check-in/:medicationId', checkInMedication);

export default router; 