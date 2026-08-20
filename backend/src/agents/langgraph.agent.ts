import { BaseAgent, AgentState } from './base.agent';
import { StateGraph, START, END, Annotation } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';

// Define the state for the LangGraph
const GraphState = Annotation.Root({
  topic: Annotation<string>(),
  platform: Annotation<string>(),
  brandContext: Annotation<string>(),
  strategyContext: Annotation<string>(),
  draft: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => ""
  }),
  critique: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => ""
  }),
  iterations: Annotation<number>({
    reducer: (x, y) => x + y,
    default: () => 0
  }),
  finalContent: Annotation<any>({
    reducer: (x, y) => y ?? x,
    default: () => ({})
  })
});

export class LangGraphAgent extends BaseAgent {
  private llm: ChatOpenAI;

  constructor() {
    super('ContentAgent', ['langgraph']);
    this.llm = new ChatOpenAI({
      modelName: "gpt-4o-mini", // Using a faster/cheaper model for the loop
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY || ''
    });
  }

  async execute(state: AgentState): Promise<AgentState> {
    const graph = this.buildGraph();
    
    const brandContext = state.researchData?.context || 'No specific brand context available.';
    const strategyContext = `
      Angle: ${state.strategyData?.angle || ''}
      Emotion: ${state.strategyData?.emotion || ''}
      Hook: ${state.strategyData?.primaryHook || ''}
    `;

    const initialState = {
      topic: state.topic,
      platform: state.platform,
      brandContext,
      strategyContext,
      draft: "",
      critique: "",
      iterations: 0,
      finalContent: {}
    };

    console.log(`[LangGraphAgent] Starting Agentic Loop for ${state.platform}...`);
    const finalState = await graph.invoke(initialState);
    
    state.contentData = finalState.finalContent;
    return state;
  }

  private buildGraph() {
    const builder = new StateGraph(GraphState)
      .addNode("writer", this.writerNode.bind(this))
      .addNode("critic", this.criticNode.bind(this))
      .addNode("editor", this.editorNode.bind(this))
      .addEdge(START, "writer")
      .addEdge("writer", "critic")
      .addConditionalEdges("critic", (state) => {
        // If the critic says it's perfect or we hit 2 iterations, go to editor to format
        if (state.critique.includes("APPROVED") || state.iterations >= 2) {
          return "editor";
        }
        return "writer"; // rewrite
      }, {
        "editor": "editor",
        "writer": "writer"
      })
      .addEdge("editor", END);

    return builder.compile();
  }

  private async writerNode(state: typeof GraphState.State) {
    console.log(`[LangGraphAgent] Writer Node (Iteration ${state.iterations + 1})`);
    
    let prompt = `You are an expert social media content writer for ${state.platform}.
Brand Context: ${state.brandContext}
Strategy: ${state.strategyContext}
Topic: ${state.topic}
`;

    if (state.critique && !state.critique.includes("APPROVED")) {
      prompt += `\nYour previous draft was rejected. Here is the critic's feedback:\n${state.critique}\n\nPlease rewrite the content based on this feedback.`;
    } else {
      prompt += `\nPlease write a highly engaging draft for this post.`;
    }

    const response = await this.llm.invoke([
      new SystemMessage("You are an expert content writer."),
      new HumanMessage(prompt)
    ]);

    return {
      draft: response.content.toString(),
      iterations: 1 // increment by 1
    };
  }

  private async criticNode(state: typeof GraphState.State) {
    console.log(`[LangGraphAgent] Critic Node`);
    
    const prompt = `You are a strict Social Media Manager and Editor-in-Chief.
Review the following draft for ${state.platform}.
Brand Context: ${state.brandContext}

Draft:
${state.draft}

Critique the draft based on engagement, hook strength, and platform fit.
If it is perfect and ready to publish, respond with exactly "APPROVED".
If it needs work, provide specific, actionable feedback for the writer to fix it.`;

    const response = await this.llm.invoke([
      new SystemMessage("You are a strict, high-standard Social Media Editor."),
      new HumanMessage(prompt)
    ]);

    return {
      critique: response.content.toString()
    };
  }

  private async editorNode(state: typeof GraphState.State) {
    console.log(`[LangGraphAgent] Editor Node (Finalizing JSON)`);
    
    const prompt = `Convert the following approved draft into a strict JSON format.
The JSON must have exactly these keys:
- 'caption' (string): The main body text.
- 'hooks' (array of strings): 2-3 engaging opening lines.
- 'hashtags' (array of strings): 5-10 relevant hashtags.
- 'script' (string): Empty string.

Draft:
${state.draft}

Return ONLY valid JSON, no markdown formatting.`;

    const response = await this.llm.invoke([
      new SystemMessage("You are a JSON formatter."),
      new HumanMessage(prompt)
    ]);

    let parsedContent;
    try {
      const cleanText = response.content.toString().replace(/```json/g, '').replace(/```/g, '').trim();
      parsedContent = JSON.parse(cleanText);
    } catch (e) {
      parsedContent = {
        caption: state.draft,
        hooks: [],
        hashtags: [],
        script: ''
      };
    }

    return {
      finalContent: parsedContent
    };
  }
}

export const contentAgent = new LangGraphAgent();
