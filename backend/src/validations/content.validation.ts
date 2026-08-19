import { z } from 'zod';

export const createContentSchema = z.object({
  brandId: z.string().uuid(),
  platform: z.string().min(1),
  body: z.string().min(1),
  status: z.string().min(1).default('DRAFT'),
});

export const updateContentSchema = createContentSchema.partial();
