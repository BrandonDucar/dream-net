import { Request, Response } from 'express';

// This gets all forks (remixes) tied to a specific bounty ID

export default async function handler(req: Request, res: Response) {
  const { bountyId } = req.query;

  // Mock implementation - replace with actual database query when connected
  const mockForks = [
    {
      id: 'cure-001',
      title: 'Neural Pathway Restoration Protocol',
      creator: '0xabcd1234567890ef',
      bountyId: bountyId,
      timestamp: Date.now() - 3600000
    },
    {
      id: 'cure-002', 
      title: 'Nightmare Loop Terminator',
      creator: '0xef1234567890abcd',
      bountyId: bountyId,
      timestamp: Date.now() - 1800000
    }
  ];

  // When database is connected, use: 
  // const forks = await db.collection('dreams').find({
  //   bountyId: bountyId
  // }).sort({ timestamp: -1 }).toArray();

  res.json(mockForks);
}