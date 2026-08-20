import './config/env.config';
import { prisma } from './config/db';
import { orchestrator } from './agents/orchestrator';

async function testManualModeFlow() {
  console.log("=== Testing Manual Mode Override ===");

  // 1. Get a test brand
  let brand = await prisma.brand.findFirst();

  if (!brand) {
    console.log("No brands found. Aborting test.");
    return;
  }

  console.log(`\n1. Target Brand: ${brand.name}`);
  
  // 2. The Human user types a manual topic (bypassing the Calendar Agent)
  const manualUserTopic = "Huge 24-Hour Flash Sale on all our services! Grab it before it's gone.";
  console.log(`\n2. Human User manually typed topic: "${manualUserTopic}"`);

  // 3. Trigger Orchestrator directly (this is exactly what the /api/content/generate endpoint does)
  console.log("\n3. Handing manual topic directly over to the Orchestrator pipeline...");
  
  try {
    const finalState = await orchestrator.runContentJob(brand.orgId, brand.id, manualUserTopic, 'instagram');
    
    console.log('\n=== SUCCESS ===');
    console.log('📌 Pinterest Trends Extracted:');
    console.log(JSON.stringify(finalState.trendData, null, 2));
    
    console.log(`\n✍️ Copywriter Output: \n${finalState.contentData?.body}`);
    console.log(`\n🎨 Art Director Prompt: \n${finalState.designData?.prompt}`);
    console.log(`\n🖼️ Final Stamped Image URL: ${finalState.designData?.imageUrl}`);
  } catch (error: any) {
    console.error('\n=== ERROR ===');
    console.error(error.message);
  }
}

testManualModeFlow();
