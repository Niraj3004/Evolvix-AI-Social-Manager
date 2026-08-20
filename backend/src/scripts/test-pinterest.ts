import './config/env.config';
import { trendAgent } from './agents/trend.agent';

async function testPinterestVision() {
  console.log("=== Testing Pinterest Scraper & Vision AI ===");

  const dummyState: any = {
    orgId: 'test-org-123',
    brandData: { industry: 'Premium Gym and Fitness' },
    topic: 'Motivational quotes and heavy lifting'
  };

  console.log("\n1. Firing up the Headless Browser and injecting into Pinterest...");
  console.log(`Industry: ${dummyState.brandData.industry}`);
  console.log(`Topic: ${dummyState.topic}`);
  
  try {
    const newState = await trendAgent.execute(dummyState);
    
    console.log('\n=== SUCCESS ===');
    console.log('Extracted Pinterest Trends (Parsed by Gemini Vision):');
    console.log(JSON.stringify(newState.trendData, null, 2));
  } catch (error: any) {
    console.error('\n=== ERROR ===');
    console.error(error);
  }
}

testPinterestVision();
