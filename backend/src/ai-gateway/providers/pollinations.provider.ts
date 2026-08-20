import { LLMProvider, LLMMessage, LLMResponse, LLMEmbedResponse } from '../interfaces';
import cloudinary from '../../config/cloudinary';

export class PollinationsProvider implements LLMProvider {
  id = 'pollinations';
  modelName = 'pollinations-flux';

  constructor() {}

  async chat(messages: LLMMessage[], opts?: any): Promise<LLMResponse> {
    throw new Error('PollinationsProvider is configured for Image Generation only in this system.');
  }

  async embed(texts: string[]): Promise<LLMEmbedResponse> {
    throw new Error('PollinationsProvider is configured for Image Generation only in this system.');
  }

  async generateImage(prompt: string): Promise<string> {
    try {
      const seed = Math.floor(Math.random() * 1000000);
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true&seed=${seed}&width=1080&height=1350`;
      
      const response = await fetch(url);

      if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`Pollinations Image generation failed: ${response.status} - ${errorText}`);
      }

      // Pollinations returns the raw image binary
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Cloudinary to get a persistent URL for the Template Engine
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'evolvix/ai-images' },
          (error, result) => {
            if (error) return reject(error);
            if (result) return resolve(result.secure_url);
            reject(new Error('Cloudinary upload failed with no result'));
          }
        );
        uploadStream.end(buffer);
      });

    } catch (error: any) {
      throw new Error(`[pollinations] Image generation failed: ${error.message}`);
    }
  }
}
