export class LLM {
  private model: string;

  constructor(model: string) {
    this.model = model;
  }

  async call(prompt: string) {
    return `LLM: ${this.model} called with prompt: ${prompt}`;
  }
}

export default LLM;
