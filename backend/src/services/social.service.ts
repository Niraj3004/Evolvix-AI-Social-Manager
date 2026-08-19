import { prisma } from '../config/db';
import { encrypt, decrypt } from '../utils/encryption';
import { AppError } from '../middlewares/errorMiddleware';

export const connectSocialAccount = async (orgId: string, data: { brandId: string, platform: string, accountId: string, accessToken: string }) => {
  // Verify brand ownership
  const brand = await prisma.brand.findFirst({
    where: { id: data.brandId, orgId },
  });

  if (!brand) throw new AppError('Brand not found', 404);

  // Check if account already exists
  let socialAccount = await prisma.socialAccount.findFirst({
    where: { brandId: data.brandId, platform: data.platform, accountId: data.accountId },
  });

  if (!socialAccount) {
    socialAccount = await prisma.socialAccount.create({
      data: {
        brandId: data.brandId,
        orgId,
        platform: data.platform,
        accountId: data.accountId,
      },
    });
  }

  // Encrypt token and store it
  const encryptedToken = encrypt(data.accessToken);

  await prisma.oAuthToken.create({
    data: {
      socialAccountId: socialAccount.id,
      orgId,
      encryptedToken,
    },
  });

  return socialAccount;
};

export const getSocialAccounts = async (orgId: string, brandId: string) => {
  return prisma.socialAccount.findMany({
    where: { orgId, brandId },
  });
};

export const getDecryptedToken = async (orgId: string, socialAccountId: string) => {
  const tokenRecord = await prisma.oAuthToken.findFirst({
    where: { socialAccountId, orgId },
    orderBy: { createdAt: 'desc' },
  });

  if (!tokenRecord) {
    throw new AppError('No token found for this social account', 404);
  }

  return decrypt(tokenRecord.encryptedToken);
};
