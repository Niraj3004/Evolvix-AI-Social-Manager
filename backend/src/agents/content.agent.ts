import { gateway } from '../config/ai';
import { BaseAgent, AgentState } from './base.agent';

export class ContentAgent extends BaseAgent {
  constructor() {
    super('ContentAgent', ['gatewayChat']);
  }

  async execute(state: AgentState): Promise<AgentState> {
    const systemPrompt = this.buildSystemPrompt(state.platform);
    
    const userPrompt = `
Context about our brand and products:
${state.researchData?.context || 'No specific brand context available.'}

Strategy Angle: ${state.strategyData?.angle || ''}
Target Emotion: ${state.strategyData?.emotion || ''}
Suggested Hook: ${state.strategyData?.primaryHook || ''}

Topic to post about:
${state.topic}

Please generate the content now. Provide the output in JSON format with the following keys: 'caption', 'hooks' (array of strings), 'hashtags' (array of strings), and 'script' (if applicable, or empty string).`;

    const response = await gateway.chat(state.orgId, [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    let parsedContent;
    try {
      const cleanText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedContent = JSON.parse(cleanText);
    } catch (e) {
      parsedContent = {
        caption: response.text,
        hooks: [],
        hashtags: [],
        script: ''
      };
    }

    state.contentData = parsedContent;
    return state;
  }

  private buildSystemPrompt(platform: string): string {
    const basePrompt = `You are an expert social media content creator and strategist. Your goal is to create highly engaging, on-brand content tailored perfectly to the specific platform. You must output valid JSON.`;

    switch (platform.toLowerCase()) {
      case 'linkedin':
        return `${basePrompt}\nFor LinkedIn: Write in a professional, thought-leadership tone. Use short paragraphs with line breaks for readability. Emojis should be used sparingly and professionally. Focus on value, insights, and career/business growth. Avoid more than 3-5 hashtags.`;
      
      case 'instagram':
        return `${basePrompt}\nFor Instagram: Write visually descriptive, engaging captions. Use emojis heavily to break up text and add personality. Include a strong Call To Action (CTA) like "Link in bio" or "Save this post". Provide exactly 10-15 highly relevant hashtags at the bottom.`;
      
      case 'twitter':
      case 'x':
        return `${basePrompt}\nFor Twitter/X: Write short, punchy, conversational content. You must include a very strong hook in the first line. Keep the entire caption under 280 characters if possible. Use 1-2 hashtags maximum.`;
      
      default:
        return `${basePrompt}\nTailor the content for the ${platform} platform, keeping its general audience and formatting conventions in mind.`;
    }
  }
}

export const contentAgent = new ContentAgent();
