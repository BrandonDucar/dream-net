import { ethers } from "ethers";

/**
 * 🌐 Lens Namespace Registrar
 * 
 * Objective: Register 'dreamnet.lens' or 'dreamnet' namespace on Lens V2.
 * Note: Namespace registration requires an authenticated profile/account.
 */

async function registerNamespace() {
  console.log('🌐 [LensRegistrar] Initializing Lens Namespace Registration...');

  // Dynamic import for ESM compatibility
  const { LensClient, production } = await import("@lens-protocol/client");

  // Initialize Lens Client (Production)
  const client = new LensClient({
    environment: production
  });

  // ⚠️ Requirement: Private Key with enough GHO for registration
  const privateKey = process.env.LENS_PRIVATE_KEY;
  if (!privateKey) {
    console.error('❌ [LensRegistrar] LENS_PRIVATE_KEY not found in environment.');
    console.info('👉 Please add your private key to .env to proceed.');
    return;
  }

  const provider = new ethers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY);
  const wallet = new ethers.Wallet(privateKey, provider);

  try {
    // 1. Authenticate with Lens
    console.log('🔑 [LensRegistrar] Authenticating wallet:', wallet.address);
    const { id, text } = await client.authentication.generateChallenge({
        signedBy: wallet.address,
        for: '0x0000000000000000000000000000000000000000' // Placeholder for V2 Account if exists
    });
    
    const signature = await wallet.signMessage(text);
    await client.authentication.authenticate({ id, signature });
    console.log('✅ [LensRegistrar] Authentication successful.');

    // 2. Profile & Handle Management (Lens V2)
    const handleToRegister = 'dreamnet';
    console.log(`📡 [LensRegistrar] Checking availability for handle: ${handleToRegister}...`);

    const isAvailable = await client.handle.isValid(handleToRegister);
    if (!isAvailable) {
        console.warn(`⚠️ [LensRegistrar] Handle '${handleToRegister}' is not available or invalid.`);
        return;
    }

    // 3. GHO Balance Check (Requirement for Profile Creation on Polygon)
    const GHO_POLYGON = "0x40D16FC02446E650302E8E6FCB9E56C9357B626C"; // Check this address
    const ghoContract = new ethers.Contract(GHO_POLYGON, ["function balanceOf(address) view returns (uint256)"], provider);
    const balance = await ghoContract.balanceOf(wallet.address);
    console.log(`💰 [LensRegistrar] GHO Balance: ${ethers.formatEther(balance)} GHO`);

    if (parseFloat(ethers.formatEther(balance)) < 8) {
      console.warn('⚠️ [LensRegistrar] Lens V2 profile creation typically requires ~8 GHO.');
      console.info('👉 Please ensure your Polygon wallet has enough GHO.');
    }

    // 4. Existing Profile Check
    const profiles = await client.profile.fetchAll({
        where: { ownedBy: [wallet.address] }
    });

    let profileId;
    if (profiles.items.length === 0) {
        console.log('👤 [LensRegistrar] No profile found. Attempting to create one...');
        // Note: Full creation requires metadata upload (IPFS).
        // This is a complex step that usually requires a browser/dispatcher.
        console.warn('⚠️ [LensRegistrar] Auto-creation via script is limited. Please create a profile at lens.xyz first.');
        return;
    } else {
        profileId = profiles.items[0].id;
        console.log(`✅ [LensRegistrar] Found existing profile: ${profileId}`);
    }

    // 5. Handle Registration & Linking (Simplified)
    console.log(`🔗 [LensRegistrar] Intent: Register '${handleToRegister}.lens' and link to ${profileId}`);
    
    // In V2, handles are separate. We check if the profile already has a handle.
    const profileWithHandle = await client.profile.fetch({ forProfileId: profileId });
    if (profileWithHandle?.handle) {
        console.log(`✅ [LensRegistrar] Profile already has handle: ${profileWithHandle.handle.fullHandle}`);
    } else {
        console.info(`💡 [LensRegistrar] Profile found but no handle linked. Proceed with on-chain handle creation at: https://lens.xyz/mint`);
    }

    console.log('🧪 [LensRegistrar] Readiness check complete.');

  } catch (error) {
    console.error('❌ [LensRegistrar] Registration failed:', error);
    console.error('🔍 [LensRegistrar] Possible causes: Network mismatch (must be Polygon), insufficient GHO, or Wallet signature rejection.');
  }
}

registerNamespace();
