import { gateway } from '../config/ai';
import { ragService } from '../services/rag.service';

export class ContentAgent {
  async generatePlatformContent(orgId: string, brandId: string, topic: string, platform: string) {
    // 1. Retrieve Brand Context via RAG
    const ragResults = await ragService.retrieve(orgId, brandId, topic, 3);
    const contextText = ragResults.map((r: any) => r.content).join('\n---\n');

    // 2. Build Platform-Specific Prompt
    const systemPrompt = this.buildSystemPrompt(platform);
    const userPrompt = `
Context about our brand and products:
${contextText || 'No specific brand context available in memory.'}

Topic to post about:
${topic}

Please generate the content now. Provide the output in JSON format with the following keys: 'caption', 'hooks' (array of strings), 'hashtags' (array of strings), and 'script' (if applicable, or empty string).`;

    // 3. Call Gateway
    const response = await gateway.chat(orgId, [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    // 4. Return or format response
    let parsedContent;
    try {
      // Try to parse JSON if the model returns it cleanly
      const cleanText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedContent = JSON.parse(cleanText);
    } catch (e) {
      // Fallback if the model doesn't return perfect JSON
      parsedContent = {
        caption: response.text,
        hooks: [],
        hashtags: [],
        script: ''
      };
    }

    return parsedContent;
  }

  private buildSystemPrompt(platform: string): string {
    const basePrompt = `You are an expert social media content creator and strategist. Your goal is to create highly engaging, on-brand content tailored perfectly to the specific platform. You must output valid JSON.`;

    switch (platform.toLowerCase()) {
      case 'linkedin':
        return `${basePrompt}
For LinkedIn: Write in a professional, thought-leadership tone. Use short paragraphs with line breaks for readability. Emojis should be used sparingly and professionally. Focus on value, insights, and career/business growth. Avoid more than 3-5 hashtags.`;
      
      case 'instagram':
        return `${basePrompt}
For Instagram: Write visually descriptive, engaging captions. Use emojis heavily to break up text and add personality. Include a strong Call To Action (CTA) like "Link in bio" or "Save this post". Provide exactly 10-15 highly relevant hashtags at the bottom.`;
      
      case 'twitter':
      case 'x':
        return `${basePrompt}
For Twitter/X: Write short, punchy, conversational content. You must include a very strong hook in the first line. Keep the entire caption under 280 characters if possible. Use 1-2 hashtags maximum.`;
      
      default:
        return `${basePrompt}
Tailor the content for the ${platform} platform, keeping its general audience and formatting conventions in mind.`;
    }
  }
}

export const contentAgent = new ContentAgent();
