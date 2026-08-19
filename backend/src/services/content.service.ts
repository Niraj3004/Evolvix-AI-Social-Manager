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

import { orchestrator } from '../agents/orchestrator';

export const generateContentFromAgent = async (orgId: string, brandId: string, prompt: string, platform: string) => {
  const finalState = await orchestrator.runContentJob(orgId, brandId, prompt, platform);
  
  const generatedBody = finalState.contentData?.caption || '';
  
  // Auto-save as DRAFT
  const content = await createContent(orgId, {
    brandId,
    platform,
    body: generatedBody,
    status: 'DRAFT'
  });

  return {
    content,
    hooks: finalState.contentData?.hooks || [],
    hashtags: finalState.contentData?.hashtags || [],
    script: finalState.contentData?.script || '',
    strategy: finalState.strategyData,
    design: finalState.designData
  };
};

export const approveContent = async (orgId: string, contentId: string) => {
  const existingContent = await getContentById(orgId, contentId);
  
  if (existingContent.status !== 'DRAFT') {
    throw new AppError('Only DRAFT content can be approved', 400);
  }

  return prisma.content.update({
    where: { id: contentId },
    data: { status: 'APPROVED' }
  });
};

export const scheduleContent = async (orgId: string, contentId: string, scheduledFor: Date) => {
  const existingContent = await getContentById(orgId, contentId);
  
  if (existingContent.status !== 'APPROVED') {
    throw new AppError('Only APPROVED content can be scheduled', 400);
  }

  // Update content status to SCHEDULED and create ScheduledPost
  return prisma.content.update({
    where: { id: contentId },
    data: { 
      status: 'SCHEDULED',
      scheduledPosts: {
        create: {
          orgId,
          scheduledFor,
          status: 'PENDING'
        }
      }
    },
    include: {
      scheduledPosts: true
    }
  });
};
