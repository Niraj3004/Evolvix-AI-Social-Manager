import { BaseAgent, AgentState } from './base.agent';
import { gateway } from '../config/ai';

export class StrategyAgent extends BaseAgent {
  constructor() {
    super('StrategyAgent', ['gatewayChat']);
  }

  async execute(state: AgentState): Promise<AgentState> {
    const prompt = `You are a social media strategist. Analyze this topic and context to define a core angle and target emotion.
Topic: ${state.topic}
Platform: ${state.platform}
Context: ${state.researchData?.context || ''}

Output JSON with exact keys: 'angle' (string), 'emotion' (string), 'primaryHook' (string).`;

    const response = await gateway.chat(state.orgId, [{ role: 'system', content: prompt }]);
    
    try {
      const cleanText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      state.strategyData = JSON.parse(cleanText);
    } catch {
      state.strategyData = { angle: "Default angle", emotion: "Excitement", primaryHook: "Check this out!" };
    }
    
    return state;
  }
}

export const strategyAgent = new StrategyAgent();
