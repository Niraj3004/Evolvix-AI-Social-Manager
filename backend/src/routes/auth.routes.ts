import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { auth } from '../middlewares/auth.middleware';
import { authLimiter } from '../middlewares/rateLimit.middleware';
import { asyncErrorHandler } from '../middlewares/asyncErrorHandler';

const router = Router();

router.post('/register', authLimiter, asyncErrorHandler(authController.registerHandler));
router.post('/login', authLimiter, asyncErrorHandler(authController.loginHandler));
router.post('/refresh', authLimiter, asyncErrorHandler(authController.refreshHandler));

// OTP Password Reset Flow
router.post('/forgot-password', authLimiter, asyncErrorHandler(authController.forgotPasswordHandler));
router.post('/verify-otp', authLimiter, asyncErrorHandler(authController.verifyOtpHandler));
router.post('/reset-password', authLimiter, asyncErrorHandler(authController.resetPasswordHandler));

router.get('/me', auth, asyncErrorHandler(authController.meHandler));

export default router;
