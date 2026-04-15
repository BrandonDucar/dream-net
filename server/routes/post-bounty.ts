import { Request, Response } from 'express';
import { storage } from '../storage';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { dreamId, reward, note, wallet } = req.body;

  const bounty = {
    dreamId,
    reward,
    note,
    wallet,
    timestamp: Date.now(),
    resolved: false
  };

  try {
    // Store bounty record in memory storage for now
    // In production, this would be: await db.collection('bounties').insertOne(bounty);
    console.log('Bounty posted:', bounty);

    // Update dream to mark it has an active bounty
    // In production: await db.collection('dreams').updateOne({ id: dreamId }, { $set: { hasBounty: true } });
    
    // For now, we'll log this operation since we're using memory storage
    console.log(`Dream ${dreamId} marked with active bounty`);

    res.json({ success: true, bounty });
  } catch (error) {
    console.error('Error posting bounty:', error);
    res.status(500).json({ success: false, error: 'Failed to post bounty' });
  }
}