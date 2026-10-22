import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, getMe, logout } from '../controllers/authController.js';
import protect from '../middleware/protect.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts, try again later' },
});

router.post('/login', loginLimiter, login);
router.get('/me',     protect, getMe);
router.post('/logout', protect, logout);

export default router;
