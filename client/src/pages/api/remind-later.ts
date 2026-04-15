import { addHours } from 'date-fns';

export default async function handler(req: any, res: any) {
  const { dreamId, userPhone } = JSON.parse(req.body);

  const remindAt = addHours(new Date(), 4); // ⏰ 4 hours from now

  // In production: 
  // await db.reminders.create({
  //   data: {
  //     dreamId,
  //     userPhone,
  //     remindAt,
  //     status: 'pending',
  //   },
  // });

  console.log(`⏰ Reminder logged for ${dreamId} at ${remindAt}`);
  res.status(200).json({ success: true, remindAt: remindAt.toISOString() });
}