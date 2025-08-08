export type EchoScanResult = {
  walletAddress: string;
  score: number;
  trustLevel: 'low' | 'moderate' | 'high';
  unlockedAgents: string[];
  message: string;
};

export async function echoScan(walletAddress: string): Promise<EchoScanResult> {
  // Simulated scoring logic — upgrade later with real on-chain data
  const normalized = walletAddress.toLowerCase();
  const endsIn7 = normalized.endsWith('7');
  const startsWith0x4 = normalized.startsWith('0x4');

  // Simulated score
  const score = Math.floor(Math.random() * 60) + (endsIn7 ? 30 : 0) + (startsWith0x4 ? 10 : 0);
  let trustLevel: EchoScanResult['trustLevel'] = 'moderate';

  if (score >= 80) trustLevel = 'high';
  else if (score < 40) trustLevel = 'low';

  const unlockedAgents = ['LUCID', 'CANVAS', 'ROOT'];
  if (trustLevel === 'high') unlockedAgents.push('CRADLE', 'WING');
  if (trustLevel === 'low') unlockedAgents.splice(2); // restrict ROOT access

  return {
    walletAddress,
    score,
    trustLevel,
    unlockedAgents,
    message: `ECHO scanned wallet and rated it ${trustLevel.toUpperCase()} (${score})`
  };
}