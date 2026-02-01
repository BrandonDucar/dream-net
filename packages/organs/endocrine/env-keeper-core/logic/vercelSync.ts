/**
 * Env Keeper - Vercel Sync
 * Syncs environment variables from Vercel projects
 */

import { EnvVariable, EnvCategory } from '../types.js';

/**
 * Discover environment variables from Vercel
 */
export async function discoverFromVercel(): Promise<EnvVariable[]> {
  const discovered: EnvVariable[] = [];
  
  try {
    const token = process.env.VERCEL_TOKEN || process.env.VERCEL_API_TOKEN;
    if (!token) {
      return discovered; // No Vercel token
    }

    const axios = require("axios");
    const VERCEL_API_BASE = "https://api.vercel.com/v9";
    const teamId = process.env.VERCEL_TEAM_ID;

    // Get projects
    const projectsResponse = await axios.get(`${VERCEL_API_BASE}/projects${teamId ? `?teamId=${teamId}` : ""}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const projects = projectsResponse.data.projects || [];

    // Get env vars from each project
    for (const project of projects) {
      try {
        const envResponse = await axios.get(
          `${VERCEL_API_BASE}/projects/${project.id}/env${teamId ? `?teamId=${teamId}` : ""}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const envVars = envResponse.data.envs || [];

        for (const vercelEnv of envVars) {
          const isSecret = vercelEnv.type === "secret" || vercelEnv.type === "encrypted";
          const category: EnvCategory = 
            vercelEnv.key.includes("API") && vercelEnv.key.includes("KEY") ? "api_keys" :
            vercelEnv.key.includes("DB") || vercelEnv.key.includes("DATABASE") ? "database" :
            vercelEnv.key.includes("AUTH") || vercelEnv.key.includes("JWT") ? "auth" :
            "other";

          discovered.push({
            id: `env_${vercelEnv.key.toLowerCase()}_vercel_${project.id}`,
            key: vercelEnv.key,
            value: vercelEnv.value || "[VERCEL_SECRET]", // Vercel doesn't return secret values
            category,
            isSecret,
            required: false,
            environments: vercelEnv.target || ["production"],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            tags: ["vercel", project.name || project.id],
            description: `From Vercel project: ${project.name}`,
          });
        }

        console.log(`[EnvKeeper] 🔄 Synced ${envVars.length} vars from Vercel project: ${project.name}`);
      } catch (error: any) {
        console.warn(`[EnvKeeper] ⚠️  Could not sync Vercel project ${project.name}:`, error.message);
      }
    }
  } catch (error: any) {
    console.warn("[EnvKeeper] ⚠️  Vercel sync error:", error.message);
  }

  return discovered;
}

