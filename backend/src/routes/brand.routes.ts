import { Router } from 'express';
import * as brandController from '../controllers/brand.controller';
import { auth } from '../middlewares/auth.middleware';
import { tenant } from '../middlewares/tenant.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// All brand routes require authentication and a valid tenant context
router.use(auth, tenant);

// Only Managers, Admins, and Owners can create brands
router.post(
  '/',
  requireRole([Role.MANAGER, Role.ADMIN, Role.OWNER]),
  brandController.createBrand
);

// All authenticated roles within the org can view brands
router.get('/', brandController.getBrands);
router.get('/:id', brandController.getBrandById);

// Only Managers, Admins, and Owners can update brands
router.patch(
  '/:id',
  requireRole([Role.MANAGER, Role.ADMIN, Role.OWNER]),
  brandController.updateBrand
);

// Only Admins and Owners can delete brands
router.delete(
  '/:id',
  requireRole([Role.ADMIN, Role.OWNER]),
  brandController.deleteBrand
);

export default router;
