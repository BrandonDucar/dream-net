/**
 * DreamNet Bridge API Helpers
 * Wrappers for DreamNet Bridge functions for use in React components
 */

/**
 * Get system status via DreamNet Bridge
 */
export async function getSystemStatus() {
  try {
    const response = await fetch('/api/ops/status');
    if (!response.ok) throw new Error('Failed to fetch system status');
    return await response.json();
  } catch (error) {
    console.error('Error fetching system status:', error);
    // Return mock data as fallback
    return {
      dreams: 127,
      nodes: 45,
      agents: 6,
      clouds: 12,
      wallets: 89,
      apps: 8,
      status: 'online',
    };
  }
}

/**
 * Get agent status via DreamNet Bridge
 */
export async function getAgentStatus() {
  try {
    const response = await fetch('/api/ops/agents');
    if (!response.ok) throw new Error('Failed to fetch agent status');
    return await response.json();
  } catch (error) {
    console.error('Error fetching agent status:', error);
    return null; // Will fall back to mock data
  }
}

/**
 * Get OPS contract summary
 */
export async function getOpsContract() {
  try {
    const response = await fetch('/api/ops/contract');
    if (!response.ok) throw new Error('Failed to fetch OPS contract');
    return await response.json();
  } catch (error) {
    console.error('Error fetching OPS contract:', error);
    return null;
  }
}

/**
 * Validate OPS contract compliance
 */
export async function validateOpsContract() {
  try {
    const response = await fetch('/api/ops/validate');
    if (!response.ok) throw new Error('Failed to validate OPS contract');
    return await response.json();
  } catch (error) {
    console.error('Error validating OPS contract:', error);
    return null;
  }
}


