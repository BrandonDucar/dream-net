

console.log('Testing imports...');

try {
    console.log('Importing agent-wallet-manager...');
    await import('@dreamnet/agent-wallet-manager');
    console.log('✅ agent-wallet-manager imported');
} catch (e) {
    console.error('❌ agent-wallet-manager failed:', e);
}

try {
    console.log('Importing platform-connector...');
    await import('@dreamnet/platform-connector');
    console.log('✅ platform-connector imported');
} catch (e) {
    console.error('❌ platform-connector failed:', e);
}
