import { Request, Response } from 'express';
import { asyncErrorHandler } from '../middlewares/asyncErrorHandler';
import * as analyticsService from '../services/analytics.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middlewares/errorMiddleware';

export const getAnalytics = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);

  const brandId = req.params.brandId as string;
  if (!brandId) throw new AppError('Brand ID is required in URL', 400);

  const analytics = await analyticsService.getBrandAnalytics(req.orgId, brandId);

  sendSuccess(res, analytics, 'Analytics fetched successfully', 200);
});
