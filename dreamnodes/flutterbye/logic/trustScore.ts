import { getWalletData } from '../../../shared/wallet';
import { FLUTTERBY_NODE } from '../node.config';

export interface TrustValidation {
  valid: boolean;
  score: number;
  level: string;
  reasons: string[];
}

export async function validateTrustScore(walletAddress: string): Promise<TrustValidation> {
  try {
    const walletData = getWalletData(walletAddress);
    
    if (!walletData) {
      return {
        valid: false,
        score: 0,
        level: 'Unknown',
        reasons: ['Wallet not found in system']
      };
    }

    const reasons: string[] = [];
    let adjustedScore = walletData.trustScore;

    // Trust score adjustments based on activity
    if (Number(walletData.tokens.FLBY) >= 1000) {
      adjustedScore += 5;
      reasons.push('High FLBY token balance bonus');
    }

    if (Number(walletData.tokens.SHEEP) >= 500) {
      adjustedScore += 3;
      reasons.push('Substantial SHEEP holdings bonus');
    }

    // Activity bonuses (mock data for now)
    const recentActivity = Math.random() > 0.5;
    if (recentActivity) {
      adjustedScore += 2;
      reasons.push('Recent network activity bonus');
    }

    // Penalty for low engagement
    if (Number(walletData.tokens.FLBY) < 100 && Number(walletData.tokens.SHEEP) < 50) {
      adjustedScore -= 10;
      reasons.push('Low token engagement penalty');
    }

    const finalScore = Math.max(0, Math.min(100, adjustedScore));
    
    return {
      valid: finalScore >= FLUTTERBY_NODE.trustBoundary,
      score: finalScore,
      level: getTrustLevel(finalScore),
      reasons
    };

  } catch (error) {
    return {
      valid: false,
      score: 0,
      level: 'Error',
      reasons: ['Failed to validate trust score']
    };
  }
}

function getTrustLevel(score: number): string {
  if (score >= 95) return 'Legendary';
  if (score >= 85) return 'Master';
  if (score >= 75) return 'Advanced';
  if (score >= 65) return 'Trusted';
  if (score >= 50) return 'Emerging';
  if (score >= 30) return 'Novice';
  return 'Unverified';
}

export function calculateMessageTrustImpact(
  messageContent: string,
  tokenAmount: number,
  recipientTrust: number
): number {
  let impact = 0;

  // Positive content analysis (simplified)
  if (messageContent.includes('thank') || messageContent.includes('great')) {
    impact += 1;
  }

  // Token generosity
  if (tokenAmount >= 100) {
    impact += 2;
  } else if (tokenAmount >= 50) {
    impact += 1;
  }

  // Recipient trust bonus
  if (recipientTrust >= 80) {
    impact += 1;
  }

  return Math.min(5, impact); // Cap at +5 trust
}