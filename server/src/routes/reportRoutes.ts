import express, { Request, Response, Router } from 'express';
import {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
} from '../controllers/reportController';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  getReports(req, res).catch(err => {
    console.error('Error in getReports:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
});

router.get('/:id', (req: Request, res: Response) => {
  getReportById(req, res).catch(err => {
    console.error('Error in getReportById:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
});

router.post('/', (req: Request, res: Response) => {
  createReport(req, res).catch(err => {
    console.error('Error in createReport:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
});

router.put('/:id', (req: Request, res: Response) => {
  updateReport(req, res).catch(err => {
    console.error('Error in updateReport:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
});

router.delete('/:id', (req: Request, res: Response) => {
  deleteReport(req, res).catch(err => {
    console.error('Error in deleteReport:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
});

export default router;