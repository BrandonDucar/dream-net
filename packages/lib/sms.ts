import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

export async function sendDreamCallSMS(to: string, dreamId: string, prompt: string) {
  const body = `📞 Your Dream (${dreamId}) is calling:\n"${prompt}"\n\nReply YES to engage, LATER to reschedule, or STOP to end.`;

  return await client.messages.create({
    body,
    from: process.env.TWILIO_NUMBER,
    to,
  });
}