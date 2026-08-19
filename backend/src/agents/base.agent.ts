export interface AgentState {
  orgId: string;
  brandId: string;
  topic: string;
  platform: string;
  researchData?: any;
  strategyData?: any;
  contentData?: any;
  designData?: any;
  visionData?: {
    status: 'PASS' | 'FAIL';
    reason: string;
  };
  [key: string]: any;
}

export abstract class BaseAgent {
  public name: string;
  public allowedTools: string[];

  constructor(name: string, allowedTools: string[] = []) {
    this.name = name;
    this.allowedTools = allowedTools;
  }

  abstract execute(state: AgentState): Promise<AgentState>;
}
