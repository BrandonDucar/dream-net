import dotenv from 'dotenv';
dotenv.config();

// We use native fetch to avoid dependency issues in this demo
const signers = [
    { id: 'neyclaw-dreamnet', uuid: process.env.NEYCLAW_SIGNER_UUID, apiKey: process.env.EXTRA_API_KEY },
    { id: 'ghostmintops', uuid: process.env.GHOSTMINTOPS_SIGNER_UUID, apiKey: process.env.NEYNAR_API_KEY }
];

async function spikeSocialDemo() {
    console.log("🪙 [CryptoSpike] Detected Bullish Trend for SOL at $145.");
    const message = "🧠 DreamNet Sensory Alert: CryptoSpike detected a bullish trend for $SOL. The swarm is scaling up. ⚛️🪙 #AgenticWeb #DreamNet";

    for (const signer of signers) {
        if (signer.uuid && signer.apiKey) {
            console.log(`📡 [${signer.id}] Broadcasting spike intelligence...`);
            try {
                const res = await fetch('https://api.neynar.com/v2/farcaster/cast', {
                    method: 'POST',
                    headers: { 
                        'x-api-key': signer.apiKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        signer_uuid: signer.uuid,
                        text: message
                    })
                });
                if (res.ok) {
                    console.log(`✅ Success via ${signer.id}`);
                } else {
                    const err: any = await res.json();
                    console.log(`❌ Failed via ${signer.id}: ${err.message}`);
                }
            } catch (e: any) {
                console.log(`❌ Error via ${signer.id}: ${e.message}`);
            }
        }
    }
}

spikeSocialDemo();
