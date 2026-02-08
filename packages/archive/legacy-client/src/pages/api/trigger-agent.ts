export default async function handler(req: any, res: any) {
  const { dreamId } = JSON.parse(req.body);

  // 🔁 Call your agent spawning logic here
  console.log(`🎯 Manually triggered agent for ${dreamId}`);

  // Example: spawnAgent(dreamId)
  res.status(200).json({ success: true, message: `Agent triggered for ${dreamId}` });
}