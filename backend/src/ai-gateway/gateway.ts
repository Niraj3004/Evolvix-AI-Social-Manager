import crypto from 'crypto';
import { LLMMessage, LLMOptions, LLMProvider, LLMResponse, LLMEmbedResponse } from './interfaces';
import { redis } from '../config/redis';
import { prisma } from '../config/db';

export class AIGateway {
  private providers: LLMProvider[];
  private imageProviders: LLMProvider[];

  constructor(providers: LLMProvider[], imageProviders?: LLMProvider[]) {
    if (providers.length === 0) {
      throw new Error("AIGateway requires at least one provider");
    }
    this.providers = providers;
    this.imageProviders = imageProviders && imageProviders.length > 0 ? imageProviders : providers;
  }

  private hashRequest(type: 'chat' | 'embed', input: any, opts?: any): string {
    const data = JSON.stringify({ type, input, opts });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  async chat(orgId: string, messages: LLMMessage[], opts?: LLMOptions): Promise<LLMResponse> {
    const cacheKey = `aigateway:chat:${this.hashRequest('chat', messages, opts)}`;
    
    // 1. Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as LLMResponse;
    }

    // 2. Try providers in turn
    let lastError: Error | null = null;
    for (const provider of this.providers) {
      try {
        const response = await provider.chat(messages, opts);
        
        // Save to cache (TTL 24 hours)
        await redis.set(cacheKey, JSON.stringify(response), 'EX', 86400);
        
        // 3. Record usage asynchronously
        this.recordUsage(orgId, response.model, response.usage.totalTokens, 0).catch(console.error);
        
        return response;
      } catch (error: any) {
        console.warn(`Provider ${provider.id} failed: ${error.message}. Failing over...`);
        lastError = error;
      }
    }

    throw new Error(`All LLM providers failed. Last error: ${lastError?.message}`);
  }

  async embed(orgId: string, texts: string[]): Promise<LLMEmbedResponse> {
    const cacheKey = `aigateway:embed:${this.hashRequest('embed', texts)}`;
    
    // 1. Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as LLMEmbedResponse;
    }

    // 2. Try providers in turn
    let lastError: Error | null = null;
    for (const provider of this.providers) {
      try {
        const response = await provider.embed(texts);
        
        // Save to cache (TTL 7 days for embeddings as they are static)
        await redis.set(cacheKey, JSON.stringify(response), 'EX', 604800);
        
        // 3. Record usage asynchronously
        this.recordUsage(orgId, response.model, response.usage.totalTokens, 0).catch(console.error);
        
        return response;
      } catch (error: any) {
        console.warn(`Provider ${provider.id} failed for embedding: ${error.message}. Failing over...`);
        lastError = error;
      }
    }

    throw new Error(`All LLM providers failed for embedding. Last error: ${lastError?.message}`);
  }

  async generateImage(orgId: string, prompt: string): Promise<string> {
    const cacheKey = `aigateway:image:${this.hashRequest('embed', prompt)}`;
    
    // 1. Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 2. Try providers in turn
    let lastError: Error | null = null;
    for (const provider of this.imageProviders) {
      if (!provider.generateImage) continue;

      try {
        console.log(`[AIGateway] Generating image via ${provider.id}...`);
        const url = await provider.generateImage(prompt);
        
        // Save to cache (TTL 24 hours)
        await redis.set(cacheKey, url, 'EX', 86400);
        
        // 3. Record usage asynchronously (arbitrary 1 unit cost for image)
        this.recordUsage(orgId, provider.modelName, 0, 0.05).catch(console.error);
        
        return url;
      } catch (error: any) {
        console.error(`Provider ${provider.id} failed for image gen:`, error.message);
        lastError = error;
      }
    }

    const errorMessage = lastError 
      ? `All image providers failed. Last error: ${lastError.message}` 
      : `No image providers configured.`;
    console.error(`[AIGateway] ${errorMessage}`);
    throw new Error(errorMessage);
  }

  private async recordUsage(orgId: string, model: string, tokens: number, cost: number) {
    try {
      await prisma.aiUsage.create({
        data: {
          orgId,
          model,
          tokens,
          cost
        }
      });
    } catch (error) {
      console.error(`Failed to record AI usage for org ${orgId}:`, error);
    }
  }
}
