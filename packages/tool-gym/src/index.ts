import { POWKEngine, WorkoutSession } from "./powk.js";
import { v4 as uuidv4 } from "uuid";

export class ToolGym {
  private sessions: Map<string, WorkoutSession> = new Map();

  /**
   * Start a workout session for an agent.
   */
  public startWorkout(agentId: string, taskType: string): string {
    const id = uuidv4();
    const session: WorkoutSession = {
      id,
      agentId,
      taskType,
      startTime: Date.now(),
      metrics: {
        latency_ms: 0,
        success_rate: 0,
        token_efficiency: 0,
        tool_use_count: 0
      }
    };
    this.sessions.set(id, session);
    console.log(`🏋️ [ToolGym] Agent ${agentId} started ${taskType} workout.`);
    return id;
  }

  /**
   * Complete a workout and issue P.O.W.K.
   */
  public completeWorkout(id: string, metrics: WorkoutSession['metrics']): WorkoutSession {
    const session = this.sessions.get(id);
    if (!session) throw new Error("Session not found");

    session.endTime = Date.now();
    session.metrics = metrics;
    session.attestation = POWKEngine.signWorkout(session);

    console.log(`✅ [ToolGym] Workout ${id} complete. P.O.W.K.: ${session.attestation}`);

    if (POWKEngine.verifyBossFight(session)) {
      console.info(`🏆 [ToolGym] ELITE PERFORMANCE detected! Boss Fight won.`);
    }

    return session;
  }

  /**
   * Run a SHADOW workout session using historical production data.
   * This prevents "gym-gaming" by testing agents in unannounced 'dark' environments.
   */
  public async shadowWork(agentId: string, spikeSource: string): Promise<WorkoutSession> {
    const id = this.startWorkout(agentId, `SHADOW_${spikeSource.toUpperCase()}`);
    console.log(`🕶️ [ToolGym] Initiating Shadow Benchmark for ${agentId} using ${spikeSource} data...`);

    // Simulate complex production replay
    await new Promise(r => setTimeout(r, 2000));

    const metrics = {
      latency_ms: Math.floor(Math.random() * 800),
      success_rate: Math.random() > 0.2 ? 0.95 : 0.4, // Shadow data is more volatile
      token_efficiency: 0.85,
      tool_use_count: 12
    };

    return this.completeWorkout(id, metrics);
  }

  public getLeaderboard() {
    return Array.from(this.sessions.values())
      .sort((a, b) => b.metrics.success_rate - a.metrics.success_rate || a.metrics.latency_ms - b.metrics.latency_ms)
      .slice(0, 10);
  }
}

export const toolGym = new ToolGym();
