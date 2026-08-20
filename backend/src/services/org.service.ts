import { prisma } from '../config/db';

export const createOrganization = async (userId: string, name: string) => {
  const org = await prisma.organization.create({
    data: {
      name,
      memberships: {
        create: {
          userId,
          role: 'OWNER',
        },
      },
    },
  });

  return org;
};

export const getOrgUsage = async (orgId: string) => {
  const subscription = await prisma.subscription.findUnique({
    where: { orgId }
  });

  const aiUsageRecords = await prisma.aiUsage.findMany({
    where: { orgId }
  });

  const totalTokens = aiUsageRecords.reduce((sum, record) => sum + record.tokens, 0);
  const totalCost = aiUsageRecords.reduce((sum, record) => sum + record.cost, 0);

  return {
    subscription: subscription || { plan: 'FREE', status: 'ACTIVE' },
    aiUsage: {
      totalTokens,
      totalCost
    }
  };
};
