import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

router.post('/register', validateRequest, register);
router.post('/login', validateRequest, login);

export default router;
