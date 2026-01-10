import { Router } from 'express';

const router = Router();

interface RemixSubmission {
  dreamId: string;
  wallet: string;
  remixText: string;
  tags: string[];
  components: string[];
  submitTime: number;
}

interface RemixResult {
  success: boolean;
  remixId: string;
  score: number;
  bountyAwarded: {
    token: string;
    amount: number;
    bonus: number;
  };
  status: string;
  purificationLevel: number;
}

// In-memory storage for remix submissions
const remixSubmissions: Map<string, RemixSubmission[]> = new Map();
const processedRemixes: Map<string, RemixResult> = new Map();

// POST /api/dreams/:dreamId/remix - Submit remix for infected dream
router.post('/:dreamId/remix', async (req, res) => {
  try {
    const { dreamId } = req.params;
    const { wallet, remixText, tags, components, submitTime } = req.body;

    // Validate submission
    if (!wallet || !remixText || !tags || !components) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['wallet', 'remixText', 'tags', 'components']
      });
    }

    const submission: RemixSubmission = {
      dreamId,
      wallet,
      remixText,
      tags,
      components,
      submitTime: submitTime || Date.now()
    };

    // Store submission
    if (!remixSubmissions.has(dreamId)) {
      remixSubmissions.set(dreamId, []);
    }
    remixSubmissions.get(dreamId)!.push(submission);

    // Process remix immediately for infected dreams
    const result = await processRemix(submission);
    
    res.json({
      success: true,
      submission,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to submit remix',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/dreams/:dreamId/remixes - Get all remix submissions for a dream
router.get('/:dreamId/remixes', async (req, res) => {
  try {
    const { dreamId } = req.params;
    const submissions = remixSubmissions.get(dreamId) || [];
    
    res.json({
      success: true,
      dreamId,
      submissions: submissions.map(sub => ({
        ...sub,
        result: processedRemixes.get(`${dreamId}-${sub.wallet}-${sub.submitTime}`)
      })),
      totalSubmissions: submissions.length
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch remixes',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/dreams/remix/process - Process specific remix submission
router.post('/remix/process', async (req, res) => {
  try {
    const submission: RemixSubmission = req.body;
    const result = await processRemix(submission);
    
    res.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to process remix',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Process remix submission and calculate results
async function processRemix(submission: RemixSubmission): Promise<RemixResult> {
  const { dreamId, wallet, remixText, tags, components } = submission;
  
  // Calculate remix score based on multiple factors
  let baseScore = 50;
  
  // Text quality scoring
  const textWords = remixText.split(' ').length;
  const qualityWords = ['stabilized', 'improved', 'enhanced', 'optimized', 'fixed'];
  const qualityMatches = qualityWords.filter(word => 
    remixText.toLowerCase().includes(word)
  ).length;
  
  baseScore += Math.min(textWords * 2, 20); // Up to 20 points for length
  baseScore += qualityMatches * 5; // 5 points per quality word
  
  // Tags scoring
  const relevantTags = ['defi', 'ai', 'stability', 'security', 'optimization'];
  const tagMatches = tags.filter(tag => relevantTags.includes(tag)).length;
  baseScore += tagMatches * 3;
  
  // Components scoring
  const validComponents = ['canvas', 'lucid', 'root', 'echo', 'cradle', 'wing'];
  const componentMatches = components.filter(comp => validComponents.includes(comp)).length;
  baseScore += componentMatches * 5;
  
  // Dream-specific bonuses
  if (dreamId === '7b3d') {
    if (remixText.toLowerCase().includes('portal')) baseScore += 10;
    if (remixText.toLowerCase().includes('fallback')) baseScore += 8;
    if (tags.includes('stability')) baseScore += 12;
  }
  
  // Ensure score is within bounds
  const finalScore = Math.min(Math.max(baseScore, 30), 95);
  
  // Calculate bounty based on score and dream
  let bountyAmount = 100; // Base bounty
  let bonusAmount = 0;
  
  if (finalScore >= 80) {
    bonusAmount = 200;
  } else if (finalScore >= 70) {
    bonusAmount = 150;
  } else if (finalScore >= 60) {
    bonusAmount = 100;
  }
  
  // Special bonus for dream 7b3d
  if (dreamId === '7b3d') {
    bonusAmount += 250; // Original bounty amount
  }
  
  const totalBounty = bountyAmount + bonusAmount;
  
  // Determine purification level
  let purificationLevel = 0;
  if (finalScore >= 85) purificationLevel = 100;
  else if (finalScore >= 75) purificationLevel = 80;
  else if (finalScore >= 65) purificationLevel = 60;
  else if (finalScore >= 55) purificationLevel = 40;
  else purificationLevel = 20;
  
  const result: RemixResult = {
    success: true,
    remixId: `remix-${dreamId}-${Date.now().toString(36)}`,
    score: finalScore,
    bountyAwarded: {
      token: 'SHEEP',
      amount: totalBounty,
      bonus: bonusAmount
    },
    status: purificationLevel >= 80 ? 'purified' : purificationLevel >= 60 ? 'stabilized' : 'improved',
    purificationLevel
  };
  
  // Store result
  const resultKey = `${dreamId}-${wallet}-${submission.submitTime}`;
  processedRemixes.set(resultKey, result);
  
  return result;
}

export default router;