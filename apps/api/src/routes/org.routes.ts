import { Router } from 'express';
import { createOrgHandler } from '../controllers/org.controller';
import { auth } from '../middlewares/auth.middleware';
import { asyncErrorHandler } from '../middlewares/asyncErrorHandler';

const router = Router();

router.post('/', auth, asyncErrorHandler(createOrgHandler));

export default router;
