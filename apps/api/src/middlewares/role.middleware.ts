import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { Role } from '@prisma/client';

export const requireRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return sendError(res, 'Access denied. Role not found.', 403);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Access denied. Insufficient permissions.', 403);
    }

    next();
  };
};
