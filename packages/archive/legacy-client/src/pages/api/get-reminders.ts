// Fetches all reminders for this user (mock for now)
export default async function handler(req: any, res: any) {
  // Mock data for demonstration - in production, query database
  const mockReminders = [
    {
      id: "rem_001",
      dreamId: "dream_viral_startup",
      userPhone: "+15551234567",
      remindAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      status: "pending",
      tags: ["top-priority", "viral-potential"],
      dream: {
        title: "Viral Startup Revolution",
        viralityMetrics: {
          remixCount: 15,
          shareVelocity: 25,
          saturationLevel: 0.3,
          currentTrend: "ascending"
        },
        emotionalProfile: {
          primaryEmotion: "Excitement",
          intensity: 0.9
        },
        remixLineage: [
          { id: "dream_startup_base", title: "Original Startup Idea", generation: 1 },
          { id: "dream_viral_twist", title: "Viral Marketing Twist", generation: 2 },
          { id: "dream_viral_startup", title: "Viral Startup Revolution", generation: 3 }
        ]
      }
    },
    {
      id: "rem_002", 
      dreamId: "dream_ai_revolution",
      userPhone: "+15551234567",
      remindAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
      status: "pending",
      tags: ["ai-focus", "research"],
      dream: {
        title: "AI Revolution Blueprint",
        viralityMetrics: {
          remixCount: 8,
          shareVelocity: 12,
          saturationLevel: 0.6,
          currentTrend: "ascending"
        },
        emotionalProfile: {
          primaryEmotion: "Curiosity",
          intensity: 0.8
        },
        remixLineage: [
          { id: "dream_ai_base", title: "Basic AI Concepts", generation: 1 },
          { id: "dream_ai_revolution", title: "AI Revolution Blueprint", generation: 2 }
        ]
      }
    },
    {
      id: "rem_003",
      dreamId: "dream_saturated_market",
      userPhone: "+15551234567",
      remindAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
      status: "pending",
      tags: ["market-analysis", "competitive"],
      dream: {
        title: "Saturated Market Analysis",
        viralityMetrics: {
          remixCount: 5,
          shareVelocity: 8,
          saturationLevel: 0.9,
          currentTrend: "declining"
        },
        emotionalProfile: {
          primaryEmotion: "Concern",
          intensity: 0.7
        },
        remixLineage: [
          { id: "dream_market_base", title: "Market Research Basics", generation: 1 },
          { id: "dream_market_trends", title: "Market Trend Analysis", generation: 2 },
          { id: "dream_saturated_market", title: "Saturated Market Analysis", generation: 3 }
        ]
      }
    },
    {
      id: "rem_004",
      dreamId: "dream_creative_block",
      userPhone: "+15551234567",
      remindAt: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // 18 hours from now
      status: "pending",
      tags: ["creative", "brainstorming"],
      dream: {
        title: "Breaking Creative Blocks",
        viralityMetrics: {
          remixCount: 3,
          shareVelocity: 5,
          saturationLevel: 0.2,
          currentTrend: "stable"
        },
        emotionalProfile: {
          primaryEmotion: "Inspiration",
          intensity: 0.6
        },
        remixLineage: [
          { id: "dream_creativity_base", title: "Creative Foundation", generation: 1 }
        ]
      }
    }
  ];

  // Enhanced version with dream data join:
  // const reminders = await db.reminders.findMany({
  //   where: { status: 'pending' },
  //   include: { dream: true },
  //   orderBy: { remindAt: 'asc' }
  // });
  
  res.status(200).json(mockReminders);
}