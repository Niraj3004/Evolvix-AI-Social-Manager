import { Request, Response } from 'express';
import crypto from 'crypto';
import { env } from '../config/env.config';
import { sendSuccess } from '../utils/response';

/**
 * Handles incoming webhooks from external providers (e.g., Stripe, Meta).
 * Note: req.body MUST be a Buffer for the signature verification to work correctly.
 */
export const handleWebhook = (req: Request, res: Response) => {
  const signature = req.headers['x-webhook-signature'] as string;

  if (!signature) {
    return res.status(400).json({ success: false, message: 'Missing webhook signature' });
  }

  try {
    // Determine the secret (e.g., from Stripe or Meta)
    // We will use a mock WEBHOOK_SECRET for this example, defaulting to a fallback if not in env
    const secret = process.env.WEBHOOK_SECRET || 'fallback_secret';
    
    // req.body is expected to be a raw Buffer here
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.body)
      .digest('hex');

    // Secure compare to prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return res.status(401).json({ success: false, message: 'Invalid webhook signature' });
    }

    // Parse the payload now that we trust it
    const payload = JSON.parse(req.body.toString('utf8'));
    
    console.log('[Webhook] Verified successfully:', payload.type);

    // Handle specific webhook events (e.g., payment_intent.succeeded)
    if (payload.type === 'payment_intent.succeeded') {
      const paymentIntentId = payload.data?.object?.id;
      // In a real app we would map this back to our internal Payment model
      // await prisma.payment.updateMany({
      //   where: { transactionId: paymentIntentId },
      //   data: { status: 'COMPLETED' }
      // });
      console.log(`[Webhook] Payment succeeded for ${paymentIntentId}`);
    } else if (payload.type === 'payment_intent.payment_failed') {
      console.log(`[Webhook] Payment failed: ${payload.data?.object?.id}`);
    }
    
    return sendSuccess(res, null, 'Webhook processed successfully');
  } catch (err) {
    console.error('[Webhook] Error processing webhook:', err);
    return res.status(400).json({ success: false, message: 'Webhook error' });
  }
};
