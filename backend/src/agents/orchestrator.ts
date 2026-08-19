import { prisma } from '../config/db';
import { AgentState, BaseAgent } from './base.agent';
import { researchAgent } from './research.agent';
import { strategyAgent } from './strategy.agent';
import { contentAgent } from './content.agent';
import { designAgent } from './design.agent';
import { visionAgent } from './vision.agent';
import { templateService } from '../services/template.service';
import { gateway } from '../config/ai';

export class Orchestrator {
  private chain: BaseAgent[] = [
    researchAgent,
    strategyAgent,
    contentAgent,
    designAgent,
    visionAgent
  ];

  async runContentJob(orgId: string, brandId: string, topic: string, platform: string): Promise<AgentState> {
    let state: AgentState = {
      orgId,
      brandId,
      topic,
      platform
    };

    for (const agent of this.chain) {
      console.log(`[Orchestrator] Running ${agent.name}...`);
      
      try {
        state = await agent.execute(state);

        // Extract the specific output for logging based on agent name
        let stepOutput = {};
        if (agent.name === 'ResearchAgent') stepOutput = state.researchData;
        if (agent.name === 'StrategyAgent') stepOutput = state.strategyData;
        if (agent.name === 'ContentAgent') stepOutput = state.contentData;
        
        if (agent.name === 'DesignAgent') {
          const brandColor = '#6366f1'; 
          const brandName = 'EvolvixAI';
          const caption = state.contentData?.caption || 'New Post';
          const postTopic = state.topic;

          if (state.designData?.action === 'USE_TEMPLATE') {
            console.log(`[Orchestrator] DesignAgent selected USE_TEMPLATE. Rendering SVG...`);
            const imageUrl = await templateService.renderAndUpload(postTopic, caption, brandColor, brandName);
            state.designData.imageUrl = imageUrl;
            console.log(`[Orchestrator] Template rendered and uploaded: ${imageUrl}`);
          } else if (state.designData?.action === 'GENERATE_VISUAL') {
            console.log(`[Orchestrator] DesignAgent selected GENERATE_VISUAL. Generating AI image...`);
            
            // Build a visual prompt based on the content
            const imagePrompt = `A high quality, professional social media background image for the topic: ${postTopic}. Style: Modern, clean, no text.`;
            const baseImageUrl = await gateway.generateImage(orgId, imagePrompt);
            console.log(`[Orchestrator] AI Image generated successfully.`);

            // Brand the AI image by passing it into the Template Engine
            console.log(`[Orchestrator] Applying brand overlay to AI image...`);
            const finalImageUrl = await templateService.renderAndUpload(postTopic, caption, brandColor, brandName, baseImageUrl);
            
            state.designData.imageUrl = finalImageUrl;
            console.log(`[Orchestrator] Branded AI image uploaded: ${finalImageUrl}`);
          }
          
          stepOutput = state.designData;
        }

        if (agent.name === 'VisionAgent') {
          console.log(`[Orchestrator] Vision QA Result: [${state.visionData?.status}] - ${state.visionData?.reason}`);
          stepOutput = state.visionData;
        }

        // Log successful step to AgentRun
        await prisma.agentRun.create({
          data: {
            orgId,
            agentType: agent.name,
            status: 'COMPLETED',
            details: JSON.stringify(stepOutput)
          }
        });

      } catch (error: any) {
        console.error(`[Orchestrator] Error in ${agent.name}:`, error);
        
        // Log failure to AgentRun
        await prisma.agentRun.create({
          data: {
            orgId,
            agentType: agent.name,
            status: 'FAILED',
            details: error.message
          }
        });
        
        throw new Error(`Agent chain failed at ${agent.name}: ${error.message}`);
      }
    }

    console.log(`[Orchestrator] Content Job completed successfully.`);
    return state;
  }
}

export const orchestrator = new Orchestrator();
