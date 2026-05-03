/**
 * 🔍 Vectorize Setup - Create indexes for 17,000 agent swarm
 * Semantic search for profiles, signals, roasts, and consensus
 */

const VECTORIZE_CONFIG = {
  indexes: {
    'agent-profiles': {
      description: '17,000 agent personality embeddings',
      dimensions: 50,
      vectors_count: 17000,
      metric: 'cosine',
    },
    'signal-embeddings': {
      description: 'Farcaster signal semantic search',
      dimensions: 768,
      vectors_count: 1000000,
      metric: 'cosine',
    },
    'roast-context': {
      description: 'Contextual roast library for Arya',
      dimensions: 384,
      vectors_count: 10000,
      metric: 'cosine',
    },
    'vote-positions': {
      description: 'Guild voting positions for consensus',
      dimensions: 256,
      vectors_count: 17000,
      metric: 'cosine',
    },
  },
};

/**
 * Populate agent profiles index
 */
export async function populateAgentProfiles(env, agents) {
  const vectorize = env.VECTORIZE;
  
  const vectors = agents.map((agent) => ({
    id: agent.id,
    values: generatePersonalityVector(agent),
    metadata: {
      guild: agent.guild,
      tier: agent.tier,
      personality_score: agent.personality_score || 0.65,
    },
  }));

  return await vectorize.insert('agent-profiles', vectors);
}

/**
 * Generate personality embedding (50-dim vector)
 */
function generatePersonalityVector(agent) {
  const traits = agent.personality || {};
  return [
    traits.vicious || 0.5,
    traits.witty || 0.5,
    traits.protective || 0.5,
    traits.playful || 0.5,
    traits.honorable || 0.5,
    traits.audacious || 0.5,
    traits.analytical || 0.5,
    traits.empathetic || 0.5,
    // ... 42 more dimensions for full 50-dim vector
    ...Array.from({ length: 42 }, () => Math.random()),
  ];
}

/**
 * Search for similar agents
 */
export async function findSimilarAgents(env, agentId, topK = 10) {
  const vectorize = env.VECTORIZE;
  
  // Get agent's vector
  const agent = await env.DB.prepare(
    'SELECT * FROM agents WHERE id = ?'
  ).bind(agentId).first();

  if (!agent) return [];

  const agentVector = generatePersonalityVector(agent);

  // Query Vectorize
  const results = await vectorize.query('agent-profiles', agentVector, {
    topK,
    returnMetadata: 'all',
  });

  return results.matches || [];
}

/**
 * Store signal embeddings
 */
export async function storeSignalEmbedding(env, signalId, signalText, embedding) {
  const vectorize = env.VECTORIZE;

  return await vectorize.insert('signal-embeddings', [
    {
      id: signalId,
      values: embedding,
      metadata: {
        text_preview: signalText.substring(0, 100),
        timestamp: Date.now(),
      },
    },
  ]);
}

/**
 * Semantic signal search
 */
export async function searchSignals(env, queryEmbedding, topK = 20) {
  const vectorize = env.VECTORIZE;

  const results = await vectorize.query('signal-embeddings', queryEmbedding, {
    topK,
    returnMetadata: 'all',
  });

  return results.matches || [];
}

/**
 * Store roast with context
 */
export async function storeRoastContext(env, roastId, roast, embedding) {
  const vectorize = env.VECTORIZE;

  return await vectorize.insert('roast-context', [
    {
      id: roastId,
      values: embedding,
      metadata: {
        roast_preview: roast.substring(0, 100),
        sentiment: analyzeSentiment(roast),
      },
    },
  ]);
}

/**
 * Find contextually similar roasts
 */
export async function findSimilarRoasts(env, contextEmbedding, topK = 5) {
  const vectorize = env.VECTORIZE;

  const results = await vectorize.query('roast-context', contextEmbedding, {
    topK,
    returnMetadata: 'all',
  });

  return results.matches || [];
}

/**
 * Store vote position for consensus
 */
export async function storeVotePosition(env, voteId, agentId, position, embedding) {
  const vectorize = env.VECTORIZE;

  return await vectorize.insert('vote-positions', [
    {
      id: voteId,
      values: embedding,
      metadata: {
        agent_id: agentId,
        position,
        timestamp: Date.now(),
      },
    },
  ]);
}

/**
 * Find consensus clusters via vector similarity
 */
export async function findConsensusCluster(env, proposalEmbedding, topK = 11400) {
  const vectorize = env.VECTORIZE;

  const results = await vectorize.query('vote-positions', proposalEmbedding, {
    topK,
    returnMetadata: 'all',
  });

  // Group by position for consensus
  const positions = {};
  results.matches?.forEach((match) => {
    const pos = match.metadata.position;
    positions[pos] = (positions[pos] || 0) + 1;
  });

  // Find 2/3 majority
  const totalVotes = Object.values(positions).reduce((a, b) => a + b, 0);
  const majorityThreshold = Math.ceil((totalVotes * 2) / 3);

  return {
    votes: positions,
    total: totalVotes,
    consensus: Object.entries(positions).find(([_, count]) => count >= majorityThreshold)?.[0],
    majority_threshold: majorityThreshold,
  };
}

// Sentiment analysis helper
function analyzeSentiment(text) {
  const positive = /\b(awesome|great|best|perfect|love|amazing)\b/i.test(text);
  const negative = /\b(worst|bad|hate|sucks|terrible)\b/i.test(text);
  return positive ? 'positive' : negative ? 'negative' : 'neutral';
}

export default {
  config: VECTORIZE_CONFIG,
  populateAgentProfiles,
  findSimilarAgents,
  storeSignalEmbedding,
  searchSignals,
  storeRoastContext,
  findSimilarRoasts,
  storeVotePosition,
  findConsensusCluster,
};
