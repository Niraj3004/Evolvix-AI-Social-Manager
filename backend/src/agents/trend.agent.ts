import { BaseAgent, AgentState } from './base.agent';
import { scraperService } from '../services/scraper.service';
import { gateway } from '../config/ai';

export class TrendAgent extends BaseAgent {
  constructor() {
    super('TrendAgent', ['gatewayChat']);
  }

  async execute(state: AgentState): Promise<AgentState> {
    const industry = state.brandData?.industry || 'Business';
    const topic = state.topic || 'marketing';
    
    // 1. Form a search query
    const query = `${industry} ${topic} poster design modern`;
    console.log(`[TrendAgent] Initiating Pinterest scrape for query: "${query}"`);

    // 2. Scrape top Pinterest images
    const imageUrls = await scraperService.getPinterestImages(query, 4);

    if (imageUrls.length === 0) {
      console.warn('[TrendAgent] Scraper returned no images. Falling back to default styles.');
      state.trendData = {
        primary_colors: '#000000, #FFFFFF',
        font_style: 'Bold, modern sans-serif',
        layout_composition: 'Clean, minimalist',
        vibe: 'Professional'
      };
      return state;
    }

    console.log(`[TrendAgent] Found ${imageUrls.length} images. Handing to Vision AI...`);

    // 3. Format message for Vision LLM (Gemini 1.5)
    // We send a complex prompt with the image URLs
    const contentArray: any[] = [
      { 
        type: 'text', 
        text: 'You are a Pinterest Trend Analyzer. Analyze these trending social media poster designs. Extract the exact dominant hex colors, typography styles, layout composition, and overall vibe. You MUST respond with ONLY a raw JSON object and nothing else. No markdown formatting, no intro text like "Here is". Just the raw JSON object.\n\nExample Output:\n{"primary_colors": "#121212, #FF0055", "font_style": "Bold italic sans-serif", "layout_composition": "Text heavy with diagonal cuts", "vibe": "Aggressive, high-energy"}' 
      }
    ];

    for (const url of imageUrls) {
      contentArray.push({
        type: 'image_url',
        image_url: { url }
      });
    }

    try {
      // 4. Send to Gemini (which handles image_url natively in our provider)
      const response = await gateway.chat(state.orgId, [{ role: 'user', content: contentArray }]);
      
      const cleanJson = response.text.replace(/```json|```/g, '').trim();
      const trendAnalysis = JSON.parse(cleanJson);
      
      console.log(`[TrendAgent] Vision Analysis Complete: ${JSON.stringify(trendAnalysis)}`);
      state.trendData = trendAnalysis;
    } catch (error) {
      console.error('[TrendAgent] Vision AI failed to analyze images:', error);
      // Fallback
      state.trendData = {
        primary_colors: '#000000, #FFFFFF',
        font_style: 'Bold, modern sans-serif',
        layout_composition: 'Clean, minimalist',
        vibe: 'Professional'
      };
    }

    return state;
  }
}

export const trendAgent = new TrendAgent();
