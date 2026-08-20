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
  
  // Look up user's default/first organization to restore context
  const membership = await prisma.membership.findFirst({
    where: { userId },
  });

  const payload = { 
    userId,
    orgId: membership?.organizationId || null,
    role: membership?.role || null
  };
  
  const accessToken = generateAccessToken(payload);
  return { accessToken };
};
export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Return success to prevent email enumeration attacks
    return { message: 'If that email exists, an OTP has been sent.' };
  }

  // Generate a 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

  await prisma.user.update({
    where: { id: user.id },
    data: { otpCode, otpExpiresAt },
  });

  // Send the email async
  import('../services/email.service').then(({ emailService }) => {
    emailService.sendOtpEmail(user.email, otpCode);
  }).catch(console.error);

  return { message: 'If that email exists, an OTP has been sent.' };
};

export const verifyOtp = async (email: string, otpCode: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || !user.otpCode || !user.otpExpiresAt) {
    throw new Error('Invalid or expired OTP');
  }

  if (user.otpCode !== otpCode) {
    throw new Error('Invalid OTP code');
  }

  if (new Date() > user.otpExpiresAt) {
    throw new Error('OTP code has expired');
  }

  // OTP is valid! Generate a short-lived temporary token for password reset
  const resetToken = generateAccessToken({ userId: user.id, purpose: 'reset-password' });
  
  return { resetToken };
};

export const resetPassword = async (resetToken: string, newPasswordRaw: string) => {
  const { verifyAccessToken } = require('../utils/jwt');
  let decoded: any;
  try {
    decoded = verifyAccessToken(resetToken);
  } catch (err) {
    throw new Error('Invalid or expired reset token');
  }

  if (decoded.purpose !== 'reset-password') {
    throw new Error('Invalid token type');
  }

  const hashedPassword = await bcrypt.hash(newPasswordRaw, 10);

  await prisma.user.update({
    where: { id: decoded.userId },
    data: {
      password: hashedPassword,
      otpCode: null,
      otpExpiresAt: null,
    }
  });

  return { message: 'Password has been successfully reset.' };
};
