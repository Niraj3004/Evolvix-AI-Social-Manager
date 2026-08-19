import { BaseAgent, AgentState } from './base.agent';
import { gateway } from '../config/ai';

export class DesignAgent extends BaseAgent {
  constructor() {
    super('DesignAgent', ['gatewayChat']);
  }

  async execute(state: AgentState): Promise<AgentState> {
    const prompt = `You are a social media design director. Analyze this content to determine if it should use a standard branded template, or if it requires a completely new AI-generated visual.

Topic: ${state.topic}
Platform: ${state.platform}
Caption: ${state.contentData?.caption || ''}

Output JSON with exact keys: 'action' (must be either "USE_TEMPLATE" or "GENERATE_VISUAL"), 'reason' (string).`;

    const response = await gateway.chat(state.orgId, [{ role: 'system', content: prompt }]);
    
    try {
      const cleanText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      state.designData = JSON.parse(cleanText);
    } catch {
      state.designData = { action: "USE_TEMPLATE", reason: "Default fallback" };
    }
    
    return state;
  }
}

export const designAgent = new DesignAgent();
