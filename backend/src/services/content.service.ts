import { prisma } from '../config/db';
import { AppError } from '../middlewares/errorMiddleware';

export const createContent = async (orgId: string, data: any) => {
  // First ensure the brand belongs to this org
  const brand = await prisma.brand.findFirst({
    where: { id: data.brandId, orgId },
  });

  if (!brand) {
    throw new AppError('Brand not found or does not belong to your organization', 404);
  }

  // Create content and its first version
  return prisma.content.create({
    data: {
      ...data,
      orgId,
      contentVersions: {
        create: {
          orgId,
          body: data.body,
        },
      },
    },
    include: {
      contentVersions: true,
    },
  });
};

export const getContents = async (orgId: string, brandId?: string, status?: string) => {
  const whereClause: any = { orgId };
  if (brandId) whereClause.brandId = brandId;
  if (status) whereClause.status = status;

  return prisma.content.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
};

export const getContentById = async (orgId: string, contentId: string) => {
  const content = await prisma.content.findFirst({
    where: { id: contentId, orgId },
    include: { contentVersions: true },
  });

  if (!content) {
    throw new AppError('Content not found', 404);
  }

  return content;
};

export const updateContent = async (orgId: string, contentId: string, data: any) => {
  const existingContent = await getContentById(orgId, contentId);

  // If the body is being updated, we should create a new version
  if (data.body && data.body !== existingContent.body) {
    return prisma.content.update({
      where: { id: contentId },
      data: {
        ...data,
        contentVersions: {
          create: {
            orgId,
            body: data.body,
          },
        },
      },
      include: {
        contentVersions: true,
      },
    });
  }

  // Otherwise just update the standard fields
  return prisma.content.update({
    where: { id: contentId },
    data,
  });
};

import { contentAgent } from '../agents/content.agent';

export const generateContentFromAgent = async (orgId: string, brandId: string, prompt: string, platform: string) => {
  const generatedData = await contentAgent.generatePlatformContent(orgId, brandId, prompt, platform);
  
  return {
    generatedBody: generatedData.caption,
    hooks: generatedData.hooks,
    hashtags: generatedData.hashtags,
    script: generatedData.script,
  };
};
