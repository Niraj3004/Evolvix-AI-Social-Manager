import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { auth } from '../middlewares/auth.middleware';
import { tenant } from '../middlewares/tenant.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(auth, tenant);

// Get analytics for a brand
router.get(
  '/:brandId',
  requireRole([Role.MANAGER, Role.ADMIN, Role.OWNER, Role.ANALYST]),
  analyticsController.getAnalytics
);

export default router;
