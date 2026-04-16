import { sendDreamCallSMS } from '../lib/sms';

// Example usage of SMS integration
export async function triggerDreamEvolution(phoneNumber: string, dreamId: string) {
  try {
    await sendDreamCallSMS(phoneNumber, dreamId, 'You\'ve hit 3 remixes. Ready to evolve?');
    console.log(`📱 Dream evolution SMS sent to ${phoneNumber} for dream ${dreamId}`);
  } catch (error) {
    console.error('SMS sending failed:', error);
  }
}

// Demo function showing how to integrate with dream system
export async function sendDreamNotifications() {
  // Example: Send notifications for active dreams
  const testPhone = '+15555555555';
  
  await triggerDreamEvolution(testPhone, 'dream047');
  
  // Other notification types
  await sendDreamCallSMS(testPhone, 'dream048', 'Your dream scored 85/100. Share it?');
  await sendDreamCallSMS(testPhone, 'dream049', 'New collaboration request from @bd420chef');
}