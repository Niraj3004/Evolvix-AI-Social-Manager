import jwt from 'jsonwebtoken';
import { env } from '../config/env.config';
import { Role } from '@prisma/client';

export interface TokenPayload {
  userId: string;
  orgId?: string | null;
  role?: Role | null;
  purpose?: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: { userId: string }): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, env.JWT_SECRET);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
