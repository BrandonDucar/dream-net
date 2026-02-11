export default async function handler(req: any, res: any) {
  const incoming = req.body.Body.trim().toLowerCase();
  const from = req.body.From;

  if (incoming === 'yes') {
    console.log(`✅ Dream agent triggered for ${from}`);
    // Trigger agent, update DB, etc.
  } else if (incoming === 'later') {
    console.log(`⏰ Reschedule request from ${from}`);
    // Log for reminder system
  } else if (incoming === 'stop') {
    console.log(`❌ Unsubscribed: ${from}`);
    // Remove from SMS list
  } else {
    console.log(`🤖 Unknown reply from ${from}: ${incoming}`);
  }

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send('<Response></Response>');
}