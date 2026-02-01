import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
dotenv.config({ path: '../../.env.gcp' }); // Load GCP overrides/additions

function checkKeys() {
    console.log('--- Dual Wallet Offensive Protocol Check ---');

    const phantom = process.env.PHANTOM_PRIVATE_KEY;
    const metamask = process.env.METAMASK_PRIVATE_KEY || process.env.PRIVATE_KEY;

    // Ghost Check (Presence Only)
    if (phantom) console.log('✅ Phantom Key: ARMED');
    else console.log('❌ Phantom Key: MISSING');

    if (metamask) console.log('✅ MetaMask Key (Generic): ARMED');
    else console.log('❌ MetaMask Key: MISSING (Check .env.gcp for PRIVATE_KEY)');
}

checkKeys();
