import { Router } from 'express';
import { sendSuccess } from '../utils/response';

import authRoutes from './auth.routes';
import orgRoutes from './org.routes';

const router = Router();

router.get('/health', (req, res) => {
  sendSuccess(res, null, 'Server is healthy');
});

router.use('/auth', authRoutes);
router.use('/orgs', orgRoutes);

export default router;
