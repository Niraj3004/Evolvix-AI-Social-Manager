import { env } from './env.config';
import { AIGateway, OpenAICompatProvider, HuggingFaceProvider, PollinationsProvider } from '../ai-gateway';

// Initialize providers
// Groq (fast chat, free)
export const groqProvider = new OpenAICompatProvider(
  'groq',
  'https://api.groq.com/openai/v1',
  env.GROQ_API_KEY || '',
  'llama-3.1-8b-instant'
);

// Gemini (chat + vision + embeddings, free)
export const geminiProvider = new OpenAICompatProvider(
  'gemini',
  'https://generativelanguage.googleapis.com/v1beta/openai',
  env.GEMINI_API_KEY || '',
  'gemini-1.5-flash' 
);

// OpenRouter (fallback/variety, optionally paid)
export const openRouterProvider = new OpenAICompatProvider(
  'openrouter',
  'https://openrouter.ai/api/v1',
  env.OPENROUTER_API_KEY || '',
  'meta-llama/llama-3.1-8b-instruct' 
);

// OpenAI (specifically for image generation via dall-e-3)
export const openAiProvider = new OpenAICompatProvider(
  'openai',
  'https://api.openai.com/v1',
  env.OPENAI_API_KEY || '',
  'dall-e-3'
);

// ChatGPT (for fast text chat & prompt generation)
export const chatGptProvider = new OpenAICompatProvider(
  'openai-chat',
  'https://api.openai.com/v1',
  env.OPENAI_API_KEY || '',
  'gpt-4o-mini'
);

// Gemini Embeddings
export const geminiEmbedProvider = new OpenAICompatProvider(
  'gemini-embed',
  'https://generativelanguage.googleapis.com/v1beta/openai',
  env.GEMINI_API_KEY || '',
  'text-embedding-004'
);

// HuggingFace (specifically for image generation via FLUX)
export const hfProvider = new HuggingFaceProvider(env.HUGGINGFACE_API_KEY || '');

// Pollinations (free, reliable fallback for image generation)
export const pollinationsProvider = new PollinationsProvider();

// Determine order based on compute mode (ChatGPT is primary for text)
let providerOrder = [];
if (env.AI_COMPUTE_MODE === 'GPU') {
  providerOrder = [chatGptProvider, openRouterProvider, geminiProvider, groqProvider, geminiEmbedProvider];
} else {
  providerOrder = [chatGptProvider, groqProvider, geminiProvider, openRouterProvider, geminiEmbedProvider];
}

// Instantiate global gateway with FLUX and Pollinations for images
export const gateway = new AIGateway(providerOrder, [hfProvider, pollinationsProvider]);
