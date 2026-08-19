import { z } from 'zod';

export const connectSocialSchema = z.object({
  brandId: z.string().uuid(),
  platform: z.string().min(1),
  accountId: z.string().min(1),
  accessToken: z.string().min(1),
});
