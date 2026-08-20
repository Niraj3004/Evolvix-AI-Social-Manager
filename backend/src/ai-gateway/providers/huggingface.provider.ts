import { LLMProvider, LLMMessage, LLMResponse, LLMEmbedResponse } from '../interfaces';
import cloudinary from '../../config/cloudinary';

export class HuggingFaceProvider implements LLMProvider {
  id = 'huggingface';
  modelName = 'black-forest-labs/FLUX.1-schnell';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(messages: LLMMessage[], opts?: any): Promise<LLMResponse> {
    throw new Error('HuggingFaceProvider is configured for Image Generation only in this system.');
  }

  async embed(texts: string[]): Promise<LLMEmbedResponse> {
    throw new Error('HuggingFaceProvider is configured for Image Generation only in this system.');
  }

  async generateImage(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error(`HuggingFaceProvider requires an API key.`);
    }

    try {
      const response = await fetch(`https://api-inference.huggingface.co/models/${this.modelName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`Hugging Face Image generation failed: ${response.status} - ${errorText}`);
      }

      // HF returns the raw image binary
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
      throw new Error(`[huggingface] Image generation failed: ${error.message}`);
    }
  }
}
