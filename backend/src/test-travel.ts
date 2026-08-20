import './config/env.config';
import { contentAgent } from './agents/content.agent';
import { trendAgent } from './agents/trend.agent';
import { designAgent } from './agents/design.agent';

async function testTravelAgency() {
  console.log("=== Testing Travel Agency ===");

  // We will mock the brand data directly in the orchestrator call for speed
  const dummyState = {
    orgId: 'test-org-123',
    topic: 'Summer vacation getaway to Bali',
    platform: 'instagram',
    brandData: {
      industry: 'Luxury Travel Agency',
      name: 'Wanderlust Travels',
      website: 'wanderlust.com',
      phone: '1-800-TRAVEL'
    }
  };

  try {
    // Run the chain
    // let state = await contentAgent.execute(dummyState as any); 
    let state = await trendAgent.execute(dummyState as any); 
    state = await designAgent.execute(state); 
    
    console.log('\n=== SUCCESS ===');
    console.log('📌 Pinterest Trends Extracted:');
    console.log(JSON.stringify(state.trendData, null, 2));
    
    console.log(`\n🎨 Art Director Prompt: \n${state.designData?.prompt}`);
  } catch (error: any) {
    console.error('\n=== ERROR ===');
    console.error(error.message);
  }
}

testTravelAgency();
