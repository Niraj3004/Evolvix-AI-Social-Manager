import { Request, Response } from 'express';
import { register, login, refresh } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { registerSchema, loginSchema, refreshSchema } from '../validations/auth.validation';
import { verifyRefreshToken } from '../utils/jwt';

export const registerHandler = async (req: Request, res: Response) => {
  const parsed = registerSchema.parse(req.body);
  try {
    const result = await register(parsed.email, parsed.password);
    sendSuccess(res, result, 'User registered successfully', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  const parsed = loginSchema.parse(req.body);
  try {
    const result = await login(parsed.email, parsed.password, parsed.orgId);
    sendSuccess(res, result, 'Login successful');
  } catch (error: any) {
    sendError(res, error.message, 401);
  }
};

export const refreshHandler = async (req: Request, res: Response) => {
  const parsed = refreshSchema.parse(req.body);
  try {
    const decoded = verifyRefreshToken(parsed.refreshToken);
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

export const forgotPasswordHandler = async (req: Request, res: Response) => {
  const { forgotPasswordSchema } = require('../validations/auth.validation');
  const parsed = forgotPasswordSchema.parse(req.body);
  try {
    const { forgotPassword } = require('../services/auth.service');
    const result = await forgotPassword(parsed.email);
    sendSuccess(res, result, 'Forgot password initiated');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

export const verifyOtpHandler = async (req: Request, res: Response) => {
  const { verifyOtpSchema } = require('../validations/auth.validation');
  const parsed = verifyOtpSchema.parse(req.body);
  try {
    const { verifyOtp } = require('../services/auth.service');
    const result = await verifyOtp(parsed.email, parsed.otpCode);
    sendSuccess(res, result, 'OTP verified');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
  const { resetPasswordSchema } = require('../validations/auth.validation');
  const parsed = resetPasswordSchema.parse(req.body);
  try {
    const { resetPassword } = require('../services/auth.service');
    const result = await resetPassword(parsed.resetToken, parsed.newPassword);
    sendSuccess(res, result, 'Password reset successful');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};
