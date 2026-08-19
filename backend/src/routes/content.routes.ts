import { Router } from 'express';
import * as contentController from '../controllers/content.controller';
import { auth } from '../middlewares/auth.middleware';
import { tenant } from '../middlewares/tenant.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { auditMiddleware } from '../middlewares/audit.middleware';
import { Role } from '@prisma/client';

const router = Router();

// All content routes require auth and tenant context
router.use(auth, tenant, auditMiddleware);

const contentAuth = requireRole([Role.MANAGER, Role.ADMIN, Role.OWNER, Role.CREATOR]);

// AI Generation Seam (Placeholder)
router.post(
  '/generate',
  contentAuth,
  contentController.generateContent
);

// Content CRUD
router.post(
  '/',
  contentAuth,
  contentController.createContent
);

router.get(
  '/',
  // All authenticated roles within the org can view content
  contentController.getContents
);

router.get(
  '/:id',
  contentController.getContentById
);

router.patch(
  '/:id',
  requireRole([Role.MANAGER, Role.ADMIN, Role.OWNER, Role.CREATOR]),
  contentController.updateContent
);

router.post(
  '/:id/approve',
  requireRole([Role.MANAGER, Role.ADMIN, Role.OWNER]), // Creators cannot approve
  contentController.approveContent
);

router.post(
  '/:id/schedule',
  requireRole([Role.MANAGER, Role.ADMIN, Role.OWNER]),
  contentController.scheduleContent
);

export default router;
