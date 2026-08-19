import { Router } from 'express';
import * as webhookController from '../controllers/webhook.controller';

const router = Router();

// Webhook endpoint (must receive raw body, no auth middleware because it's validated via signature)
router.post('/', webhookController.handleWebhook);

export default router;
