import { z } from 'zod';

export const createBrandSchema = z.object({
  name: z.string().min(2, 'Brand name must be at least 2 characters').max(100),
  industry: z.string().optional(),
  description: z.string().optional(),
  audience: z.string().optional(),
  tone: z.string().optional(),
  language: z.string().default('en'),
  colors: z.any().optional(),
  fonts: z.any().optional(),
  goals: z.array(z.string()).optional(),
});

export const updateBrandSchema = createBrandSchema.partial();
export const addDocumentSchema = z.object({
  content: z.string().min(10, 'Document content must be at least 10 characters long'),
});
