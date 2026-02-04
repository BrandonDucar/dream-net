
console.log('Testing registry import...');
try {
    const { agentRegistry } = await import('./packages/organs/integumentary/server/src/agents/core/registry');
    console.log('SUCCESS: Imported registry');
} catch (e) {
    console.error('FAILURE:', e);
}
