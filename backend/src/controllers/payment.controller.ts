import { Request, Response } from 'express';
import { asyncErrorHandler } from '../middlewares/asyncErrorHandler';
import { AppError } from '../middlewares/errorMiddleware';
import { prisma } from '../config/db';
import { sendSuccess } from '../utils/response';

export const createManualPayment = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);

  const amount = parseFloat(req.body.amount);
  if (isNaN(amount) || amount <= 0) {
    throw new AppError('Valid amount is required', 400);
  }

  // Expecting a screenshot file uploaded via multer
  if (!req.file || !req.file.path) {
    throw new AppError('Payment screenshot is required for manual payment', 400);
  }

  const payment = await prisma.payment.create({
    data: {
      orgId: req.orgId,
      amount: amount,
      method: 'MANUAL',
      screenshotUrl: req.file.path,
      status: 'PENDING'
    }
  });

  // Send async pending email to the user
  if (req.user && req.user.email) {
    import('../services/email.service').then(({ emailService }) => {
      emailService.sendPaymentPendingEmail(req.user.email);
    }).catch(console.error);
  }

  sendSuccess(res, payment, 'Manual payment submitted and pending approval', 201);
});

export const initiateEsewaPayment = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);
  // TODO: Implement eSewa integration logic (e.g., generate eSewa signature and return payment URL)
  sendSuccess(res, { method: 'ESEWA', status: 'NOT_IMPLEMENTED' }, 'eSewa payment initiated (Stub)');
});

export const initiateKhaltiPayment = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);
  // TODO: Implement Khalti integration logic
  sendSuccess(res, { method: 'KHALTI', status: 'NOT_IMPLEMENTED' }, 'Khalti payment initiated (Stub)');
});
