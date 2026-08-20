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

  const { brandId, prompt, platform } = req.body;
  if (!brandId || !prompt || !platform) {
    throw new AppError('brandId, platform, and prompt are required', 400);
  }

  const generated = await contentService.generateContentFromAgent(req.orgId, brandId, prompt, platform);
  sendSuccess(res, generated, 'Content generated and saved as DRAFT', 201);
});

export const approveContent = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);

  const contentId = req.params.id as string;
  const content = await contentService.approveContent(req.orgId, contentId);
  sendSuccess(res, content, 'Content approved successfully');
});

export const scheduleContent = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);

  const contentId = req.params.id as string;
  const { scheduledFor } = req.body;
  
  if (!scheduledFor) {
    throw new AppError('scheduledFor is required', 400);
  }

  const content = await contentService.scheduleContent(req.orgId, contentId, new Date(scheduledFor));
  sendSuccess(res, content, 'Content scheduled successfully');
});

import { v4 as uuidv4 } from 'uuid';
import { redis as redisClient } from '../config/redis';

export const predictEngagement = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);

  const { scheduledFor, body, platform, content_type } = req.body;
  
  if (!scheduledFor || !body || !platform) {
    throw new AppError('scheduledFor, body, and platform are required for prediction', 400);
  }

  try {
    const requestId = uuidv4();
    const postData = {
      scheduledFor,
      body,
      platform,
      content_type: content_type || 'post'
    };

    // RPC over Redis Pub/Sub
    const predictionData = await new Promise((resolve, reject) => {
      // 1. Subscribe to response channel
      const subscriber = redisClient.duplicate();
      
      // Setup timeout
      const timeout = setTimeout(async () => {
        await subscriber.unsubscribe("ml.predict.response");
        await subscriber.quit();
        reject(new Error("Prediction request timed out"));
      }, 10000); // 10s timeout

      subscriber.subscribe("ml.predict.response", async (message) => {
        const data = JSON.parse(message);
        
        if (data.requestId === requestId) {
          clearTimeout(timeout);
          await subscriber.unsubscribe("ml.predict.response");
          await subscriber.quit();
          
          if (data.error) reject(new Error(String(data.error)));
          else resolve(data);
        }
      });

      // 2. Publish request
      redisClient.publish("ml.predict.request", JSON.stringify({
        requestId,
        post: postData
      }));
    });

    sendSuccess(res, predictionData, 'Engagement prediction generated successfully');
  } catch (error: any) {
    throw new AppError(`Failed to get prediction: ${error.message}`, 502);
  }
});
