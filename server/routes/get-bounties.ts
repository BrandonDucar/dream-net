// Mock bounty data with team members
const mockBounties = [
  {
    dreamId: 'nightmare-001',
    reward: 250,
    note: 'Critical corruption in neural pathways. Need experienced Dream Team to restore functionality.',
    wallet: '0x1234567890abcdef',
    timestamp: Date.now() - 86400000,
    resolved: false,
    team: [
      { wallet: '0xabcd1234567890ef', joinedAt: Date.now() - 3600000 },
      { wallet: '0xef1234567890abcd', joinedAt: Date.now() - 1800000 }
    ]
  },
  {
    dreamId: 'nightmare-002', 
    reward: 150,
    note: 'Recursive loop causing infinite nightmare cycles. Urgent intervention required.',
    wallet: '0xabcdef1234567890',
    timestamp: Date.now() - 43200000,
    resolved: false,
    team: [
      { wallet: '0x567890abcdef1234', joinedAt: Date.now() - 7200000 }
    ]
  },
  {
    dreamId: 'nightmare-003',
    reward: 500,
    note: 'Complete system breakdown. High reward for successful restoration to stable dream state.',
    wallet: '0x9876543210fedcba',
    timestamp: Date.now() - 172800000,
    resolved: false,
    team: []
  }
];

export default async function handler(req: any, res: any) {
  // Mock implementation - in production: const bounties = await db.collection('bounties').find({ resolved: false }).sort({ timestamp: -1 }).toArray();
  res.json(mockBounties);
}