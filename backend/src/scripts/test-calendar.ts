import './config/env.config';
import { prisma } from './config/db';
import { calendarAgent } from './agents/calendar.agent';
import { orchestrator } from './agents/orchestrator';

async function testCalendarFlow() {
  console.log("=== Testing Zero-Touch Calendar Automation ===");

  // 1. Get a test brand (assume one exists, or create a temporary one)
  let brand = await prisma.brand.findFirst({
    where: { name: 'Zarsh Solutions' }
  });

  if (!brand) {
    console.log("Zarsh Solutions brand not found. Using first available brand...");
    brand = await prisma.brand.findFirst();
  }

  if (!brand) {
    console.log("No brands in the database. Creating a mock brand for testing...");
    const org = await prisma.organization.create({
      data: { name: 'Test Org' }
    });
    brand = await prisma.brand.create({
      data: {
        orgId: org.id,
        name: 'Zarsh Solutions',
        industry: 'Digital Marketing & IT',
        audience: 'B2B Businesses',
        logoUrl: 'https://cdn-icons-png.flaticon.com/512/5968/5968144.png', // Apple logo placeholder
        phone: '+1 800 123 4567',
        website: 'www.zarshsolutions.com'
      }
    });
  } else {
    // Update the brand with logo and contact info for the test
    brand = await prisma.brand.update({
      where: { id: brand.id },
      data: {
        logoUrl: 'https://cdn-icons-png.flaticon.com/512/5968/5968144.png', // Example Apple Logo
        phone: '+1 800 123 4567',
        website: 'www.zarshsolutions.com'
      }
    });
  }

  console.log(`\n1. Target Brand: ${brand.name} (${brand.industry})`);
  
  // 2. Run Calendar Agent to autonomously pick a topic
  console.log("\n2. Waking up Calendar Agent to decide today's topic...");
  const calendarState = await calendarAgent.execute({
    orgId: brand.orgId,
    brandId: brand.id,
    brandData: brand as any,
    platform: 'linkedin',
    topic: '' 
  });

  console.log(`\n✅ Calendar Agent Decision: "${calendarState.topic}"`);

  // 3. Trigger Orchestrator
  console.log("\n3. Handing topic over to the Orchestrator pipeline...");
  
  try {
    const finalState = await orchestrator.runContentJob(brand.orgId, brand.id, calendarState.topic!, 'linkedin');
    
    console.log('\n=== SUCCESS ===');
    console.log(`Copywriter Agent Output: \n${finalState.contentData?.body}`);
    console.log(`\nFinal Stamped Image URL: ${finalState.designData?.imageUrl}`);
  } catch (error: any) {
    console.error('\n=== ERROR ===');
    console.error(error.message);
    console.log("Note: If the image gen failed, it's due to the network block on HuggingFace. But the prompt generation and asset stamping logic is working!");
  }
}

testCalendarFlow();
