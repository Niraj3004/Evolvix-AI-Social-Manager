import { Request, Response } from 'express';
import { createOrganization, getOrgUsage } from '../services/org.service';
import { sendSuccess, sendError } from '../utils/response';
import { createOrgSchema } from '../validations/org.validation';

export const createOrgHandler = async (req: Request, res: Response) => {
  if (!req.user || !req.user.userId) {
    return sendError(res, 'Unauthorized', 401);
  }

  const parsed = createOrgSchema.parse(req.body);
  try {
    const result = await createOrganization(req.user.userId, parsed.name);
    sendSuccess(res, result, 'Organization created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

export const getOrgUsageHandler = async (req: Request, res: Response) => {
  if (!req.user || !req.user.orgId) {
    return sendError(res, 'Organization context missing', 400);
  }

  try {
    const usage = await getOrgUsage(req.user.orgId);
    sendSuccess(res, usage, 'Usage fetched successfully', 200);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};
