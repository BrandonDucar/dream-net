import { neon } from '@neondatabase/serverless';

export async function onRequest(context) {
  const { env } = context;
  
  if (!env.DATABASE_URL) {
    return new Response(JSON.stringify({ error: "DATABASE_URL not set" }), { status: 500 });
  }

  try {
    const sql = neon(env.DATABASE_URL);
    
    // Query the latest onboarded agents
    const agents = await sql`
      SELECT name, fid, guild_id as cluster 
      FROM swarm_agents 
      WHERE fid IS NOT NULL 
      ORDER BY created_at DESC 
      LIMIT 20
    `;
    
    const stats = await sql`
      SELECT COUNT(*) as total 
      FROM swarm_agents 
      WHERE farcaster_id IS NOT NULL
    `;

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      agents,
      total_onboarded: stats[0].total
    };

    return new Response(JSON.stringify(response), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
