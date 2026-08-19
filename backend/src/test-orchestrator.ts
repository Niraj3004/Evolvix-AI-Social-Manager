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

  // Mock designAgent to force USE_TEMPLATE branch
  const { designAgent } = require('./agents/design.agent');
  const originalDesign = designAgent.execute;
  designAgent.execute = async (state: any) => {
      state.designData = { action: 'USE_TEMPLATE', reason: 'Test forced template' };
      return state;
  };

  // Mock templateService to avoid sharp/cloudinary errors in test
  const { templateService } = require('./services/template.service');
  const originalRender = templateService.renderAndUpload;
  templateService.renderAndUpload = async () => 'https://res.cloudinary.com/demo/image/upload/sample.jpg';

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
    designAgent.execute = originalDesign;
    templateService.renderAndUpload = originalRender;
    process.exit(0);
  }
}

testOrchestrator();
