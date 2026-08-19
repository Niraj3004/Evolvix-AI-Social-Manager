import { Request, Response } from 'express';
import { asyncErrorHandler } from '../middlewares/asyncErrorHandler';
import * as brandService from '../services/brand.service';
import { sendSuccess } from '../utils/response';
import { createBrandSchema, updateBrandSchema } from '../validations/brand.validation';
import { AppError } from '../middlewares/errorMiddleware';

export const createBrand = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);

  const validatedData = createBrandSchema.parse(req.body);
  const brand = await brandService.createBrand(req.orgId, validatedData);

  sendSuccess(res, brand, 'Brand created successfully', 201);
});

export const getBrands = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);

  const brands = await brandService.getBrands(req.orgId);
  sendSuccess(res, brands);
});

export const getBrandById = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);

  const brandId = req.params.id as string;
  const brand = await brandService.getBrandById(req.orgId, brandId);
  sendSuccess(res, brand);
});

export const updateBrand = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);

  const brandId = req.params.id as string;
  const validatedData = updateBrandSchema.parse(req.body);
  const brand = await brandService.updateBrand(req.orgId, brandId, validatedData);

  sendSuccess(res, brand, 'Brand updated successfully');
});

export const deleteBrand = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.orgId) throw new AppError('Organization context missing', 400);

  const brandId = req.params.id as string;
  await brandService.deleteBrand(req.orgId, brandId);
  sendSuccess(res, null, 'Brand deleted successfully');
});
