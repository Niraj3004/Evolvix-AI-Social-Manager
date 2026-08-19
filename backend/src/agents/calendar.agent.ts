import { BaseAgent, AgentState } from './base.agent';
import { gateway } from '../config/ai';

export class CalendarAgent extends BaseAgent {
  constructor() {
    super('CalendarAgent', ['gatewayChat']);
  }

  async execute(state: AgentState): Promise<AgentState> {
    const prompt = `You are a Chief Marketing Officer. Generate a highly engaging social media post topic for today based on this brand.
    
Brand Info:
Name: ${state.brandData?.name || 'Unknown'}
Industry: ${state.brandData?.industry || 'Unknown'}
Audience: ${state.brandData?.audience || 'Unknown'}
Goals: ${state.brandData?.goals || 'Unknown'}

Return ONLY a short, punchy 1-sentence topic. Do not include quotes or extra formatting.
Example: "3 fitness tips for busy professionals."`;

    const response = await gateway.chat(state.orgId, [{ role: 'system', content: prompt }]);
    state.topic = response.text.trim();
    
    return state;
  }
}

export const calendarAgent = new CalendarAgent();
