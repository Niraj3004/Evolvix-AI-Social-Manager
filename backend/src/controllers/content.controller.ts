import { Request, Response } from 'express';
import { asyncErrorHandler } from '../middlewares/asyncErrorHandler';
import * as contentService from '../services/content.service';
import { sendSuccess } from '../utils/response';
import { createContentSchema, updateContentSchema } from '../validations/content.validation';
import { AppError } from '../middlewares/errorMiddleware';

export const createContent = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);

  const validatedData = createContentSchema.parse(req.body);
  const content = await contentService.createContent(req.orgId, validatedData);

  sendSuccess(res, content, 'Content created successfully', 201);
});

export const getContents = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);

  const brandId = req.query.brandId as string | undefined;
  const status = req.query.status as string | undefined;

  const contents = await contentService.getContents(req.orgId, brandId, status);
  sendSuccess(res, contents);
});

export const getContentById = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);

  const contentId = req.params.id as string;
  const content = await contentService.getContentById(req.orgId, contentId);
  sendSuccess(res, content);
});

export const updateContent = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);

  const contentId = req.params.id as string;
  const validatedData = updateContentSchema.parse(req.body);
  const content = await contentService.updateContent(req.orgId, contentId, validatedData);

  sendSuccess(res, content, 'Content updated successfully');
});

export const generateContent = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);

  const { brandId, prompt } = req.body;
  if (!brandId || !prompt) {
    throw new AppError('brandId and prompt are required', 400);
  }

  const generated = await contentService.generateContentStub(req.orgId, brandId, prompt);
  sendSuccess(res, generated, 'Content generated successfully', 200);
});
