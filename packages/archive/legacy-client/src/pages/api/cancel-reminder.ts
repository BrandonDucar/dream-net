// Cancels a reminder by ID
export default async function handler(req: any, res: any) {
  const { id } = JSON.parse(req.body);
  
  // In production: await db.reminders.delete({ where: { id } });
  console.log(`🗑️ Cancelled reminder ${id}`);
  
  res.status(200).json({ success: true });
}