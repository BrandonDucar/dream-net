// Dream utility functions for creating dreams with trust-based properties

interface BaseDream {
  id?: string;
  title: string;
  tags?: string[];
  remix?: boolean;
  fusion?: boolean;
  wallet?: string;
  trustScore?: number;
}

interface Dream extends BaseDream {
  isNightmare: boolean;
}

export function createDreamWithTrustScore(base: BaseDream, trustScore: number): Dream {
  const dream = {
    ...base,
    trustScore,
    isNightmare: trustScore < 40,
  };
  
  return dream;
}

export function getDreamTypeIndicator(dream: Dream): string {
  if (dream.isNightmare) return '🌙';
  if (dream.remix) return '🔄';
  if (dream.fusion) return '⚡';
  return '🧬';
}

export function getDreamTypeText(dream: Dream): string {
  if (dream.isNightmare) return 'Nightmare';
  if (dream.remix) return 'Remix';
  if (dream.fusion) return 'Fusion';
  return 'Original';
}

// Example usage:
// const baseDream = { title: "Test Dream", wallet: "0x123...", tags: ["lucid"] };
// const dream = createDreamWithTrustScore(baseDream, 30); // Creates a nightmare (trustScore < 40)