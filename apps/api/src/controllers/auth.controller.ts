import { Request, Response } from 'express';
import { register, login, refresh } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { registerSchema, loginSchema, refreshSchema } from '../validations/auth.validation';
import { verifyRefreshToken } from '../utils/jwt';

export const registerHandler = async (req: Request, res: Response) => {
  const parsed = registerSchema.parse(req);
  try {
    const result = await register(parsed.body.email, parsed.body.password);
    sendSuccess(res, result, 'User registered successfully', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  const parsed = loginSchema.parse(req);
  try {
    const result = await login(parsed.body.email, parsed.body.password, parsed.body.orgId);
    sendSuccess(res, result, 'Login successful');
  } catch (error: any) {
    sendError(res, error.message, 401);
  }
};

export const refreshHandler = async (req: Request, res: Response) => {
  const parsed = refreshSchema.parse(req);
  try {
    const decoded = verifyRefreshToken(parsed.body.refreshToken);
    const result = await refresh(decoded.userId);
    sendSuccess(res, result, 'Token refreshed');
  } catch (error: any) {
    sendError(res, 'Invalid refresh token', 401);
  }
};

export const meHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 'Unauthorized', 401);
  }
  sendSuccess(res, req.user, 'Current user context');
};
