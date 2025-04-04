import express from 'express';
import {
  uploadDocument,
  getUserDocuments,
  getClientDocuments,
  getAgencyDocuments,
  updateDocument,
  deleteDocument
} from '../controllers/documentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Document routes
router.post('/', authMiddleware(['ADMIN', 'CARE_WORKER']), uploadDocument);
router.get('/user/:userId', authMiddleware(['ADMIN', 'CARE_WORKER']), getUserDocuments);
router.get('/client/:clientId', authMiddleware(['ADMIN', 'CARE_WORKER']), getClientDocuments);
router.get('/agency/:agencyId', authMiddleware(['ADMIN', 'CARE_WORKER']), getAgencyDocuments);
router.put('/:id', authMiddleware(['ADMIN', 'CARE_WORKER']), updateDocument);
router.delete('/:id', authMiddleware(['ADMIN']), deleteDocument);

export default router; 