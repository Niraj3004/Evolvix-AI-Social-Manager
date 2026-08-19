import { Router } from 'express';
import * as socialController from '../controllers/social.controller';
import { auth } from '../middlewares/auth.middleware';
import { tenant } from '../middlewares/tenant.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(auth, tenant);

// Connect a new social account
router.post(
  '/connect',
  requireRole([Role.MANAGER, Role.ADMIN, Role.OWNER]),
  socialController.connectAccount
);

// List social accounts for a brand
router.get(
  '/:brandId',
  socialController.getAccounts
);

export default router;
