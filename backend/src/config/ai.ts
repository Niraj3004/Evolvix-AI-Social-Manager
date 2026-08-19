import { env } from './env.config';
import { AIGateway, OpenAICompatProvider } from '../ai-gateway';

// Initialize providers
// Groq (fast chat, free)
export const groqProvider = new OpenAICompatProvider(
  'groq',
  'https://api.groq.com/openai/v1',
  env.GROQ_API_KEY || '',
  'llama3-8b-8192'
);

// Gemini (chat + vision + embeddings, free)
// Note: Google supports OpenAI compatible endpoints via v1beta/openai
export const geminiProvider = new OpenAICompatProvider(
  'gemini',
  'https://generativelanguage.googleapis.com/v1beta/openai',
  env.GEMINI_API_KEY || '',
  'gemini-1.5-flash' // or 'gemini-1.5-pro' depending on needs
);

// OpenRouter (fallback/variety, optionally paid)
export const openRouterProvider = new OpenAICompatProvider(
  'openrouter',
  'https://openrouter.ai/api/v1',
  env.OPENROUTER_API_KEY || '',
  'anthropic/claude-3-haiku:beta' // fallback example
);

// OpenAI (specifically for image generation via dall-e-3)
export const openAiProvider = new OpenAICompatProvider(
  'openai',
  'https://api.openai.com/v1',
  env.OPENAI_API_KEY || '',
  'dall-e-3'
);

// Determine order based on compute mode
let providerOrder = [];
if (env.AI_COMPUTE_MODE === 'GPU') {
  // GPU mode prioritizes heavy/variety models
  providerOrder = [openRouterProvider, geminiProvider, groqProvider];
} else {
  // CPU mode prioritizes fast/free models
  providerOrder = [groqProvider, geminiProvider, openRouterProvider];
}

// Instantiate global gateway with OpenAI exclusively for images
export const gateway = new AIGateway(providerOrder, [openAiProvider]);
