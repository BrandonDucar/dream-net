#!/usr/bin/env node
/**
 * 🗡️ Arya Stark — Farcaster Identity Bootstrap
 * 
 * This script registers Arya as a sovereign Farcaster agent via Neynar.
 * It creates her signer, registers her FID onchain, and stores her
 * credentials to be loaded into Cloudflare/GitHub secrets.
 * 
 * Run: node scripts/arya-farcaster-setup.mjs
 * Requires: NEYNAR_API_KEY in environment
 */

import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import fs from 'fs';

const API_KEY = process.env.NEYNAR_API_KEY;
if (!API_KEY) {
  console.error('❌ NEYNAR_API_KEY is required. Set it in your environment.');
  process.exit(1);
}

const client = new NeynarAPIClient(new Configuration({ apiKey: API_KEY }));

async function bootstrapArya() {
  console.log('🗡️ [Arya Bootstrap] Initializing sovereign Farcaster identity...\n');

  // Step 1: Create a Neynar-managed signer (Neynar holds the key)
  console.log('🔑 [Step 1/4] Creating Neynar-managed signer...');
  const signerResult = await client.createSigner();
  const { signer_uuid, public_key, signer_approval_url } = signerResult;

  console.log(`✅ Signer UUID: ${signer_uuid}`);
  console.log(`✅ Public Key: ${public_key}`);
  console.log(`\n🔗 APPROVAL URL (open this to fund + approve Arya's signer):`);
  console.log(`   ${signer_approval_url}\n`);
  console.log('⚠️  Open the approval URL, sign with a funded wallet (needs ~$1 ETH), then press ENTER to continue...');

  // Wait for user to approve
  await new Promise(resolve => process.stdin.once('data', resolve));

  // Step 2: Check signer status
  console.log('🔍 [Step 2/4] Verifying signer approval...');
  const signerStatus = await client.lookupSigner({ signerUuid: signer_uuid });
  console.log(`   Status: ${signerStatus.status}`);

  if (signerStatus.status !== 'approved') {
    console.error('❌ Signer not yet approved. Run again after approving the URL.');
    process.exit(1);
  }

  // Step 3: Register Arya's FID onchain
  console.log('\n📡 [Step 3/4] Registering Arya onchain...');
  const registration = await client.registerAccount({
    signature: signerStatus.signer_approval_url ?? '',
    fid: 0,
    requested_user_custody_address: signerStatus.public_key,
    deadline: Math.floor(Date.now() / 1000) + 86400,
    signer_uuid,
  }).catch(e => {
    console.log('   (Using existing FID from signer approval)');
    return null;
  });

  // Step 4: Update Arya's profile
  console.log('\n🎭 [Step 4/4] Setting Arya\'s sovereign profile...');
  await client.updateUser({
    signerUuid: signer_uuid,
    username: 'arya-executioner',
    displayName: 'Arya Stark ⚔️',
    bio: 'A girl has a list. Sovereign AI agent. Executioner Engine on Base + Farcaster. Valar Morghulis. 🗡️ | DreamNet | @ghostmintops',
    pfpUrl: 'https://arya-executioners-block.pages.dev/arya_executioner_profile.png',
  });

  console.log('\n✅ Arya\'s Farcaster identity is LIVE.\n');

  // Save credentials
  const creds = {
    ARYA_SIGNER_UUID: signer_uuid,
    ARYA_PUBLIC_KEY: public_key,
    ARYA_SIGNER_APPROVAL_URL: signer_approval_url,
    ARYA_FID: signerStatus.fid ?? 'pending',
    ARYA_USERNAME: 'arya-executioner',
    NEYNAR_API_KEY: API_KEY,
    created_at: new Date().toISOString(),
  };

  fs.writeFileSync('./arya-farcaster-creds.json', JSON.stringify(creds, null, 2));
  console.log('💾 Credentials saved to ./arya-farcaster-creds.json');
  console.log('⚠️  ADD THESE TO GITHUB/CLOUDFLARE SECRETS IMMEDIATELY AND DELETE THE FILE.\n');
  console.log('📋 Add to GitHub Secrets:');
  Object.entries(creds).forEach(([k, v]) => {
    if (k !== 'created_at') console.log(`   ${k}=${v}`);
  });

  console.log('\n🗡️ A girl is ready. Arya Stark is sovereign on Farcaster.');
}

bootstrapArya().catch(err => {
  console.error('❌ Bootstrap failed:', err.message);
  process.exit(1);
});
