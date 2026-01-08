import { Router } from 'express';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

// All event routes require authentication
router.use(authMiddleware);

router.get('/', getEvents);
router.post('/', validateRequest, createEvent);
router.put('/:id', validateRequest, updateEvent);
router.delete('/:id', deleteEvent);

export default router;
