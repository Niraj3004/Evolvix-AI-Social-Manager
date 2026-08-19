import { prisma } from '../config/db';
import { AgentState, BaseAgent } from './base.agent';
import { researchAgent } from './research.agent';
import { strategyAgent } from './strategy.agent';
import { contentAgent } from './content.agent';
import { designAgent } from './design.agent';

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
        if (agent.name === 'DesignAgent') stepOutput = state.designData;

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
