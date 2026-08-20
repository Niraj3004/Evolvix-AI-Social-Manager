require('dotenv').config();
import { Role } from '@prisma/client';

async function main() {
  // Find admin user
  const user = await prisma.user.findUnique({
    where: { email: 'admin@evolvix.test' }
  });

  if (!user) {
    console.log('User not found!');
    return;
  }

  // Check if they already have a membership
  const membership = await prisma.membership.findFirst({
    where: { userId: user.id }
  });

  if (!membership) {
    // Create an organization
    const org = await prisma.organization.create({
      data: {
        name: 'Evolvix Admin Team',
      }
    });

    // Create membership
    await prisma.membership.create({
      data: {
        userId: user.id,
        organizationId: org.id,
        role: Role.OWNER
      }
    });

    console.log('Organization created and linked to admin.');
  } else {
    console.log('Admin already has an organization.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
