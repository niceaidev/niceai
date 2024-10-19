
interface NiceAICoreConfig {
  databaseUrl: string
}

export class NiceAICore {
  private config: NiceAICoreConfig;

  constructor(config: NiceAICoreConfig) {
    this.config = config;
  }
}

export default NiceAICore;
