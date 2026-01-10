
console.log("Testing server deps...");

async function test(name) {
    try {
        await import(name);
        console.log(`✅ ${name} loaded`);
    } catch (e) {
        console.error(`❌ ${name} failed:`, e.message);
    }
}

await test('stripe');
await test('googleapis');
await test('multer');
await test('resend');
await test('@monaco-protocol/client');
await test('@raydium-io/raydium-sdk');
await test('blake3');
await test('bs58');
await test('nanoid');
await test('node-cron');
await test('nodemailer');
await test('ws');

