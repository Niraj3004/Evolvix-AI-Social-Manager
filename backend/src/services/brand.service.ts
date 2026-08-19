import { prisma } from '../config/db';
import { AppError } from '../middlewares/errorMiddleware';

export const createBrand = async (orgId: string, data: any) => {
  // Ensure the brand is attached to the tenant's orgId
  return prisma.brand.create({
    data: {
      ...data,
      orgId,
    },
  });
};

export const getBrands = async (orgId: string) => {
  // Enforce tenant isolation
  return prisma.brand.findMany({
    where: { orgId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getBrandById = async (orgId: string, brandId: string) => {
  // Must match both brandId and orgId to prevent IDOR
  const brand = await prisma.brand.findFirst({
    where: {
      id: brandId,
      orgId: orgId,
    },
  });

  if (!brand) {
    throw new AppError('Brand not found', 404);
  }

  return brand;
};

export const updateBrand = async (orgId: string, brandId: string, data: any) => {
  // First ensure it exists and belongs to the org
  await getBrandById(orgId, brandId);

  return prisma.brand.update({
    where: {
      id: brandId,
    },
    data,
  });
};

export const deleteBrand = async (orgId: string, brandId: string) => {
  await getBrandById(orgId, brandId);

  return prisma.brand.delete({
    where: {
      id: brandId,
    },
  });
};

export const addBrandAsset = async (orgId: string, brandId: string, url: string, type: string) => {
  await getBrandById(orgId, brandId); // ensure existence and permission

  return prisma.brandAsset.create({
    data: {
      brandId,
      orgId,
      url,
      type,
    },
  });
};

export const addBrandDocument = async (orgId: string, brandId: string, content: string) => {
  await getBrandById(orgId, brandId);

  return prisma.brandDocument.create({
    data: {
      brandId,
      orgId,
      content,
    },
  });
};
