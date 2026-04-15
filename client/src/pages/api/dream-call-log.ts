// Temporary mock DB
const dreamCallLog = [
  {
    dreamId: 'dream001',
    prompt: 'You just hit 5 remixes. Ready to evolve?',
    timestamp: Date.now() - 86400000,
    response: 'yes',
  },
  {
    dreamId: 'dream007',
    prompt: 'Momentum rising! You\'re going viral. Ready?',
    timestamp: Date.now() - 7200000,
    response: null,
  },
];

export default async function handler(req: any, res: any) {
  res.status(200).json(dreamCallLog);
}