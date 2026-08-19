import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

export const auditMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Capture the original end function to intercept the response status
  const originalEnd = res.end;
  
  res.end = function (...args: any[]) {
    // Only log successful write operations (POST, PUT, PATCH, DELETE)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && res.statusCode >= 200 && res.statusCode < 300) {
      if (req.orgId && req.user?.userId) {
        let action = `${req.method} ${req.originalUrl}`;
        // Map common routes to readable actions
        if (req.originalUrl.includes('/social/connect')) action = 'Connected Social Account';
        if (req.originalUrl.includes('/content') && req.method === 'POST') action = 'Created Content';
        if (req.originalUrl.includes('/content') && req.method === 'PUT') action = 'Updated Content';
        if (req.originalUrl.includes('/payments/manual')) action = 'Submitted Manual Payment';
        
        prisma.auditLog.create({
          data: {
            orgId: req.orgId,
            userId: req.user.userId,
            action: action,
            details: JSON.stringify(req.body)
          }
        }).catch(err => console.error('[AuditLog Error]', err));
      }
    }
    return originalEnd.apply(res, args as any);
  };
  
  next();
};
