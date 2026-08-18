import { Router } from 'express';
import { sendSuccess } from '../utils/response';

const router = Router();

router.get('/health', (req, res) => {
  sendSuccess(res, null, 'Server is healthy');
});

// Other routes will be mounted here in future steps

export default router;
