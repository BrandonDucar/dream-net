
console.log('Debugging platform-connector components...');

try {
    console.log('Importing NeynarClient.js...');
    await import('./packages/platform-connector/dist/NeynarClient.js');
    console.log('✅ NeynarClient loaded');
} catch (e) {
    console.error('❌ NeynarClient failed:', e.message);
}

try {
    console.log('Importing OharaBridge.js...');
    await import('./packages/platform-connector/dist/OharaBridge.js');
    console.log('✅ OharaBridge loaded');
} catch (e) {
    console.error('❌ OharaBridge failed:', e.message);
}
