import { Router } from 'express';
import { createOrgHandler, getOrgUsageHandler } from '../controllers/org.controller';
import { tenant } from '../middlewares/tenant.middleware';
import { auth } from '../middlewares/auth.middleware';
import { asyncErrorHandler } from '../middlewares/asyncErrorHandler';

const router = Router();

router.post('/', auth, asyncErrorHandler(createOrgHandler));
router.get('/usage', auth, tenant, asyncErrorHandler(getOrgUsageHandler));

export default router;
