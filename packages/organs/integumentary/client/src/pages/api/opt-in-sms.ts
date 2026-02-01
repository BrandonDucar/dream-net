export default async function handler(req: any, res: any) {
  const { phone } = req.body;

  if (!phone) return res.status(400).json({ error: 'Missing phone number' });

  // Save to DB or external list
  console.log(`📲 New SMS opt-in: ${phone}`);

  // Could store in Supabase, Firestore, etc.
  res.status(200).json({ success: true });
}