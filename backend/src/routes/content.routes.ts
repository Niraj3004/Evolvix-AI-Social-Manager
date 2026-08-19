import { Router } from 'express';
import * as contentController from '../controllers/content.controller';
import { auth } from '../middlewares/auth.middleware';
import { tenant } from '../middlewares/tenant.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// All content routes require auth and tenant context
router.use(auth, tenant);

// AI Generation Seam (Placeholder)
router.post(
  '/generate',
  requireRole([Role.MANAGER, Role.ADMIN, Role.OWNER, Role.CREATOR]),
  contentController.generateContent
);

// Content CRUD
router.post(
  '/',
  requireRole([Role.MANAGER, Role.ADMIN, Role.OWNER, Role.CREATOR]),
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

export default router;
