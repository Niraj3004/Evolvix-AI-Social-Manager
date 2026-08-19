import { prisma } from '../config/db';

export const logAiUsage = async (orgId: string, model: string, tokens: number, cost: number) => {
  return prisma.aiUsage.create({
    data: {
      orgId,
      model,
      tokens,
      cost
    }
  });
};

export const getOrgUsage = async (orgId: string) => {
  const usage = await prisma.aiUsage.aggregate({
    where: { orgId },
    _sum: {
      tokens: true,
      cost: true
    }
  });

  const rawLogs = await prisma.aiUsage.findMany({
    where: { orgId },
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return {
    totals: usage._sum,
    recentActivity: rawLogs
  };
};

export const getAllUsage = async () => {
  const byOrg = await prisma.aiUsage.groupBy({
    by: ['orgId'],
    _sum: {
      tokens: true,
      cost: true
    }
  });

  return byOrg;
};
