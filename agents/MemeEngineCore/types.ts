/**
 * MemeEngineCore Agent Types
 * Core orchestration engine for meme generation pipeline
 */

export interface MemeEngineCoreTask {
  generate: {
    topic: string;
    style?: string;
    platforms?: string[];
  };
  pipeline: {
    steps: string[];
    input: any;
  };
}

export interface MemeEngineCoreOutput {
  generate: {
    memes: Array<{
      text: string;
      style: string;
      platform: string;
      score: number;
    }>;
    recommended: {
      text: string;
      platform: string;
      reason: string;
    };
  };
  pipeline: {
    results: Array<{
      step: string;
      output: any;
      success: boolean;
    }>;
  };
}


