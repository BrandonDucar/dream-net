interface Dream {
  id: string;
  title?: string;
  name?: string;
  createdByAgent?: string;
}

interface WalletScore {
  score: number;
  trustLevel: string;
  unlockedAgents: string[];
}

// Fetch wallet score from /echo-score endpoint
export const getWalletScore = async (wallet: string): Promise<WalletScore | null> => {
  try {
    const response = await fetch('/api/echo-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet })
    });
    
    const data = await response.json();
    return data.success ? data : null;
  } catch (error) {
    console.error('Failed to fetch wallet score:', error);
    return null;
  }
};

// Filter dreams based on wallet access level using your exact pattern
export const filterDreamsByWalletAccess = async (
  dreams: Dream[], 
  wallet: string | null | undefined,
  walletProvided: boolean = false
): Promise<Dream[]> => {
  if (!walletProvided || !wallet) {
    return dreams;
  }

  const score = await getWalletScore(wallet);
  if (!score) {
    return dreams;
  }

  const unlockedAgents = score.score >= 80 ? ['LUCID', 'CANVAS', 'ROOT', 'ECHO', 'CRADLE', 'WING']
                       : score.score >= 50 ? ['LUCID', 'CANVAS', 'ROOT', 'ECHO']
                       : ['LUCID', 'CANVAS'];

  return dreams.filter(d => 
    !d.createdByAgent || unlockedAgents.includes(d.createdByAgent)
  );
};

// Generate score data from wallet score
export const generateScoreData = (score: number) => {
  let trustLevel: 'Low' | 'Medium' | 'High';
  let unlockedAgents: string[];

  if (score >= 80) {
    trustLevel = 'High';
    unlockedAgents = ['LUCID', 'CANVAS', 'ROOT', 'ECHO', 'CRADLE', 'WING'];
  } else if (score >= 50) {
    trustLevel = 'Medium';
    unlockedAgents = ['LUCID', 'CANVAS', 'ROOT', 'ECHO'];
  } else {
    trustLevel = 'Low';
    unlockedAgents = ['LUCID', 'CANVAS'];
  }

  return { score, trustLevel, unlockedAgents };
};