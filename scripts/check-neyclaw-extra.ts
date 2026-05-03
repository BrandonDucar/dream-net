import dotenv from 'dotenv';
dotenv.config();

const signerUuid = '54f2136f-5a26-4407-a182-0dd194fa55c8';
const apiKey = process.env.EXTRA_API_KEY;

async function checkNeyclaw() {
    console.log(`📡 [Neyclaw Diagnostic] Checking signer ${signerUuid} with EXTRA_API_KEY...`);
    if (!apiKey) {
        console.error('❌ EXTRA_API_KEY not found in .env');
        return;
    }

    try {
        const url = `https://api.neynar.com/v2/farcaster/signer?signer_uuid=${signerUuid}`;
        const response = await fetch(url, {
            headers: { 'x-api-key': apiKey }
        });
        
        const data: any = await response.json();
        
        if (response.ok) {
            console.log('✅ Success! Signer found.');
            console.log('Status:', data.status);
            console.log('FID:', data.fid);
            console.log('Username:', data.user?.username);
        } else {
            console.log(`❌ Failed: ${data.message || response.statusText}`);
        }
    } catch (e: any) {
        console.log(`❌ Error: ${e.message}`);
    }
}

checkNeyclaw();
