import 'dotenv/config';
import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma, connectDB } from '../src/config/db';

async function main() {
  await connectDB();
  console.log('Seeding database...');

  // 1. Upsert Demo Organization
  const demoOrg = await prisma.organization.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Demo Organization'
    }
  });

  // 2. Upsert Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: { password: passwordHash },
    create: {
      email: 'admin@demo.com',
      password: passwordHash
    }
  });

  // 3. Upsert Membership
  const membershipId = crypto.createHash('sha256').update(`${demoUser.id}-${demoOrg.id}`).digest('hex').substring(0, 36);
  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: demoUser.id,
        organizationId: demoOrg.id,
      }
    },
    update: { role: Role.ADMIN },
    create: {
      role: Role.ADMIN,
      userId: demoUser.id,
      organizationId: demoOrg.id
    }
  });

  // 4. Upsert Sample Brand
  const demoBrand = await prisma.brand.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      orgId: demoOrg.id,
      name: 'Sample Brand',
      industry: 'Technology',
      description: 'A sample brand created by the seed script.'
    }
  });

  console.log('----------------------------------------------------');
  console.log('Seed completed successfully! You can log in with:');
  console.log(`Email:    admin@demo.com`);
  console.log(`Password: admin123`);
  console.log(`Organization: ${demoOrg.name}`);
  console.log(`Brand: ${demoBrand.name}`);
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
