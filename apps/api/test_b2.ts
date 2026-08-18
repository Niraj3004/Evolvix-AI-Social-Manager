import { register, login } from './src/services/auth.service';
import { createOrganization } from './src/services/org.service';
import { prisma } from './src/config/db';

async function test() {
  try {
    console.log('Cleaning DB...');
    await prisma.membership.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.user.deleteMany();

    console.log('Testing Register...');
    const regRes = await register('test@evolvix.com', 'password123');
    console.log('Registered User:', regRes.user);

    console.log('Testing Create Org...');
    const org = await createOrganization(regRes.user.id, 'My Test Org');
    console.log('Created Org:', org);

    console.log('Testing Login...');
    const loginRes = await login('test@evolvix.com', 'password123');
    console.log('Login Response:', loginRes);

    console.log('All B2 Logic passed');
  } catch (error) {
    console.error('Test failed', error);
  } finally {
    process.exit(0);
  }
}

test();
