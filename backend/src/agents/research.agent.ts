import { BaseAgent, AgentState } from './base.agent';
import { ragService } from '../services/rag.service';

export class ResearchAgent extends BaseAgent {
  constructor() {
    super('ResearchAgent', ['ragRetrieval']);
  }

  async execute(state: AgentState): Promise<AgentState> {
    const ragResults = await ragService.retrieve(state.orgId, state.brandId, state.topic, 3);
    const contextText = ragResults.map((r: any) => r.content).join('\n---\n');
    
    state.researchData = {
      context: contextText || 'No specific brand context available in memory.',
      summary: 'Retrieved brand guidelines and relevant documents.'
    };
    
    return state;
  }
}

export const researchAgent = new ResearchAgent();
