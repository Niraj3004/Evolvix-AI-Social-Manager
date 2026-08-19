export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
}

export interface LLMEmbedResponse {
  embeddings: number[][]; // Array of vectors
  usage: {
    promptTokens: number;
    totalTokens: number;
  };
  model: string;
}

export interface LLMProvider {
  id: string; // Identifier for the provider instance
  modelName: string; // Internal or user-facing name

  chat(messages: LLMMessage[], opts?: LLMOptions): Promise<LLMResponse>;
  embed(texts: string[]): Promise<LLMEmbedResponse>;
}
