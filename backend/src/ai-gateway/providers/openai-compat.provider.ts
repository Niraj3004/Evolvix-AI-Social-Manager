import { LLMMessage, LLMOptions, LLMProvider, LLMResponse, LLMEmbedResponse } from '../interfaces';

export class OpenAICompatProvider implements LLMProvider {
  public id: string;
  public modelName: string;
  
  private baseUrl: string;
  private apiKey: string;
  private defaultOptions: LLMOptions;

  constructor(
    id: string,
    baseUrl: string,
    apiKey: string,
    modelName: string,
    defaultOptions: LLMOptions = {}
  ) {
    this.id = id;
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = apiKey;
    this.modelName = modelName;
    this.defaultOptions = defaultOptions;
  }

  async chat(messages: LLMMessage[], opts?: LLMOptions): Promise<LLMResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.modelName,
        messages,
        temperature: opts?.temperature ?? this.defaultOptions.temperature ?? 0.7,
        max_tokens: opts?.maxTokens ?? this.defaultOptions.maxTokens ?? 1000,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`[${this.id}] Chat request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return {
      text: data.choices?.[0]?.message?.content || '',
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
      model: this.modelName
    };
  }

  async embed(texts: string[]): Promise<LLMEmbedResponse> {
    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.modelName,
        input: texts,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`[${this.id}] Embed request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    // Sort embeddings by index to ensure order matches input
    const embeddings = data.data
      .sort((a: any, b: any) => a.index - b.index)
      .map((item: any) => item.embedding);

    return {
      embeddings,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
      model: this.modelName
    };
  }
}
