import { Router } from 'express';
import { sendSuccess } from '../utils/response';

import authRoutes from './auth.routes';
import orgRoutes from './org.routes';
import brandRoutes from './brand.routes';
import contentRoutes from './content.routes';
import socialRoutes from './social.routes';
import analyticsRoutes from './analytics.routes';
import adminRoutes from './admin.routes';
import webhookRoutes from './webhook.routes';
import paymentRoutes from './payment.routes';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/swagger';

const router = Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.get('/health', (req, res) => {
  sendSuccess(res, null, 'Server is healthy');
});

import { testQueue } from '../queues';
router.post('/test/queue', async (req, res) => {
  const { fail } = req.body;
  const job = await testQueue.add('test-job', { fail: !!fail });
  sendSuccess(res, { jobId: job.id }, 'Test job enqueued');
});

router.use('/auth', authRoutes);
router.use('/orgs', orgRoutes);
router.use('/brands', brandRoutes);
router.use('/content', contentRoutes);
router.use('/social', socialRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/payments', paymentRoutes);

export default router;
