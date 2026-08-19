import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { auth } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(auth);

// Get usage analytics - only SUPER or OWNER can see this (though typically OWNER sees only their org)
// Here we restrict to SUPER for global, but the controller handles org-specific
router.get(
  '/usage',
  requireRole([Role.SUPER]),
  adminController.getUsage
);

router.get(
  '/audit',
  requireRole([Role.SUPER, Role.ADMIN]),
  adminController.getAuditLogs
);

router.get(
  '/payments',
  requireRole([Role.SUPER]),
  adminController.getPayments
);

router.post(
  '/payments/:id/approve',
  requireRole([Role.SUPER]),
  adminController.approvePayment
);

export default router;
