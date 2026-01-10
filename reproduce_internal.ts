
console.log("Testing internal packages...");

async function test(name) {
    console.log(`Testing ${name}...`);
    try {
        await import(name);
        console.log(`✅ ${name} loaded`);
    } catch (e) {
        console.error(`❌ ${name} failed:`, e.message);
    }
}

// Order matches server imports somewhat
// await test('@dreamnet/nerve');
await test('@dreamnet/dreamnet-os-core');
await test('@dreamnet/factory'); // Server imports routes/factory which imports this
await test('@dreamnet/dreamnet-control-core');
await test('@dreamnet/memory-dna');
await test('@dreamnet/aethersafe');
await test('@dreamnet/agents');
await test('@dreamnet/wolf-pack');
await test('@dreamnet/wolfpack-mailer-core');
await test('@dreamnet/spider-web-core'); // Indirect
