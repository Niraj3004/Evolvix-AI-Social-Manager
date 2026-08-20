import { prisma } from '../config/db';
import { AgentState, BaseAgent } from './base.agent';
import { researchAgent } from './research.agent';
import { strategyAgent } from './strategy.agent';
import { contentAgent } from './content.agent';
import { trendAgent } from './trend.agent';
import { designAgent } from './design.agent';
import { visionAgent } from './vision.agent';
import { templateService } from '../services/template.service';
import { gateway } from '../config/ai';

export class Orchestrator {
  private chain: BaseAgent[] = [
    researchAgent,
    strategyAgent,
    contentAgent,
    trendAgent,
    designAgent,
    visionAgent
  ];

  async runContentJob(orgId: string, brandId: string, topic: string, platform: string): Promise<AgentState> {
    const brand = await prisma.brand.findUnique({ where: { id: brandId } });
    if (!brand) throw new Error('Brand not found');

    let state: AgentState = {
      orgId,
      brandId,
      topic,
      platform,
      brandData: brand as any
    };

    for (const agent of this.chain) {
      console.log(`[Orchestrator] Running ${agent.name}...`);
      
      try {
        try {
          state = await agent.execute(state);
        } catch (error: any) {
          console.error(`[Orchestrator] Warning: ${agent.name} failed, but continuing pipeline. Error: ${error.message}`);
        }

        // Extract the specific output for logging based on agent name
        let stepOutput: any = {};
        if (agent.name === 'ResearchAgent') stepOutput = state.researchData;
        if (agent.name === 'StrategyAgent') stepOutput = state.strategyData;
        if (agent.name === 'ContentAgent') stepOutput = state.contentData;
        if (agent.name === 'TrendAgent') stepOutput = state.trendData;
        
        if (agent.name === 'DesignAgent') {
          const brandColor = state.brandData?.colors ? (state.brandData.colors.includes('[') ? JSON.parse(state.brandData.colors)[0] : state.brandData.colors.split(',')[0].trim()) : '#6366f1'; 
          const brandName = state.brandData?.name || 'EvolvixAI';
          const caption = state.contentData?.caption || 'New Post';
          const postTopic = state.topic;

          if (state.designData?.action === 'USE_TEMPLATE') {
            console.log(`[Orchestrator] DesignAgent selected USE_TEMPLATE. Rendering SVG...`);
            const imageUrl = await templateService.renderAndUpload(postTopic, caption, brandColor, brandName);
            state.designData.imageUrl = imageUrl;
            console.log(`[Orchestrator] Template rendered and uploaded: ${imageUrl}`);
          } else if (state.designData?.action === 'GENERATE_VISUAL') {
            console.log(`[Orchestrator] DesignAgent selected GENERATE_VISUAL. Generating AI image...`);
            
            // Extract the best hook from the content to use as the big poster text
            const primaryHook = state.contentData?.hooks?.[0] || caption.substring(0, 30);

            // Build a visual prompt tailored for highly stylized digital agency graphics with integrated text
            const imagePrompt = `A creative, highly engaging digital marketing agency social media poster. Style: Mixed media, vibrant colors, photo-manipulation, modern graphic design, similar to top-tier digital agency ads. Prominently feature this EXACT text in large, bold, integrated typography: "${primaryHook}". Visual concept should match the topic: ${postTopic}. DO NOT add any other text.`;
            const baseImageUrl = await gateway.generateImage(orgId, imagePrompt);
            console.log(`[Orchestrator] AI Image generated successfully.`);

            // Brand the AI image by passing it into the Template Engine
            console.log(`[Orchestrator] Applying brand overlay to AI image...`);
            const finalImageUrl = await templateService.renderAndUpload(
              postTopic, 
              caption, 
              brandColor, 
              brandName, 
              baseImageUrl, 
              state.brandData?.logoUrl, 
              state.brandData?.phone, 
              state.brandData?.website
            );
            
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
