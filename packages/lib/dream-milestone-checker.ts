import { sendDreamCallSMS } from'./sms.js';

export async function checkDreamMilestones(dream: any, userPhone: string) {
  const { views, remixes, evolutionPath, viralityMetrics } = dream;

  if (remixes >= 5 && !dream.flags?.calledOnRemix5) {
    await sendDreamCallSMS(userPhone, dream.id, "Your dream just hit 5 remixes. Evolution time?");
    // Flag this milestone as triggered
    dream.flags = { ...dream.flags, calledOnRemix5: true };
  }

  if (views >= 1000 && !dream.flags?.calledOnViews1k) {
    await sendDreamCallSMS(userPhone, dream.id, "1,000 views. People are watching. Time to lead?");
    dream.flags = { ...dream.flags, calledOnViews1k: true };
  }

  if (viralityMetrics?.currentTrend === "ascending" && !dream.flags?.calledOnVirality) {
    await sendDreamCallSMS(
      userPhone,
      dream.id,
      "You're going viral. Strike now while it's hot.",
    );
    dream.flags = { ...dream.flags, calledOnVirality: true };
  }

  if (evolutionPath?.generationLevel >= 3 && !dream.flags?.calledOnEvolve3) {
    await sendDreamCallSMS(userPhone, dream.id, "Generation 3 reached. Ready for a metamorphosis?");
    dream.flags = { ...dream.flags, calledOnEvolve3: true };
  }

  // Additional milestone checks
  if (dream.aiScore >= 85 && !dream.flags?.calledOnHighScore) {
    await sendDreamCallSMS(
      userPhone,
      dream.id,
      "AI scored you 85+. This dream is special. What's next?",
    );
    dream.flags = { ...dream.flags, calledOnHighScore: true };
  }

  if (dream.collaborators?.length >= 3 && !dream.flags?.calledOnTeam) {
    await sendDreamCallSMS(
      userPhone,
      dream.id,
      "3+ collaborators joined. Your dream is building a movement.",
    );
    dream.flags = { ...dream.flags, calledOnTeam: true };
  }

  return dream;
}
