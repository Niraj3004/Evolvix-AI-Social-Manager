import { prisma } from '../config/db';

export const getBrandAnalytics = async (orgId: string, brandId: string) => {
  return prisma.analytics.findMany({
    where: { orgId, brandId },
    include: {
      scheduledPost: {
        include: {
          content: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};
