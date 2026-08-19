import { orchestrator } from './agents/orchestrator';
import { prisma } from './config/db';
import { ragService } from './services/rag.service';

// Mock RAG retrieve to avoid embedding API call
const originalRetrieve = ragService.retrieve;
(ragService.retrieve as any) = async () => [{ content: 'We are a premier digital marketing agency.' }];

// Mock prisma AgentRun
const originalCreate = prisma.agentRun.create;
(prisma.agentRun.create as any) = async () => ({ id: 'mock-id' });

// Mock designAgent to force GENERATE_VISUAL branch so we definitely hit OpenAI Image Gen
const { designAgent } = require('./agents/design.agent');
const originalDesign = designAgent.execute;
designAgent.execute = async (state: any) => {
    state.designData = { action: 'GENERATE_VISUAL', reason: 'Forced visual for test' };
    return state;
};

// Mock gateway so it doesn't fail on unpaid OpenAI key, and gives VisionAgent something to look at
const { gateway } = require('./config/ai');
const originalGenerateImage = gateway.generateImage;
gateway.generateImage = async () => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1080&q=80';

async function run() {
  console.log("Generating post for Digital Agency on Facebook...");
  
  try {
    const finalState = await orchestrator.runContentJob(
      'test-org-123',
      'test-brand-456',
      'Our digital agency helps scale your business through AI-driven marketing strategies.',
      'Facebook'
    );
    
    console.log('\n--- SUCCESS! ---');
    console.log('Caption:', finalState.contentData?.caption);
    console.log('Hooks:', finalState.contentData?.hooks);
    console.log('Hashtags:', finalState.contentData?.hashtags);
    console.log('Final Image URL:', finalState.designData?.imageUrl);
    console.log('Vision QA:', finalState.visionData);
  } catch (error) {
    console.error('Job failed:', error);
  } finally {
    prisma.agentRun.create = originalCreate;
    ragService.retrieve = originalRetrieve;
    designAgent.execute = originalDesign;
    gateway.generateImage = originalGenerateImage;
    process.exit(0);
  }
}

run();
