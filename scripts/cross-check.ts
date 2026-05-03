import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const keys = [
    '71427A76-32AE-4414-B3D7-182F3647BB27',
    '068E8596-32C8-4B4D-B867-C2846EA3EC43'
];

const signers = [
    { name: 'neyclaw-dreamnet', uuid: '54f2136f-5a26-4407-a182-0dd194fa55c8' },
    { name: 'ghostmintops', uuid: '893ffd48-d6f6-4226-a25e-6a17bee8a752' }
];

async function crossCheck() {
    console.log('🔄 [Diagnostic] Cross-checking Signer/API Key pairings...\n');

    for (const key of keys) {
        console.log(`🔑 Testing API Key: ${key.slice(0, 8)}...`);
        for (const signer of signers) {
            try {
                const url = `https://api.neynar.com/v2/farcaster/signer/?signer_uuid=${signer.uuid}`;
                const response = await axios.get(url, {
                    headers: { 'x-api-key': key }
                });
                console.log(`   ✅ [${signer.name}] Works! Status: ${response.data.status}`);
                if (response.data.user) {
                    console.log(`      User: @${response.data.user.username}`);
                }
            } catch (e: any) {
                console.log(`   ❌ [${signer.name}] Failed: ${e.response?.data?.message || e.message}`);
            }
        }
        console.log('');
    }
}

crossCheck();
