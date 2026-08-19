import { Router } from 'express';
import { registerHandler, loginHandler, refreshHandler, meHandler } from '../controllers/auth.controller';
import { auth } from '../middlewares/auth.middleware';
import { asyncErrorHandler } from '../middlewares/asyncErrorHandler';

const router = Router();

router.post('/register', asyncErrorHandler(registerHandler));
router.post('/login', asyncErrorHandler(loginHandler));
router.post('/refresh', asyncErrorHandler(refreshHandler));
router.get('/me', auth, asyncErrorHandler(meHandler));

export default router;
