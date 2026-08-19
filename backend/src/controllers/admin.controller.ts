import { Request, Response } from 'express';
import { asyncErrorHandler } from '../middlewares/asyncErrorHandler';
import * as usageService from '../services/usage.service';
import { sendSuccess } from '../utils/response';

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
