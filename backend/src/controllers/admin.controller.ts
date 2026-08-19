import { Request, Response } from 'express';
import { asyncErrorHandler } from '../middlewares/asyncErrorHandler';
import * as usageService from '../services/usage.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middlewares/errorMiddleware';

export const getUsage = asyncErrorHandler(async (req: Request, res: Response) => {
  // Can get org-specific usage if they pass an orgId query, otherwise all (if super admin)
  const orgId = req.query.orgId as string;
  
  if (orgId) {
    const usage = await usageService.getOrgUsage(orgId);
    sendSuccess(res, usage, 'Usage fetched for organization');
  } else {
    const usage = await usageService.getAllUsage();
    sendSuccess(res, usage, 'Global usage fetched');
  }
});

export const getPayments = asyncErrorHandler(async (req: Request, res: Response) => {
  const { prisma } = require('../config/db');
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { organization: true }
  });
  sendSuccess(res, payments, 'Payments fetched');
});

export const getAuditLogs = asyncErrorHandler(async (req: Request, res: Response) => {
  const { prisma } = require('../config/db');
  
  // If Super Admin, fetch all, otherwise fetch by orgId
  const query = req.user?.role === 'SUPER' ? {} : { where: { orgId: req.orgId } };
  
  const logs = await prisma.auditLog.findMany({
    ...query,
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      organization: { select: { name: true } }
    }
  });
  
  sendSuccess(res, logs, 'Audit logs fetched');
});

export const approvePayment = asyncErrorHandler(async (req: Request, res: Response) => {
  const { prisma } = require('../config/db');
  const paymentId = req.params.id;

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) throw new AppError('Payment not found', 404);

  // Update payment status
  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: 'APPROVED' }
  });

  // Create or Update Subscription for Org
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription

  const subscription = await prisma.subscription.upsert({
    where: { orgId: payment.orgId },
    update: { status: 'ACTIVE', expiresAt, plan: 'PRO' },
    create: {
      orgId: payment.orgId,
      status: 'ACTIVE',
      plan: 'PRO',
      expiresAt
    }
  });

  // Fetch the user who made the payment (we'll fetch the owner of the org for simplicity)
  const ownerMembership = await prisma.membership.findFirst({
    where: { organizationId: payment.orgId, role: 'OWNER' },
    include: { user: true }
  });

  if (ownerMembership && ownerMembership.user.email) {
    import('../services/email.service').then(({ emailService }) => {
      emailService.sendPaymentApprovedEmail(ownerMembership.user.email, 'PRO');
    }).catch(console.error);
  }

  sendSuccess(res, { payment: updatedPayment, subscription }, 'Payment approved and subscription activated');
});
