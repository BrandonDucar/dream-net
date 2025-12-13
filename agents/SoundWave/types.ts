/**
 * SoundWave Agent Types
 * Creates audio content and sound generation
 */

export interface SoundWaveTask {
  generate: {
    prompt: string;
    duration?: number;
    style?: string;
  };
  remix: {
    audio: string;
    style?: string;
  };
}

export interface SoundWaveOutput {
  generate: {
    audioUrl: string;
    prompt: string;
    duration: number;
  };
  remix: {
    remixedUrl: string;
    style: string;
  };
}


