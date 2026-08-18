import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const tenant = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.orgId) {
    return sendError(res, 'Access denied. Organization context missing.', 403);
  }

  // Pin orgId to the request for easy access in controllers
  req.orgId = req.user.orgId;
  next();
};
