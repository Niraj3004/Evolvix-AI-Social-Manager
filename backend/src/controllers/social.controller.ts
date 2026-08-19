import { Request, Response } from 'express';
import { asyncErrorHandler } from '../middlewares/asyncErrorHandler';
import * as socialService from '../services/social.service';
import { sendSuccess } from '../utils/response';
import { connectSocialSchema } from '../validations/social.validation';
import { AppError } from '../middlewares/errorMiddleware';

export const connectAccount = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);

  const validatedData = connectSocialSchema.parse(req.body);
  const account = await socialService.connectSocialAccount(req.orgId, validatedData);

  sendSuccess(res, account, 'Social account connected successfully', 201);
});

export const getAccounts = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);

  const brandId = req.params.brandId as string;
  if (!brandId) throw new AppError('Brand ID is required', 400);

  const accounts = await socialService.getSocialAccounts(req.orgId, brandId);
  sendSuccess(res, accounts);
});
