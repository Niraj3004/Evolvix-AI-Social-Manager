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
