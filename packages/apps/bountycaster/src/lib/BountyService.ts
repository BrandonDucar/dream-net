export interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: string;
  status: 'researching' | 'ready' | 'verifying' | 'completed';
  author: string;
  castHash?: string;
  findings?: string[];
}

export class BountyService {
  private static mockBounties: Bounty[] = [
    { 
      id: '1',
      title: "Fix logic error in @dreamnet-core/PrismGuard", 
      description: "Identify why the secret scanner misses certain nested JSON patterns.",
      reward: "0.5 ETH", 
      status: "researching", 
      author: "@brandon",
      findings: ["Pattern missed in array of objects", "RegEx needs lookbehind support"]
    },
    { 
      id: '2',
      title: "Optimize Whisper.cpp inference for Edge agents", 
      description: "Reduce memory footprint on 8GB RAM machines using 4-bit quantization.",
      reward: "0.25 ETH", 
      status: "ready", 
      author: "@jd" 
    },
    { 
      id: '3',
      title: "Implement Farcaster MiniAppProvider context hooks", 
      description: "Expose user custody address and channel context to child components.",
      reward: "1,200 $VIRTUAL", 
      status: "verifying", 
      author: "@davis" 
    },
  ];

  static async getBounties(): Promise<Bounty[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.mockBounties];
  }

  static async extractBountyFromCast(castHash: string): Promise<Bounty> {
    console.log(`[BountyCaster] AI analyzing cast: ${castHash}`);
    // This is where Neynar + LLM logic will go
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newBounty: Bounty = {
      id: Math.random().toString(36).substr(2, 9),
      title: "New AI Extracted Mission",
      description: "Automatically analyzed from Farcaster thread. Research pending.",
      reward: "TBD",
      status: 'researching',
      author: "AI-Extraction-Node-1",
      castHash
    };
    
    return newBounty;
  }
}
