import { BaseAgent, AgentState } from './base.agent';
import { gateway } from '../config/ai';

export class VisionAgent extends BaseAgent {
  constructor() {
    super('VisionAgent');
  }

  async execute(state: AgentState): Promise<AgentState> {
    const imageUrl = state.designData?.imageUrl;
    
    if (!imageUrl) {
      console.warn(`[VisionAgent] No image URL provided in state. Skipping QA.`);
      state.visionData = { status: 'PASS', reason: 'No image generated to QA' };
      return state;
    }

    try {
      const prompt = `You are an expert QA designer. Analyze this final social media image. Is the text legible? Is the design aesthetically pleasing? Reply with a JSON object containing exactly two fields: "status" ("PASS" or "FAIL") and "reason" (a brief explanation). Do not use markdown blocks.`;
      
      const messages = [
        {
          role: 'user' as const,
          content: [
            { type: 'text' as const, text: prompt },
            { type: 'image_url' as const, image_url: { url: imageUrl } }
          ]
        }
      ];

      // Note: Groq will fail because it lacks vision, then Gateway will auto-failover to Gemini
      const response = await gateway.chat(state.orgId, messages, { maxTokens: 300, temperature: 0.1 });
      
      try {
        const parsed = JSON.parse(response.text.trim());
        state.visionData = {
          status: parsed.status || 'FAIL',
          reason: parsed.reason || 'Failed to parse reason from vision model'
        };
      } catch (e) {
        console.warn(`[VisionAgent] Failed to parse JSON from vision model. Fallback to raw text.`);
        state.visionData = {
          status: response.text.toUpperCase().includes('PASS') ? 'PASS' : 'FAIL',
          reason: response.text
        };
      }
      
    } catch (error) {
      console.error(`[VisionAgent] QA Failed:`, error);
      // We don't want to block the entire job just because QA failed or timed out
      state.visionData = { status: 'FAIL', reason: 'Vision model request failed.' };
    }

    return state;
  }
}

export const visionAgent = new VisionAgent();
