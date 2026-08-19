import { orchestrator } from './agents/orchestrator';
import { prisma } from './config/db';
import { ragService } from './services/rag.service';

async function testOrchestrator() {
  const orgId = 'test-org-123';
  const brandId = 'test-brand-456';
  const topic = 'Launch of our new AI scheduling tool for social media.';
  const platform = 'Instagram';

  console.log(`Starting orchestrator test for topic: "${topic}" on ${platform}`);

  // Mock prisma AgentRun
  const originalCreate = prisma.agentRun.create;
  (prisma.agentRun.create as any) = async () => ({ id: 'mock-id' });

  // Mock RAG retrieve to avoid embedding API call
  const originalRetrieve = ragService.retrieve;
  (ragService.retrieve as any) = async () => [{ content: 'We are a fast-paced AI startup.' }];

  try {
    const finalState = await orchestrator.runContentJob(orgId, brandId, topic, platform);
    
    console.log('\n--- FINAL STATE ---');
    console.log('1. Research Data:', JSON.stringify(finalState.researchData, null, 2));
    console.log('2. Strategy Data:', JSON.stringify(finalState.strategyData, null, 2));
    console.log('3. Content Data:', JSON.stringify(finalState.contentData, null, 2));
    console.log('4. Design Data:', JSON.stringify(finalState.designData, null, 2));
    
    console.log('\nOrchestrator test completed successfully!');
  } catch (error) {
    console.error('\nOrchestrator test failed:', error);
  } finally {
    prisma.agentRun.create = originalCreate;
    ragService.retrieve = originalRetrieve;
    process.exit(0);
  }
}

testOrchestrator();
