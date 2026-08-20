import { BaseAgent, AgentState } from './base.agent';
import { gateway } from '../config/ai';

export class DesignAgent extends BaseAgent {
  constructor() {
    super('DesignAgent', ['gatewayChat']);
  }

  async execute(state: AgentState): Promise<AgentState> {
    // Get the visual concepts from StrategyAgent
    const visualConcept = state.strategyData?.visual_concept || 'Professional layout';
    const visualVibe = state.strategyData?.visual_vibe || 'Clean';

    // Get scraped trending styles from TrendAgent
    const trendingColors = state.trendData?.primary_colors || 'brand colors';
    const trendingFont = state.trendData?.font_style || 'modern font';
    const trendingLayout = state.trendData?.layout_composition || 'clean layout';
    const trendingVibe = state.trendData?.vibe || visualVibe;

    const prompt = `You are an expert Social Media Art Director.
    
    The brand industry is: ${state.brandData?.industry || 'Unknown'}.
    The topic is: ${state.topic}.
    The overall vibe should be: ${visualVibe}.
    
    We have scraped trending designs for this industry. The current trends dictate:
    - Primary Colors: ${trendingColors}
    - Font Style: ${trendingFont}
    - Layout Composition: ${trendingLayout}
    - Aesthetic Vibe: ${trendingVibe}

    We need to create a visual for this post.
    Decide whether we should use a standard SVG template ('USE_TEMPLATE') or if we should generate a highly stylized AI image using FLUX ('GENERATE_VISUAL').
    
    If 'GENERATE_VISUAL', write an incredibly detailed text-to-image prompt for a photorealistic or high-end 3D marketing graphic, incorporating the exact trending colors (${trendingColors}) and styles (${trendingLayout}). Do not include text in the prompt unless it's a massive 3D typography hook.
    
    Output JSON with exact keys:
    - "action" (must be "USE_TEMPLATE" or "GENERATE_VISUAL")
    - "reason" (string explaining choice)
    - "prompt" (the image generation prompt, if GENERATE_VISUAL)
    `;

    // If the user provided a highly detailed topic/prompt, force GENERATE_VISUAL
    if (state.topic && state.topic.length > 150) {
      state.designData = {
        action: "GENERATE_VISUAL",
        reason: "User provided a detailed prompt",
        prompt: state.topic
      };
      return state;
    }

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
