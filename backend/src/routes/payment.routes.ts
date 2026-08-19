import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { auth } from '../middlewares/auth.middleware';
import { tenant } from '../middlewares/tenant.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { upload } from '../middlewares/upload.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(auth, tenant);

// Only managers+ can initiate payments
const paymentAuth = requireRole([Role.MANAGER, Role.ADMIN, Role.OWNER]);

router.post('/manual', paymentAuth, upload.single('screenshot'), paymentController.createManualPayment);
router.post('/esewa', paymentAuth, paymentController.initiateEsewaPayment);
router.post('/khalti', paymentAuth, paymentController.initiateKhaltiPayment);

export default router;
