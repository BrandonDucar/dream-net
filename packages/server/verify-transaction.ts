import { Connection } from '@solana/web3.js';
import { ghostRPC } from './src/services/GhostRPCService.js';

async function verifyTx() {
    const signature = '4VKen9Ei8g3sHeUn6FZwdSSQe8RZDzoW9zpXeX7gCqFgaiKdY1BN1gAbuBBCAtq5QtvqPpwBiEfvfxfCLJ7hauKwS';
    console.log(`Checking signature: ${signature}`);

    // Check multiple endpoints just in case
    const endpoints = [
        'https://api.mainnet-beta.solana.com',
        ghostRPC.getConnection().rpcEndpoint
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`Querying ${endpoint}...`);
            const connection = new Connection(endpoint, 'confirmed');
            const status = await connection.getSignatureStatus(signature);

            console.log(`Status from ${endpoint}:`, JSON.stringify(status.value, null, 2));

            if (status.value === null) {
                console.log('❌ Transaction not found (likely dropped or simulated only).');
            } else {
                if (status.value.err) {
                    console.log('❌ Transaction FAILED on-chain:', status.value.err);
                } else {
                    console.log('✅ Transaction CONFIRMED on-chain.');
                }
            }
        } catch (e) {
            console.error(`Error querying ${endpoint}:`, e.message);
        }
    }
}

verifyTx().catch(console.error);
