import bcrypt from 'bcrypt';
import { prisma } from '../config/db';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export const register = async (email: string, passwordRaw: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const password = await bcrypt.hash(passwordRaw, 10);
  const user = await prisma.user.create({
    data: { email, password },
  });

  const payload = { userId: user.id };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Send async welcome email
  import('../services/email.service').then(({ emailService }) => {
    emailService.sendWelcomeEmail(user.email, user.email.split('@')[0]);
  }).catch(console.error);

  return { user: { id: user.id, email: user.email }, accessToken, refreshToken };
};

export const login = async (email: string, passwordRaw: string, orgId?: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValid = await bcrypt.compare(passwordRaw, user.password);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  let role = null;
  let activeOrgId = orgId || null;

  if (activeOrgId) {
    const membership = await prisma.membership.findUnique({
      where: { userId_organizationId: { userId: user.id, organizationId: activeOrgId } },
    });
    if (!membership) {
      throw new Error('User is not a member of the requested organization');
    }
    role = membership.role;
  } else {
    // If no org specified, try to find the first one
    const firstMembership = await prisma.membership.findFirst({
      where: { userId: user.id },
    });
    if (firstMembership) {
      activeOrgId = firstMembership.organizationId;
      role = firstMembership.role;
    }
  }

  const payload = { userId: user.id, orgId: activeOrgId, role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ userId: user.id });

  return { user: { id: user.id, email: user.email, role, orgId: activeOrgId }, accessToken, refreshToken };
};

export const refresh = async (userId: string) => {
  // Normally you would validate the refresh token against the DB or cache here
  const payload = { userId };
  const accessToken = generateAccessToken(payload);
  return { accessToken };
};
