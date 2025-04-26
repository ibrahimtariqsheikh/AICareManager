import express, { Request, Response, Router } from 'express';
import { createScheduleTemplate, getScheduleTemplates, updateScheduleTemplate, deleteScheduleTemplate, activateScheduleTemplate, deactivateScheduleTemplate } from '../controllers/scheduleTemplateController';

const router: Router = express.Router();

router.post('/', createScheduleTemplate);
router.get('/:userId/:agencyId', getScheduleTemplates);
router.put('/', updateScheduleTemplate);
router.delete('/:id', deleteScheduleTemplate);
router.put('/activate/:id/:userId', activateScheduleTemplate);
router.put('/deactivate/:id', deactivateScheduleTemplate);
export default router;