import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { auth } from '../middlewares/auth.middleware';
import { authLimiter } from '../middlewares/rateLimit.middleware';
import { asyncErrorHandler } from '../middlewares/asyncErrorHandler';

const router = Router();

router.post('/register', authLimiter, asyncErrorHandler(authController.register));
router.post('/login', authLimiter, asyncErrorHandler(authController.login));
router.post('/refresh', authLimiter, asyncErrorHandler(authController.refresh));
router.get('/me', auth, asyncErrorHandler(authController.me));

export default router;
