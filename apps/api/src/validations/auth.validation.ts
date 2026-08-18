import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  orgId: z.string().uuid().optional(),
});

export const refreshSchema = z.object({
  refreshToken: z.string(),
});
