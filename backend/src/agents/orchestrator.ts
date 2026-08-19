import { prisma } from '../config/db';
import { AgentState, BaseAgent } from './base.agent';
import { researchAgent } from './research.agent';
import { strategyAgent } from './strategy.agent';
import { contentAgent } from './content.agent';
import { designAgent } from './design.agent';
import { templateService } from '../services/template.service';

export class Orchestrator {
  private chain: BaseAgent[] = [
    researchAgent,
    strategyAgent,
    contentAgent,
    designAgent
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
          // Check design decision and run Template Engine if required
          if (state.designData?.action === 'USE_TEMPLATE') {
            console.log(`[Orchestrator] DesignAgent selected USE_TEMPLATE. Rendering SVG...`);
            
            // In a real app, brandColor and brandName would come from the Brand record
            // For now, we stub them or pull from research context
            const brandColor = '#6366f1'; 
            const brandName = 'EvolvixAI';
            
            const caption = state.contentData?.caption || 'New Post';
            const topic = state.topic;

            const imageUrl = await templateService.renderAndUpload(topic, caption, brandColor, brandName);
            
            // Add the generated image URL to the state
            state.designData.imageUrl = imageUrl;
            console.log(`[Orchestrator] Template rendered and uploaded: ${imageUrl}`);
          }
          stepOutput = state.designData;
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
