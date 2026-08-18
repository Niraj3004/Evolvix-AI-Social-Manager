import { Request, Response } from 'express';
import { createOrganization } from '../services/org.service';
import { sendSuccess, sendError } from '../utils/response';
import { createOrgSchema } from '../validations/org.validation';

export const createOrgHandler = async (req: Request, res: Response) => {
  if (!req.user || !req.user.userId) {
    return sendError(res, 'Unauthorized', 401);
  }

  const parsed = createOrgSchema.parse(req);
  try {
    const result = await createOrganization(req.user.userId, parsed.body.name);
    sendSuccess(res, result, 'Organization created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};
